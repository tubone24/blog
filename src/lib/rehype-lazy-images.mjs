import { visit } from 'unist-util-visit';

export default function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties = {
          ...node.properties,
          ...(!node.properties?.loading && { loading: 'lazy' }),
          ...(!node.properties?.decoding && { decoding: 'async' }),
        };
      }
    });
  };
}
