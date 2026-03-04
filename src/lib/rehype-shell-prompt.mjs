import { visit } from 'unist-util-visit';

/**
 * シェルプロンプト表示プラグイン。
 * rehype-prism-plusの後で実行。
 *
 * data-prompt-user / data-prompt-host 属性を持つ <code> を検出し、
 * 各 .code-line の先頭に `user@host $ ` プロンプトspanを挿入する。
 * プロンプト部分は user-select: none でコピー対象外。
 */
export default function rehypeShellPrompt() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'code') return;

      const promptUser = node.properties?.['data-prompt-user'] || node.properties?.dataPromptUser;
      const promptHost = node.properties?.['data-prompt-host'] || node.properties?.dataPromptHost;

      if (!promptUser) return;

      const promptText = promptHost
        ? `${promptUser}@${promptHost} $ `
        : `${promptUser} $ `;

      // <pre> 親要素にクラスを追加
      const promptSpan = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['shell-prompt'] },
        children: [{ type: 'text', value: promptText }],
      };

      // code直下の .code-line を探してプロンプトを挿入
      if (node.children) {
        for (const child of node.children) {
          if (
            child.type === 'element' &&
            child.tagName === 'span' &&
            child.properties?.className?.includes('code-line')
          ) {
            // code-lineの先頭にプロンプトspanを挿入
            child.children.unshift({ ...promptSpan });
          }
        }
      }

      // code-lineが見つからない場合（rehype-prism-plusが行分割しなかった場合）
      // テキストノードを直接処理
      const hasCodeLines = node.children?.some(
        (c) => c.type === 'element' && c.properties?.className?.includes('code-line')
      );

      if (!hasCodeLines && node.children) {
        // テキスト内容を行ごとに分割してプロンプトを追加
        const newChildren = [];
        for (const child of node.children) {
          if (child.type === 'text') {
            const lines = child.value.split('\n');
            lines.forEach((line, i) => {
              if (i > 0) newChildren.push({ type: 'text', value: '\n' });
              if (line.length > 0) {
                newChildren.push({ ...promptSpan });
                newChildren.push({ type: 'text', value: line });
              }
            });
          } else {
            newChildren.push(child);
          }
        }
        node.children = newChildren;
      }
    });
  };
}
