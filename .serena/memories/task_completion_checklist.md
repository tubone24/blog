# タスク完了時のチェックリスト

## コード変更時の必須確認事項

1. **型チェック**

   ```sh
   yarn typecheck
   ```

2. **リント実行**

   ```sh
   yarn format:fix
   yarn format-style:fix
   ```

3. **Markdown記事を追加・編集した場合**

   ```sh
   yarn textlint:fix
   yarn format-md:fix
   ```

4. **テスト実行**

   ```sh
   yarn test
   ```

5. **ビルド確認**

   ```sh
   yarn build
   ```

## 注意事項

- Git コミット前に Husky が自動でリントを実行
- PR 作成時に Preview 環境が自動デプロイされる
- master ブランチへのマージで本番環境にデプロイ
