/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdatePropertyResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IPropertyFilterRequest = {
  searchTerm?: string
  numberOfRooms?: number
  monthlyRent?: number
  availableAfter?: Date
  [key: string]: any
}
