import { useState, useCallback } from 'react'
import { translations, type Lang } from './translations'

const STORAGE_KEY = 'halal-map-lang'

function getInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in translations) return stored as Lang
  const browser = navigator.language.slice(0, 2)
  const map: Record<string, Lang> = { ja: 'ja', en: 'en', ms: 'ms', id: 'id', bn: 'bn' }
  return map[browser] ?? 'en'
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(getInitialLang)

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLangState(l)
  }, [])

  const t = useCallback(
    (key: string) => translations[lang][key] ?? translations['en'][key] ?? key,
    [lang]
  )

  return { lang, setLang, t }
}
