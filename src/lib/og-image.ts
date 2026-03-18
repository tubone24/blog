import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// モジュールスコープで一度だけ読み込む（パフォーマンス）
const fontData = readFileSync(
  join(process.cwd(), "src/assets/fonts/KaiseiTokumin-Bold.ttf"),
);

const iconData = readFileSync(join(process.cwd(), "src/assets/icon.png"));
const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;

const logoData = readFileSync(join(process.cwd(), "static/assets/logo3.svg"));
const logoBase64 = `data:image/svg+xml;base64,${logoData.toString("base64")}`;

export async function generateOgImage(title: string): Promise<Uint8Array> {
  const element = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#8af18a",
        position: "relative" as const,
      },
      children: [
        // ロゴ（左上に配置）
        {
          type: "img",
          props: {
            src: logoBase64,
            width: 120,
            height: 40,
            style: {
              position: "absolute" as const,
              top: "18px",
              left: "20px",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              width: "1110px",
              height: "540px",
              backgroundColor: "#F6FAFD",
              borderRadius: "40px",
              boxShadow: "2.4px 2.4px 4.1px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between",
              padding: "60px 80px",
              position: "relative" as const,
            },
            children: [
              // タイトルテキスト
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "1",
                    width: "100%",
                    paddingBottom: "20px",
                  },
                  children: {
                    type: "div",
                    props: {
                      style: {
                        color: "#555",
                        fontSize: "64px",
                        fontFamily: "KaiseiTokumin",
                        fontWeight: 700,
                        textAlign: "center" as const,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical" as const,
                        wordBreak: "break-word" as const,
                      },
                      children: title,
                    },
                  },
                },
              },
              // フッターエリア（アイコン + 著者名）
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  },
                  children: [
                    // アイコン画像
                    {
                      type: "img",
                      props: {
                        src: iconBase64,
                        width: 100,
                        height: 100,
                      },
                    },
                    // 著者名
                    {
                      type: "div",
                      props: {
                        style: {
                          color: "#aaa",
                          fontSize: "48px",
                          fontFamily: "KaiseiTokumin",
                          fontWeight: 700,
                        },
                        children: "by tubone24",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  // satoriの型定義はReactNodeを要求するが、実際にはelement treeオブジェクトを受け付ける
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "KaiseiTokumin",
        data: fontData,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Uint8Array(pngBuffer);
}
