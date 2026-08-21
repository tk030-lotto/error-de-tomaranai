# エラーで止まらない。ツール 開発記録 (RECORD)

## 2026-08-21: 初期リポジトリ作成・ルール同期 & Webアプリ本体開発完了
- GitHubプライベートリポジトリ `tk030-lotto/error-de-tomaranai` を作成・連携。
- 各種情報フォルダから開発ルール一括同期を実施（.cursorrules, .clauderules, .clinerules, SKILLS.md, copilot-instructions.md, AGENTS.md, mcp_config.json, .gitignore）。
- Webアプリケーション本体（Zero-Dependency Vanilla HTML/CSS/JS）を開発完了。
  - プロトコル第18条準拠のミニマル・ダークUI（`#09090b` 基調、`#121215` カード、`#27272a` ボーダー、Inter/JetBrains Mono、スマートフォン・PC両対応レスポンシブ）
  - エラー自由入力 ＆ よくあるエラー例クイックチップ（文字数カウント付き）
  - 発生状況入力 ＆ 状況クイックチップ（アクティブハイライト連動）
  - 補足情報アコーディオン（直前の変更、使用環境、期待動作）
  - AI質問文自動生成エンジン（標準 / 超初心者向け / 原因特定特化 / 修正コード重視 の4スタイル）
  - 質問文のワンクリックコピー（トースト通知）＆ クリップボードAPI
  - 質問文の自由入力修正・クイック修正要望チップ連動（スタイル切り替え時も要望保持）
  - AI直通リンク（ChatGPT / Claude / Gemini）
  - 再エラー時のスムーズなリトライ機能 ＆ シリーズ第6弾『これでいいの？』次回予告
  - MIT License（LICENSE, README.md）および GitHub Pages対応（.nojekyll）
- 4段階品質監査（コード構文・プロトコルアライメント・機能UI/UX・セキュリティ公開適合性）を実施し、Grade A+（即時公開可能）を確認。
- GitマイクロコミットおよびGitHubプライベートリポジトリへのPushを完了。
