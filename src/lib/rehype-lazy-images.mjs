import { visit } from 'unist-util-visit';

export default function rehypeLazyImages() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && !node.properties?.loading) {
        node.properties = {
          ...node.properties,
          loading: 'lazy',
        };
      }
    });
  };
}
