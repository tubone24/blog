import { visit } from 'unist-util-visit';

/**
 * Gatsby式コードフェンスメタデータをrehype-prism-plus互換形式に変換するrehypeプラグイン。
 *
 * markdownパーサーはinfo stringをスペースで分割するため:
 *   `javascript{numberLines: 5}{3}` →
 *     className: `language-javascript{numberLines:`, metastring: `5}{3}`
 *
 * このプラグインはクラス名の不完全な `{` とmetastringを結合し、
 * 正しく解析してrehype-prism-plus互換形式に変換する。
 */
export default function rehypeGatsbyCodeMeta() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'code') return;

      const classNames = node.properties?.className || [];
      let existingMeta = node.properties?.metastring || node.data?.meta || '';
      let modified = false;

      const newClassNames = classNames.map((cls) => {
        if (typeof cls !== 'string') return cls;

        // language-xxx{...} のパターンを検出
        const braceIndex = cls.indexOf('{');
        if (braceIndex === -1) return cls;

        const langPart = cls.substring(0, braceIndex);
        const trailingMeta = cls.substring(braceIndex);

        // クラス名内の不完全な{...をmetastringと結合して完全なメタ文字列を復元
        // 例: trailingMeta="{numberLines:" + existingMeta="5}{3}" → "{numberLines: 5}{3}"
        let fullMeta;
        if (!trailingMeta.endsWith('}') && existingMeta) {
          fullMeta = trailingMeta + ' ' + existingMeta;
          existingMeta = ''; // 結合済みなので既存メタはクリア
        } else {
          fullMeta = trailingMeta;
        }

        // メタデータ部分を解析
        parseGatsbyMeta(fullMeta, node);
        modified = true;
        return langPart;
      });

      if (modified) {
        node.properties.className = newClassNames;

        // 残ったexistingMeta（結合されなかった場合）も処理
        if (existingMeta) {
          parseGatsbyMeta(existingMeta, node);
        }

        // 変換後のメタ文字列を構築
        const newMeta = buildMetastring(node);
        if (newMeta) {
          node.properties.metastring = newMeta;
          if (!node.data) node.data = {};
          node.data.meta = newMeta;
        }

        // data-file 属性を <pre> 親要素にもコピー
        if (node.properties?.['data-file'] && parent?.tagName === 'pre') {
          if (!parent.properties) parent.properties = {};
          parent.properties['data-file'] = node.properties['data-file'];
        }
      }
    });
  };
}

/**
 * Gatsby式メタデータ文字列を解析し、node上にメタ情報を蓄積
 */
function parseGatsbyMeta(metaPart, node) {
  if (!node._gatsbyMeta) node._gatsbyMeta = { parts: [] };

  // すべての {...} ブロックを抽出
  const regex = /\{([^}]*)\}/g;
  let match;

  while ((match = regex.exec(metaPart)) !== null) {
    const content = match[1].trim();

    // {numberLines: N} → showLineNumbers=N
    const numberLinesMatch = content.match(/^numberLines:\s*(\d+)$/);
    if (numberLinesMatch) {
      node._gatsbyMeta.parts.push(`showLineNumbers=${numberLinesMatch[1]}`);
      continue;
    }

    // {numberLines: true} または {numberLines} → showLineNumbers
    if (content === 'numberLines' || content === 'numberLines: true') {
      node._gatsbyMeta.parts.push('showLineNumbers');
      continue;
    }

    // {promptUser: name} → data属性に変換
    const promptUserMatch = content.match(/^promptUser:\s*(.+)$/);
    if (promptUserMatch) {
      if (!node.properties) node.properties = {};
      node.properties['data-prompt-user'] = promptUserMatch[1].trim();
      continue;
    }

    // {promptHost: host} → data属性に変換
    const promptHostMatch = content.match(/^promptHost:\s*(.+)$/);
    if (promptHostMatch) {
      if (!node.properties) node.properties = {};
      node.properties['data-prompt-host'] = promptHostMatch[1].trim();
      continue;
    }

    // {file: "path/to/file"} → data属性に変換
    const fileMatch = content.match(/^file:\s*"([^"]+)"$/);
    if (fileMatch) {
      if (!node.properties) node.properties = {};
      node.properties['data-file'] = fileMatch[1].trim();
      continue;
    }

    // {N} / {N,M-P} → 行ハイライト指定（そのまま保持）
    if (/^[\d,\s-]+$/.test(content)) {
      node._gatsbyMeta.parts.push(`{${content}}`);
      continue;
    }

    // 不明なメタデータはそのまま保持
    node._gatsbyMeta.parts.push(`{${content}}`);
  }
}

/**
 * 蓄積されたメタ情報からrehype-prism-plus互換のmetastringを構築
 */
function buildMetastring(node) {
  if (!node._gatsbyMeta?.parts?.length) return '';
  const result = node._gatsbyMeta.parts.join(' ');
  delete node._gatsbyMeta;
  return result;
}
