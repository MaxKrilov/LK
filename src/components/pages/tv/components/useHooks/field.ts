import { ITVCharsFields } from '@/components/pages/tv/tv.d.ts'
import { definitionRequire } from '@/components/pages/tv/components/useHooks/reassignment/reassignmentField'
export const useField = (field:any): ITVCharsFields => {
  const definitionRequireField = definitionRequire(field, { isValid: false })
  return definitionRequireField
}
