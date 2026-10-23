"# GA4 Demo Site for Beginners

GitHub Pagesで動作する、GA4（Google Analytics 4）のイベントトラッキング学習用デモサイトです。

## 🌐 公開URL

https://[your-username].github.io/[repository-name]/

## 📁 ファイル構成

```
.
├── index.html          # メインページ（イベントテスト用）
├── article.html        # AI引用検知テスト記事
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── ga4-config.js   # GA4設定とカスタムイベント
└── README.md           # このファイル
```

## 🎯 実装されているイベント

### 標準イベント
| イベント名 | 説明 | 実装場所 |
|-----------|------|---------|
| `page_view` | ページ閲覧 | 全ページ（自動） |
| `scroll` | スクロール深度 | 全ページ（25%, 50%, 75%, 90%） |
| `click` | リンククリック | ナビゲーション等 |
| `file_download` | ファイルダウンロード | ダウンロードボタン |
| `generate_lead` | リード生成 | お問い合わせフォーム |
| `purchase` | 購入 | 商品購入ボタン（デモ） |
| `share` | シェア | SNSシェアボタン |
| `select_content` | コンテンツ選択 | 各種セレクトボタン |

### カスタムイベント（本デモの核心）
| イベント名 | 説明 | 用途 |
|-----------|------|------|
| `text_copied` | テキストコピー検知 | **AI引用把握の核心機能** |
| `section_engagement` | セクション閲覧時間 | コンテンツエンゲージメント |
| `cta_click` | CTAボタンクリック | コンバージョン測定 |
| `outbound_click` | 外部リンククリック | 離脱分析 |
| `scroll_depth` | スクロール深度 | 読了率測定 |

## 🚀 セットアップ手順

### 1. GitHub Pagesの有効化

1. リポジトリの **Settings** → **Pages** を開く
2. **Branch** で `main` を選択
3. **Folder** で `/(root)` を選択
4. **Save** をクリック
5. 数分後に公開URLが発行される

### 2. GA4の設定

1. [Google Analytics](https://analytics.google.com/)で新規プロパティを作成
2. データストリーム（Web）を追加
3. 測定ID（`G-XXXXXXXXXX`形式）を取得
4. `js/ga4-config.js`の以下の部分を書き換え：

```javascript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';  // ← あなたのIDに変更
```

5. 変更をコミット＆プッシュ

### 3. 動作確認

1. 公開URLにアクセス
2. ブラウザの開発者ツール（F12）→ Consoleを開く
3. 各種ボタンをクリックまたはテキストをコピー
4. `[GA4]`で始まるログが表示されることを確認
5. GA4の**リアルタイム**レポートでイベントが記録されることを確認

## 🤖 AI引用検知について

### 機能概要

テキストを選択してコピー（Ctrl+C / Cmd+C）すると、以下の情報がGA4に自動送信されます：

```javascript
{
  event: 'text_copied',
  content_type: 'article',
  content_id: 'ページタイトル',
  copy_length: 150,           // コピー文字数
  content_section: 'introduction', // どのセクションからコピーされたか
  page_path: '/article.html',
  copy_timestamp: '2024-01-15T10:30:00.000Z'
}
```

### 活用シーン

- **人気コンテンツの特定**: どの記事・段落が最も引用されるか
- **引用可能性の高いコンテンツ作成**: データに基づくコンテンツ戦略
- **ユーザー意図の推測**: 長文コピー=引用、短文コピー=確認など

## 📊 GA4でのデータ確認方法

### リアルタイムレポート
- 即座にイベントが反映される（数秒〜数分の遅延）

### Exploreレポート
- **自由形式**: イベント名、パラメータで分析
- **パス探索**: ユーザーの行動パスを可視化
- **ファネル**: コンバージョンまでの流れを分析

### 推奨カスタム定義

以下のカスタムディメンションを作成することを推奨：

| ディメンション名 | スコープ | イベントパラメータ |
|----------------|---------|------------------|
| コンテンツタイプ | イベント | content_type |
| コピーセクション | イベント | content_section |
| スクロール深度 | イベント | scroll_depth |

## 🔧 カスタマイズ例

### 追加のイベント追加

新しいボタンにトラッキングを追加：

```javascript
// HTML
<button onclick="trackMyCustomEvent('button_name')">クリック</button>

// ga4-config.jsに追加
function trackMyCustomEvent(buttonName) {
  gtag('event', 'custom_event_name', {
    'button_name': buttonName,
    'page_path': window.location.pathname
  });
}
```

### 特定要素のコピーのみ追跡

```javascript
// 特定のクラスを持つ要素のみ追跡
const isTrackedElement = container.closest('.trackable-content');
if (!isTrackedElement) return; // 追跡対象外なら終了
```

## 📚 学習リソース

- [GA4 公式ドキュメント](https://developers.google.com/analytics/devguides/collection/ga4)
- [gtag.js リファレンス](https://developers.google.com/tag-platform/gtagjs/reference)
- [GA4 イベントリファレンス](https://developers.google.com/tag-platform/gtagjs/reference/events)

## 📝 License

MIT License - 自由に学習・改変・配布してください。

---

**Happy Tracking! 🎉**"