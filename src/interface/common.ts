import { IGenericErrorMessage } from './error'

export type IGenericResponse<T> = {
  meta: {
    page: number
    limit: number
    total: number
  }
  data: T
}

export type IGenericErrorResponse = {
  statusCode: number
  message: string
  errorMessages: IGenericErrorMessage[]
}

export type IQueryOptions = {
  limit?: number
  page?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
