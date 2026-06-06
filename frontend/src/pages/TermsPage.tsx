export default function TermsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>利用規約</h1>
        <p style={styles.lead}>
          本規約は、株式会社TackMore（以下「当社」）が提供する函館ハラルマップ（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただくことで、本規約に同意したものとみなします。
        </p>

        <Section title="第1条（サービス内容）">
          <p>本サービスは、函館・道南エリアのムスリムフレンドリーな店舗情報を提供するマップサービスです。掲載情報はユーザーまたは店舗オーナーによる投稿に基づくものであり、当社が内容を保証するものではありません。</p>
        </Section>

        <Section title="第2条（ハラル情報の免責）">
          <p>本サービスに掲載されるハラル認証・対応レベルに関する情報は、登録者からの申告に基づく参考情報です。当社は以下の事項について一切の責任を負いません。</p>
          <ul>
            <li>掲載情報の正確性・最新性</li>
            <li>ハラル認証の有効性・継続性</li>
            <li>店舗の実際の提供内容と掲載情報の相違</li>
            <li>本サービスの情報を参考にしたことによって生じた損害</li>
          </ul>
          <p>ハラルに関する最終的な判断はご利用者ご自身でご確認ください。</p>
        </Section>

        <Section title="第3条（禁止事項）">
          <p>ユーザーは以下の行為を行ってはなりません。</p>
          <ul>
            <li>虚偽の店舗情報・ハラル認証情報の登録</li>
            <li>他者を誹謗中傷する内容の投稿</li>
            <li>スパム・連続投稿・自動送信ツールの使用</li>
            <li>サービスへの不正アクセス・サーバーへの過度な負荷</li>
            <li>第三者の個人情報・著作権を侵害する行為</li>
            <li>法令または公序良俗に反する行為</li>
          </ul>
        </Section>

        <Section title="第4条（投稿コンテンツ）">
          <p>ユーザーが投稿した店舗情報・コメント等のコンテンツについて、当社はサービス運営・改善の目的で無償で利用できるものとします。当社は不適切と判断したコンテンツを予告なく削除できます。</p>
        </Section>

        <Section title="第5条（広告）">
          <p>本サービスは広告収入により運営されています。表示される広告は第三者の広告配信システムによるものです。</p>
        </Section>

        <Section title="第6条（サービスの変更・停止）">
          <p>当社は事前の通知なく、本サービスの内容変更・一時停止・終了を行う場合があります。これによって生じた損害について、当社は責任を負いません。</p>
        </Section>

        <Section title="第7条（準拠法・管轄）">
          <p>本規約は日本法に準拠し、本サービスに関する紛争は函館地方裁判所を第一審の専属的合意管轄とします。</p>
        </Section>

        <Section title="第8条（お問い合わせ）">
          <p>
            株式会社TackMore<br />
            〒040-0004 北海道函館市杉並町6-2-103<br />
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
