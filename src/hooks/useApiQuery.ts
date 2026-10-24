import { useCallback, useEffect, useState } from 'react'
import type { SetStateAction } from 'react'

export function useApiQuery<T>(load: () => Promise<T>, queryKey = '') {
  const [result, setResult] = useState<{ key: string; value: T }>()
  const [settledKey, setSettledKey] = useState<string>()
  const [failure, setFailure] = useState<{ key: string; message: string }>()
  const [generation, setGeneration] = useState(0)
  const requestKey = `${queryKey}:${generation}`
  const loading = settledKey !== requestKey
  const error = failure?.key === requestKey ? failure.message : undefined
  const data = result?.key === requestKey ? result.value : undefined

  const setData = useCallback((action: SetStateAction<T | undefined>) => {
    setResult((current) => {
      const previous = current?.key === requestKey ? current.value : undefined
      const value = typeof action === 'function'
        ? (action as (previous: T | undefined) => T | undefined)(previous)
        : action as T | undefined
      return value === undefined ? undefined : { key: requestKey, value }
    })
  }, [requestKey])

  const reload = useCallback(async () => {
    setFailure(undefined)
    setGeneration((current) => current + 1)
  }, [])

  useEffect(() => {
    let active = true
    load()
      .then((result) => {
        if (active) setResult({ key: requestKey, value: result })
      })
      .catch((cause: unknown) => {
        if (active) {
          setFailure({
            key: requestKey,
            message: cause instanceof Error ? cause.message : 'Something went wrong.',
          })
        }
      })
      .finally(() => {
        if (active) setSettledKey(requestKey)
      })
    return () => { active = false }
  }, [load, requestKey])

  return { data, loading, error, reload, setData }
}
