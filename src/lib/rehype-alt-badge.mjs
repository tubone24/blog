/**
 * ALTバッジプラグイン (no-op)
 *
 * ALTバッジの実装はクライアントサイドJSで行っている。
 * 理由: PostContentのレンダリングがrehype処理後にstatic HTMLとして
 * content-white-innerに出力されないため、rehypeでのDOM操作が効かない。
 *
 * 実際の実装は src/pages/[...slug].astro の <script> タグ内で
 * DOMContentLoaded時にimg要素をスキャンしてALTバッジを動的に追加している。
 * スタイルは src/styles/global.scss の .alt-badge-* クラスで定義。
 */
export default function rehypeAltBadge() {
  return () => {};
}
