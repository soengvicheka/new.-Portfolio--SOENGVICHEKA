import { useState } from 'react'

export default function Avatar({ src, alt, initials, className = '' }) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return (
      <div
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-400 font-display font-bold text-white ${className}`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  )
}
