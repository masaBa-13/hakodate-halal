import { describe, it, expect } from 'vitest'
import { translations } from '../i18n/translations'
import type { Lang } from '../i18n/translations'

const LANGS: Lang[] = ['ja', 'en', 'ms', 'id', 'bn']
const jaKeys = Object.keys(translations.ja)

describe('translations', () => {
  it('all languages have the same keys as ja', () => {
    for (const lang of LANGS) {
      const missing = jaKeys.filter((k) => !(k in translations[lang]))
      expect(missing, `${lang} is missing keys`).toHaveLength(0)
    }
  })

  it('no key has an empty string value', () => {
    for (const lang of LANGS) {
      for (const key of jaKeys) {
        expect(translations[lang][key], `${lang}.${key} is empty`).not.toBe('')
      }
    }
  })
})
