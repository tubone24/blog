# 開発コマンド一覧

## 基本コマンド

- `yarn start` / `yarn develop` - 開発サーバー起動 (<http://localhost:8000>)
- `yarn build` - ビルド実行
- `yarn serve` - ビルド済みサイトのサーブ
- `yarn clean` - キャッシュクリア

## リント・フォーマット

- `yarn typecheck` - TypeScript 型チェック
- `yarn format:fix` - ESLint 実行（自動修正）
- `yarn format-style:fix` - Stylelint 実行（自動修正）
- `yarn textlint:fix` - 記事の日本語校正（自動修正）
- `yarn format-md:fix` - Markdown フォーマット（自動修正）

## テスト

- `yarn test` - Jest ユニットテスト実行
- `yarn test:cov` - カバレッジ付きテスト実行
- `yarn test:e2e` - Cypress E2Eテスト実行
- `yarn test:storybook` - Storybook スナップショットテスト

## その他

- `yarn storybook` - Storybook 起動 (<http://localhost:6006>)
- `yarn benchmark` - Lighthouse ベンチマーク実行
- `yarn memlab` - メモリリーク検出
