import { useCallback, useRef } from 'react'

export default function useDebounce(callback, delay = 500) {
  const timeoutRef = useRef(null)

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  return debouncedCallback
}
