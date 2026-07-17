import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '../../lib/api/client'

export function applyApiFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof ApiError)) return false

  const fieldErrors = error.details.fieldErrors
  if (fieldErrors && !Array.isArray(fieldErrors)) {
    for (const [field, message] of Object.entries(fieldErrors)) {
      setError(field as Path<T>, { message, type: 'server' })
    }
  }

  setError('root' as Path<T>, { message: error.message, type: 'server' })
  return true
}
