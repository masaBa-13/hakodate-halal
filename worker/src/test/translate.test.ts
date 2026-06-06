import { describe, it, expect, vi, afterEach } from 'vitest'
import { fillMissingComments } from '../utils/translate'

afterEach(() => vi.restoreAllMocks())

describe('fillMissingComments', () => {
  it('returns original when all comments are empty', async () => {
    const comments = { ja: '', en: '', ms: '', id: '', bn: '' }
    const result = await fillMissingComments(comments, 'key')
    expect(result).toEqual(comments)
  })

  it('returns original when all comments are already filled', async () => {
    const comments = { ja: 'ja', en: 'en', ms: 'ms', id: 'id', bn: 'bn' }
    const result = await fillMissingComments(comments, 'key')
    expect(result).toEqual(comments)
  })

  it('fills missing languages from Gemini and preserves user input', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"ja":"日本語","en":"English","ms":"Melayu","id":"Indonesia","bn":"বাংলা"}' }] } }],
      }),
    }))

    const comments = { ja: '日本語', en: 'My custom English' }
    const result = await fillMissingComments(comments, 'key')

    expect(result.ja).toBe('日本語')
    expect(result.en).toBe('My custom English') // user input preserved
    expect(result.ms).toBe('Melayu')
    expect(result.id).toBe('Indonesia')
    expect(result.bn).toBe('বাংলা')
  })

  it('returns original silently when Gemini fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const comments = { ja: 'テスト' }
    const result = await fillMissingComments(comments, 'key')
    expect(result).toEqual(comments)
  })

  it('returns original silently when Gemini returns invalid JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'not json' }] } }],
      }),
    }))

    const comments = { ja: 'テスト' }
    const result = await fillMissingComments(comments, 'key')
    expect(result).toEqual(comments)
  })
})
