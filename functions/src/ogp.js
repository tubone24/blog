import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { ProfilingIntegration } from "@sentry/profiling-node";
import * as opentype from "opentype.js";
import * as sharp from "sharp";

Sentry.init({
  dsn: "https://a01a46773c8342dfa4d199c36a30fc28@o302352.ingest.sentry.io/6347154",
  tracesSampleRate: 1.0,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "blog",
  name: "github cors transaction",
});

// opentype: フォントの読み込み
const font = opentype.loadSync(
  "https://github.com/tubone24/blog/raw/cdbc8b20e756d8c0ca9a1a7e1779cfa6201e02b8/functions/src/KaiseiTokumin-Bold.ttf"
);

exports.handler = async (event, context) => {
  console.log(event);
  console.log(context);
  const queryStringParameters = event.queryStringParameters;

  const title = queryStringParameters.title?.toString() || "Hello, World!";
  const user = `by ` + (queryStringParameters.user?.toString() || "tubone24");

  try {
    // SVGを生成
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${1200}" height="${630}">
      <!-- フィルター定義 -->
      <defs>
        <!-- 影フィルター -->
        <filter id="filter1" x="-0.0164" y="-0.0312">
          <feFlood flood-opacity="0.1" flood-color="rgb(0,0,0)" result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1" />
          <feGaussianBlur in="composite1" stdDeviation="4.1" result="blur" />
          <feOffset dx="2.4" dy="2.4" result="offset" />
          <feComposite in="SourceGraphic" in2="offset" operator="over" result="composite2" />
        </filter>
      </defs>

      <!-- 背景 (灰色) -->
      <rect style="fill:#E9E9E9;" width="100%" height="100%" />

      <!-- 四角角丸 (水色) -->
      <rect
        style="fill:#F6FAFD;"
        width="1110"
        height="540"
        x="40.0"
        y="40.0"
        ry="40.0"
        filter="url(#filter1)" />

      <!-- 指定した文字列をSVGパスに変換 -->
      <g transform="translate(150, 150)">
        ${generateTextPath(title, 900, 64, {
          align: "center",
          color: "#555",
          lines: 3,
        })}
      </g>

      <!-- ユーザー名をSVGパスに変換 -->
      <g transform="translate(150, 470)">
        ${generateTextPath(user, 900, 48, {
          align: "right",
          color: "#ccc",
          lines: 1,
        })}
      </g>
    </svg>`;

    // sharp: SVG画像をPNG画像に変換
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

    transaction.finish();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "'image/png'",
      },
      body: new Buffer(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    Sentry.captureException(error);
    transaction.finish();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function generateTextPath(text, width, lineHight, textOptions) {
  // テキストオプションのデフォルト値を設定
  textOptions = {
    align: textOptions?.align ?? `left`,
    color: textOptions?.color ?? `#000`,
    lines: textOptions?.lines ?? 1,
  };

  // opentype: 描画オプション
  const renderOptions = {};

  const columns = [""];

  // STEP1: 改行位置を算出して行ごとに分解
  for (let i = 0; i < text.length; i++) {
    // 1文字取得
    const char = text.charAt(i);

    // opentype: 改行位置を算出する為に長さを計測
    const measureWidth = font.getAdvanceWidth(
      columns[columns.length - 1] + char,
      lineHight,
      renderOptions
    );

    // 改行位置を超えている場合
    if (width < measureWidth) {
      // 次の行にする
      columns.push(``);
    }

    // 現在行に1文字追加
    columns[columns.length - 1] += char;
  }

  const paths = [];

  // STEP2: 行ごとにSVGパスを生成
  for (let i = 0; i < columns.length; i++) {
    // opentype: 1行の長さを計測
    const measureWidth = font.getAdvanceWidth(
      columns[i],
      lineHight,
      renderOptions
    );

    const fontScale = (1 / font.unitsPerEm) * lineHight;
    const height = (font.ascender - font.descender) * fontScale;

    let offsetX = 0;

    // 揃える位置に応じてオフセットを算出
    if (textOptions.align === `right`) {
      offsetX = width - measureWidth;
    } else if (textOptions.align === `center`) {
      offsetX = (width - measureWidth) / 2;
    } else {
      offsetX = 0;
    }

    // opentype: １行分の文字列をパスに変換
    const path = font.getPath(
      columns[i],
      offsetX,
      height * i + height,
      lineHight,
      renderOptions
    );

    // 文字色を指定
    path.fill = textOptions.color;

    paths.push(path);
  }

  // STEP3: 指定した行数を超えていれば制限する
  if (textOptions.lines < paths.length) {
    paths.length = textOptions.lines;
  }

  // STEP4: 複数行を結合
  return paths.map((path) => path.toSVG(2)).join();
}
