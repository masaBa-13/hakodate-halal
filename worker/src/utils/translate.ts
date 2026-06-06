type LangMap = { ja: string; en: string; ms: string; id: string; bn: string }

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function translateToAllLangs(
  sourceText: string,
  apiKey: string
): Promise<LangMap | null> {
  const prompt = `Translate the following text into these 5 languages and return ONLY a JSON object (no markdown, no code block):
- ja: Japanese
- en: English
- ms: Malay
- id: Indonesian
- bn: Bengali

If the text is already in one of these languages, copy it as-is for that key.

Text:
${sourceText}

Required JSON format:
{"ja":"...","en":"...","ms":"...","id":"...","bn":"..."}`

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 },
      }),
    })

    if (!res.ok) return null

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Strip markdown code fences if Gemini wraps with ```json
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(cleaned) as LangMap
  } catch {
    return null
  }
}

/**
 * コメントフィールドを補完する。
 * ユーザーが入力済みの言語は上書きしない。
 * 最初に見つかった非空のコメントを翻訳ソースにする。
 */
export async function fillMissingComments(
  comments: Partial<LangMap>,
  apiKey: string
): Promise<Partial<LangMap>> {
  const langs: (keyof LangMap)[] = ['ja', 'en', 'ms', 'id', 'bn']

  // 翻訳ソースを探す（ユーザー入力があるもの優先）
  const sourceText = langs.map((l) => comments[l]).find((v) => v && v.trim())
  if (!sourceText) return comments

  // すべての言語が埋まっている場合は翻訳不要
  if (langs.every((l) => comments[l]?.trim())) return comments

  const translated = await translateToAllLangs(sourceText, apiKey)
  if (!translated) return comments

  const result: Partial<LangMap> = {}
  for (const lang of langs) {
    // ユーザー入力があれば優先、なければ翻訳結果を使用
    result[lang] = comments[lang]?.trim() ? comments[lang] : translated[lang]
  }
  return result
}
