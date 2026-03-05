import { visit } from 'unist-util-visit';

/**
 * シェルプロンプト表示プラグイン。
 * rehype-prism-plusの後で実行。
 *
 * data-prompt-user / data-prompt-host 属性を持つ <code> を検出し、
 * 各 .code-line の先頭に `user@host $ ` プロンプトspanを挿入する。
 * プロンプト部分は user-select: none でコピー対象外。
 *
 * $ プレフィックス方式:
 *   - 行が「$ 」で始まる場合: コマンド行としてプロンプト挿入、「$ 」は除去
 *   - 行が「$ 」で始まらない場合: 出力行として shell-output クラスを付与
 *   - どの行にも「$ 」がない場合: 後方互換として全行にプロンプト挿入
 */
export default function rehypeShellPrompt() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'code') return;

      const promptUser = node.properties?.['data-prompt-user'] || node.properties?.dataPromptUser;
      const promptHost = node.properties?.['data-prompt-host'] || node.properties?.dataPromptHost;

      if (!promptUser) return;

      // <pre> 親要素に shell-dark クラスを追加
      if (parent && parent.tagName === 'pre') {
        if (!parent.properties) parent.properties = {};
        if (!parent.properties.className) parent.properties.className = [];
        if (Array.isArray(parent.properties.className) && !parent.properties.className.includes('shell-dark')) {
          parent.properties.className.push('shell-dark');
        }
      }

      const promptText = promptHost
        ? `${promptUser}@${promptHost} $ `
        : `${promptUser} $ `;

      const promptSpan = {
        type: 'element',
        tagName: 'span',
        properties: { className: ['shell-prompt'] },
        children: [{ type: 'text', value: promptText }],
      };

      // code直下の .code-line を探す
      const codeLines = node.children?.filter(
        (c) => c.type === 'element' && c.tagName === 'span' && c.properties?.className?.includes('code-line')
      ) || [];

      if (codeLines.length > 0) {
        // $ プレフィックスの有無を判定
        const hasDollarPrefix = codeLines.some((line) => {
          const text = getTextContent(line);
          return text.startsWith('$ ');
        });

        for (const child of codeLines) {
          const text = getTextContent(child);

          if (hasDollarPrefix) {
            // 新方式: $ プレフィックスでコマンド/出力を区別
            if (text.startsWith('$ ')) {
              // コマンド行: 「$ 」を除去してプロンプトを挿入
              stripDollarPrefix(child);
              child.children.unshift({ ...promptSpan });
            } else if (text.trim().length > 0) {
              // 出力行: shell-output クラスを追加
              if (!child.properties.className) child.properties.className = [];
              child.properties.className.push('shell-output');
            }
          } else {
            // 後方互換: 全行にプロンプトを挿入
            if (text.trim().length > 0) {
              child.children.unshift({ ...promptSpan });
            }
          }
        }
        return;
      }

      // code-lineが見つからない場合（rehype-prism-plusが行分割しなかった場合）
      // テキストノードを直接処理（後方互換動作）
      if (node.children) {
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

/**
 * code-line spanのテキスト内容を再帰的に取得
 */
function getTextContent(node) {
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}

/**
 * code-line span先頭の「$ 」テキストを除去する。
 * Prismトークン化後のDOMを考慮し、最初のテキストノードから「$ 」を除去する。
 */
function stripDollarPrefix(codeLine) {
  if (!codeLine.children) return;

  for (let i = 0; i < codeLine.children.length; i++) {
    const child = codeLine.children[i];

    if (child.type === 'text' && child.value) {
      if (child.value.startsWith('$ ')) {
        child.value = child.value.substring(2);
        if (child.value === '') {
          codeLine.children.splice(i, 1);
        }
        return;
      }
      // テキストが空でない場合はここで終了（$ が先頭にない）
      if (child.value.trim().length > 0) return;
    }

    // Prismのspan要素内のテキストもチェック
    if (child.type === 'element' && child.children) {
      const innerText = getTextContent(child);
      if (innerText.startsWith('$ ')) {
        stripDollarPrefixRecursive(child);
        return;
      }
      if (innerText.trim().length > 0) return;
    }
  }
}

/**
 * ネストされた要素から再帰的に「$ 」を除去
 */
function stripDollarPrefixRecursive(node) {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === 'text' && child.value && child.value.startsWith('$ ')) {
      child.value = child.value.substring(2);
      if (child.value === '') {
        node.children.splice(i, 1);
      }
      return;
    }
    if (child.type === 'element') {
      stripDollarPrefixRecursive(child);
      return;
    }
  }
}
