import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n'

const STORAGE_KEY = 'vs-portfolio-lang'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === 'km' ? 'km' : 'en'
    } catch {
      return 'en'
    }
  })

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'km' : 'en'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* private mode — ignore */
    }
  }, [lang])

  const value = useMemo(
    () => ({ lang, toggle, isKm: lang === 'km', t: translations[lang] }),
    [lang, toggle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
