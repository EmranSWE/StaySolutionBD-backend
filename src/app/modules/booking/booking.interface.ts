/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdateBookingResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IBookingFilterRequest = {
  searchTerm?: string
  bookingStatus?: string
  bookingStartDate?: Date
  [key: string]: any
}
