import { useEffect, useState } from 'react'

export default function Typewriter({ words, className = '' }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIndex % words.length]
    let timeout

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), 1900)
    } else if (deleting && text === '') {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    } else {
      timeout = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 38 : 95,
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words])

  return (
    <span className={className} aria-label={words.join(', ')}>
      {text}
      <span className="animate-blink text-indigo-400" aria-hidden="true">
        |
      </span>
    </span>
  )
}
