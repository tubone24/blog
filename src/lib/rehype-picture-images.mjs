import { visit } from 'unist-util-visit';

export default function rehypePictureImages() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img') return;

      const src = node.properties?.src;
      if (!src) return;

      // Only process local blog images (not GIFs)
      if (!src.startsWith('/images/blog/') || src.endsWith('.gif')) return;

      // Generate WebP URL
      const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');

      // Create <picture> element wrapping the <img>
      const pictureNode = {
        type: 'element',
        tagName: 'picture',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'source',
            properties: {
              srcSet: webpSrc,
              type: 'image/webp',
            },
            children: [],
          },
          node, // the original <img>
        ],
      };

      // Replace the <img> with <picture> in the parent
      if (parent && typeof index === 'number') {
        parent.children[index] = pictureNode;
      }
    });
  };
}
