import type { APIContext, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../lib/og-image";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
  const paths: { params: { path: string }; props: { title: string } }[] = [];

  // 記事ページ
  for (const post of posts) {
    paths.push({
      params: { path: post.slug },
      props: { title: post.data.title },
    });
  }

  // タグページ
  const allTags = [
    ...new Set(posts.flatMap((p) => p.data.tags || []).filter(Boolean)),
  ];
  for (const tag of allTags) {
    paths.push({
      params: { path: `tag/${tag}` },
      props: { title: `${tag} の記事一覧` },
    });
  }

  // 年別ページ
  const years = [
    ...new Set(
      posts.map((p) => new Date(p.data.date).getFullYear().toString()),
    ),
  ];
  for (const year of years) {
    const count = posts.filter(
      (p) => new Date(p.data.date).getFullYear().toString() === year,
    ).length;
    paths.push({
      params: { path: year },
      props: { title: `${year}年の記事 (${count}件)` },
    });
  }

  // 月別ページ
  const yearMonths = new Set<string>();
  posts.forEach((post) => {
    const d = new Date(post.data.date);
    const year = d.getFullYear().toString();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    yearMonths.add(`${year}/${month}`);
  });
  for (const ym of yearMonths) {
    const [year, month] = ym.split("/");
    const count = posts.filter((p) => {
      const d = new Date(p.data.date);
      return (
        d.getFullYear().toString() === year &&
        String(d.getMonth() + 1).padStart(2, "0") === month
      );
    }).length;
    paths.push({
      params: { path: `${year}/${month}` },
      props: { title: `${year}年${month}月の記事 (${count}件)` },
    });
  }

  // ページネーション（1ページ10件、ページ1はindex、ページ2以降がpages/N）
  const POSTS_PER_PAGE = 10;
  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  for (let page = 2; page <= totalPages; page++) {
    paths.push({
      params: { path: `pages/${page}` },
      props: { title: "tubone BOYAKI" },
    });
  }

  // 静的ページ
  paths.push({ params: { path: "index" }, props: { title: "tubone BOYAKI" } });
  paths.push({ params: { path: "tags" }, props: { title: "タグ一覧" } });
  paths.push({
    params: { path: "privacy-policies" },
    props: { title: "Privacy Policies" },
  });

  return paths;
};

export async function GET({ props }: APIContext) {
  const png = await generateOgImage(props.title as string);
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
