import { visit } from 'unist-util-visit';

// oEmbed (YouTube 等) の iframe を .oembed-container.video でラップする
// remark-embedder が hName/hChildren/hProperties 経由で構造化された iframe を
// 吐くため、rehype 段階では通常の hast element として扱える。
const VIDEO_SRC_PATTERNS = [
  /\/\/(www\.)?youtube\.com\/embed\//i,
  /\/\/(www\.)?youtube-nocookie\.com\/embed\//i,
  /\/\/player\.vimeo\.com\//i,
];

function isVideoIframe(node) {
  if (node.tagName !== 'iframe') return false;
  const src = node.properties?.src;
  if (typeof src !== 'string') return false;
  return VIDEO_SRC_PATTERNS.some((re) => re.test(src));
}

export default function rehypeEmbedWrapper() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      if (!isVideoIframe(node)) return;

      // すでにラップ済みならスキップ（冪等性）
      if (
        parent.type === 'element'
        && parent.tagName === 'div'
        && Array.isArray(parent.properties?.className)
        && parent.properties.className.includes('oembed-container')
      ) {
        return;
      }

      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['oembed-container', 'video'] },
        children: [node],
      };

      parent.children[index] = wrapper;
    });
  };
}
