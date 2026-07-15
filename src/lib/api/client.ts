const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export type FieldError = {
  field: string
  message: string
}

export type ErrorResponse = {
  timestamp?: string
  status: number
  error?: string
  message: string
  path?: string
  fieldErrors?: FieldError[] | Record<string, string>
}

export class ApiError extends Error {
  readonly status: number
  readonly details: ErrorResponse

  constructor(details: ErrorResponse) {
    super(details.message)
    this.name = 'ApiError'
    this.status = details.status
    this.details = details
  }
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const hasBody = options.body !== undefined

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body: hasBody ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    throw new ApiError(await toErrorResponse(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

async function toErrorResponse(response: Response): Promise<ErrorResponse> {
  try {
    const body: unknown = await response.json()
    if (isErrorResponse(body)) return body
  } catch {
    // The fallback below also covers empty and non-JSON error responses.
  }

  return {
    status: response.status,
    message: 'İstek tamamlanamadı. Lütfen tekrar deneyin.',
  }
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  return typeof value === 'object' && value !== null && 'message' in value && typeof value.message === 'string'
}
