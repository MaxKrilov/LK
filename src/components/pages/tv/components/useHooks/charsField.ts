
import { useField } from '@/components/pages/tv/components/useHooks/field'
import { ITVDataActivation } from '@/components/pages/tv/tv.d.ts'

export const useChars = (init = {}) => {
  const chars = {} as ITVDataActivation
  for (const [key, value] of Object.entries(init)) {
    // @ts-ignore
    chars[key] = useField(value)
  }
  return chars
}
