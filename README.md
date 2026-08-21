# エラーで止まらない。

> **躊躇してないで、とにかく作ってみよう。シリーズ 第5弾**  
> **AIエラートラブルシューティング Webアシスタント**

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Zero-Dependency](https://img.shields.io/badge/Dependencies-Zero-success.svg)
![Platform: Web / Mobile](https://img.shields.io/badge/Platform-Web%20%2F%20Mobile-orange.svg)

---

## 🌟 コンセプト

> エラーが出た？  
> そこで止まらない。  
> **AIに聞いてみよう。**

AIを使ってソフトウェアを作っていると、必ずエラーが出ることがあります。  
プログラミング経験が少ないと、

- 「何が悪いのか分からない」
- 「英語の赤い文字が怖い」
- 「どう直せばいいのか分からない」

となってしまい、そこで開発を止めてしまいがちです。

本ツールは、**表示されたエラーと発生時の状況をそのまま入力するだけで、AI（ChatGPT / Claude / Gemini 等）へ投げる最適な質問文を瞬時に作成する**無料Webツールです。

---

## ✨ 主な特徴

1. **Zero-Dependency / ブラウザ完結**  
   外部サーバーやライブラリに一切依存せず、PC・スマートフォンのブラウザ上で瞬時に動作します。
2. **ワンクリックで質問文を即時生成**  
   エラーメッセージと状況を選ぶだけで、AIに「意味・原因・確認方法・修正手順・修正後確認」を分かりやすく解説させる質問文を作成。
3. **選べる4つの質問スタイル**  
   - **標準（おすすめ）**: 原因から修正コードまで網羅的に質問
   - **超初心者向け**: 専門用語を噛み砕いた解説を要求
   - **原因特定特化**: まず根本原因の絞り込みを優先
   - **急ぎ・修正コード重視**: コピペできる修正コードを最優先
4. **ワンクリックコピー & AI直通リンク**  
   質問文を1秒でクリップボードにコピーし、ChatGPT/Claude/GeminiなどのAIへすぐに送信可能。
5. **洗練されたミニマル・ダークUI**  
   開発への集中を妨げない、目に優しいシックなダークテーマデザイン。

---

## 🚀 使い方

1. **エラーを入力する**  
   画面やターミナルに出たエラーメッセージを貼り付けるか、プリセットチップ（Module not found、SyntaxError、画面真っ白 等）を選択します。
2. **状況を入力する**  
   「起動したとき」「ボタンを押したとき」などの発生タイミングを選択・入力します。
3. **質問文を生成・コピーする**  
   ［AIへの質問文を作成する］を押し、生成された文章を［質問文をコピー］します。
4. **普段お使いのAIに送信する**  
   AIから届いたアドバイスに従ってコードを修正し、もう一度動かしてみましょう！
5. **またエラーが出たら**  
   大丈夫です。新しいエラーを再度本ツールに入力して、解決するまでAIに聞けば問題ありません。

---

## 🛠️ 技術仕様

- **フロントエンド**: Vanilla HTML5, Vanilla CSS3 (CSS Variables), Vanilla JavaScript (ES6+)
- **デザインシステム**: 機能的ミニマル・ダークUI（`#09090b` / `#121215` / `#27272a`）
- **公開環境**: GitHub Pages 対応（`.nojekyll` 配置済み）

---

## 🗺️ 「躊躇してないで、とにかく作ってみよう。」シリーズ

1. **① 何を作るか決めよう。** ➔ 「作りたいものがない」を解決
2. **② AIに聞いてみよう。** ➔ 「どう始めればいいか分からない」を解決
3. **③ まず動かしてみよう。** ➔ 「AIが作ったコードの動かし方が分からない」を解決
4. **④ エラーで止まらない。** ➔ 「動かしたらエラーが出た」を解決（本作）
5. **⑤ これでいいの？** ➔ 「AIが作ったものを人間が検証する」へ（次回作）

---

## 📄 ライセンス

MIT License

Copyright (c) 2026 tk030

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.