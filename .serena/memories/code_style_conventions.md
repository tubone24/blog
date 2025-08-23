# コードスタイルと規約

## ディレクトリ構造

- `/src/content/*.md` - ブログ記事（Markdown）
- `/src/components/` - React コンポーネント（TypeScript）
- `/src/pages/` - ページコンポーネント
- `/src/templates/` - テンプレートコンポーネント
- `/src/styles/` - グローバルスタイル
- `/static/` - 静的ファイル

## コーディング規約

- **言語**: TypeScript を使用
- **コンポーネント**: 関数コンポーネント + Hooks を推奨
- **スタイル**: CSS Modules でスコープ化、Sass(Scss) 使用
- **命名規則**:
  - コンポーネント: PascalCase
  - ファイル名: index.tsx, index.spec.tsx, index.stories.tsx
  - CSS クラス: camelCase（CSS Modules）
- **エクスポート**: default export を使用

## 品質管理

- ESLint (Airbnb config ベース)
- Stylelint
- EditorConfig
- Husky による pre-commit フック
- textlint による日本語校正
