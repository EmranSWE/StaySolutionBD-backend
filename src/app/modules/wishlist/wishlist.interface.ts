/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdateWishlistResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IWishlistFilterRequest = {
  searchTerm?: string

  [key: string]: any
}
