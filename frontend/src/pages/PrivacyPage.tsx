export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>プライバシーポリシー</h1>
        <p style={styles.lead}>
          株式会社TackMore（以下「当社」）は、函館ハラルマップ（以下「本サービス」）における個人情報の取扱いについて、以下のとおり定めます。
        </p>

        <Section title="1. 収集する情報">
          <p>本サービスでは、店舗登録時に以下の情報を収集することがあります。</p>
          <ul>
            <li>メールアドレス</li>
            <li>電話番号（店舗オーナーとして登録する場合）</li>
            <li>氏名またはニックネーム</li>
            <li>投稿した店舗情報・コメント</li>
          </ul>
          <p>また、アクセス解析のためにIPアドレス・ブラウザ情報等を自動的に取得する場合があります。</p>
        </Section>

        <Section title="2. 利用目的">
          <ul>
            <li>本サービスの提供・運営</li>
            <li>登録情報の確認・問い合わせ対応</li>
            <li>不正利用の防止</li>
            <li>サービスの改善・新機能の開発</li>
          </ul>
        </Section>

        <Section title="3. 第三者への提供">
          <p>当社は、以下の場合を除き、個人情報を第三者に提供しません。</p>
          <ul>
            <li>ご本人の同意がある場合</li>
            <li>法令に基づく場合</li>
          </ul>
          <p>なお、本サービスでは以下の外部サービスを利用しており、投稿されたコメントデータが処理されることがあります。</p>
          <ul>
            <li><strong>Google Gemini AI</strong> — 投稿コメントの多言語翻訳処理に使用（Googleプライバシーポリシーに準拠）</li>
            <li><strong>Google Maps API</strong> — 地図表示・店舗検索に使用（Googleプライバシーポリシーに準拠）</li>
          </ul>
        </Section>

        <Section title="4. 情報の保管・管理">
          <p>収集した個人情報はCloudflare社のインフラ上で管理し、不正アクセス・紛失・改ざんを防ぐための適切な安全措置を講じます。</p>
        </Section>

        <Section title="5. Cookie・アクセス解析">
          <p>本サービスでは、サービス改善のためにアクセス解析ツールを使用することがあります。これにはCookieが使用される場合があります。ブラウザの設定によりCookieを無効にすることができます。</p>
        </Section>

        <Section title="6. 開示・訂正・削除の請求">
          <p>ご自身の個人情報の開示・訂正・削除を希望される場合は、下記の連絡先までお問い合わせください。本人確認の上、速やかに対応いたします。</p>
        </Section>

        <Section title="7. お問い合わせ">
          <p>
            個人情報の取扱いに関するお問い合わせ:<br />
            株式会社TackMore<br />
            メール: info@tackmore.jp
          </p>
        </Section>

        <p style={styles.updated}>最終更新日: 2025年6月</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '32px' }}>
      <h2 style={sectionTitle}>{title}</h2>
      <div style={body}>{children}</div>
    </section>
  )
}

const sectionTitle: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif", fontSize: '18px',
  marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--border)',
}
const body: React.CSSProperties = { fontSize: '14px', lineHeight: 1.8, color: 'var(--text-primary)' }

const styles: Record<string, React.CSSProperties> = {
  page: { overflowY: 'auto', flex: 1 },
  container: { maxWidth: '720px', margin: '0 auto', padding: '40px 16px 64px' },
  h1: { fontFamily: "'DM Serif Display', serif", fontSize: '24px', marginBottom: '16px' },
  lead: { fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '40px' },
  updated: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '40px', textAlign: 'right' },
}
