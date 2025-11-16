import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/**
 * すべてのブログ記事を読み込む
 * @returns {Array} 記事のメタデータと内容の配列
 */
export function getAllPosts() {
  try {
    const files = fs.readdirSync(CONTENT_DIR);
    const markdownFiles = files.filter(
      (file) => file.endsWith(".md") && file !== "README.md"
    );

    const posts = markdownFiles.map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug: data.slug || filename.replace(".md", ""),
        title: data.title || "",
        date: data.date || "",
        description: data.description || "",
        tags: data.tags || [],
        headerImage: data.headerImage || "",
        templateKey: data.templateKey || "blog-post",
        content: content,
        filename: filename,
      };
    });

    // 日付の降順でソート
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error reading posts:", error);
    throw error;
  }
}

/**
 * スラッグで記事を取得
 * @param {string} slug - 記事のスラッグ
 * @returns {Object|null} 記事データ、見つからない場合はnull
 */
export function getPostBySlug(slug) {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * タグで記事をフィルタリング
 * @param {string} tag - タグ名
 * @returns {Array} フィルタリングされた記事の配列
 */
export function getPostsByTag(tag) {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * すべてのタグを取得
 * @returns {Array} ユニークなタグの配列
 */
export function getAllTags() {
  const posts = getAllPosts();
  const tagsSet = new Set();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

/**
 * 日付範囲で記事をフィルタリング
 * @param {string} startDate - 開始日 (ISO 8601形式)
 * @param {string} endDate - 終了日 (ISO 8601形式)
 * @returns {Array} フィルタリングされた記事の配列
 */
export function getPostsByDateRange(startDate, endDate) {
  const posts = getAllPosts();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return posts.filter((post) => {
    const postDate = new Date(post.date);
    return postDate >= start && postDate <= end;
  });
}

/**
 * キーワードで記事を検索
 * @param {string} keyword - 検索キーワード
 * @returns {Array} マッチした記事の配列
 */
export function searchPosts(keyword) {
  const posts = getAllPosts();
  const lowerKeyword = keyword.toLowerCase();

  return posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.description.toLowerCase().includes(lowerKeyword) ||
      post.content.toLowerCase().includes(lowerKeyword) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    );
  });
}

/**
 * 記事のサマリーを作成（コンテンツを含まない軽量版）
 * @param {Object} post - 記事オブジェクト
 * @returns {Object} サマリー
 */
export function createPostSummary(post) {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    headerImage: post.headerImage,
  };
}
