/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdateMarketplaceResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IMarketplaceFilterRequest = {
  searchTerm?: string
  price?: number
  category?: number
  [key: string]: any
}
