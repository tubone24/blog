import * as Sentry from "@sentry/node";
import * as opentype from "opentype.js";
import sharp from "sharp";
import { getStore } from "@netlify/blobs";

Sentry.init({
  dsn: "https://3bba1fab248c0e15ece4294929ec4185@o302352.ingest.us.sentry.io/4506916048732160",
  tracesSampleRate: 1.0,
});

export const config = {
  path: "/functions/ogp.png",
};

export const handler = async (event, context) => {
  return await Sentry.startSpan(
    { name: "ogp transaction", op: "blog" },
    async () => {
      console.log(event);
      console.log(context);
      const rawData = Buffer.from(event.blobs, "base64");
      const data = JSON.parse(rawData.toString("ascii"));
      const queryStringParameters = event.queryStringParameters;

      const title = queryStringParameters.title?.toString() || "Hello, World!";
      const user =
        `by ` + (queryStringParameters.user?.toString() || "tubone24");

      try {
        const ogp = getStore({
          name: "ogp",
          token: data.token,
          siteID: "3751ef40-b145-4249-9657-39d3fb04ae81",
        });
        const ogpArrayBuf = await ogp.get(`${encodeURIComponent(title)}`, {
          type: "arrayBuffer",
        });

        if (ogpArrayBuf !== null) {
          return {
            statusCode: 200,
            headers: {
              "Content-Type": "image/png",
            },
            body: Buffer.from(Buffer.from(ogpArrayBuf)).toString("base64"),
            isBase64Encoded: true,
          };
        }

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

      <!-- 背景 (緑色) -->
      <rect style="fill:#8af18a;" width="100%" height="100%" />

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
          color: "#aaa",
          lines: 1,
        })}
      </g>
    </svg>`;

        console.log(svg);

        // sharp: SVG画像をPNG画像に変換
        const buffer = await sharp(Buffer.from(svg))
          // アイコン合成
          .composite([
            {
              input: "./static/assets/prIxc3vbVpBQEws1710503052_1710503091.png",
              left: 80,
              top: 450,
            },
          ])
          .png()
          .toBuffer();

        const arrayBuf = new Uint8Array(buffer).buffer;

        await ogp.set(`${encodeURIComponent(title)}`, arrayBuf, {
          createdAt: new Date(),
        });

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "image/png",
          },
          body: Buffer.from(buffer).toString("base64"),
          isBase64Encoded: true,
        };
      } catch (error) {
        Sentry.captureException(error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: error.message }),
        };
      }
    }
  );
};

function generateTextPath(text, width, lineHight, textOptions) {
  // opentype: フォントの読み込み
  const font = opentype.loadSync("./functions/src/KaiseiTokumin-Bold.ttf");

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
