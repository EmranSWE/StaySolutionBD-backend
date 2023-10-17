/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdateSafetyResponse {
  success?: boolean
  data?: any
  error?: string
}

export type ISafetyFilterRequest = {
  searchTerm?: string
  id?: any
  propertyId?: any
  [key: string]: any
}
