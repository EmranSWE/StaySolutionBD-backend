/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUploadFile } from '../../../interface/file'

export type IAcademicDepartmentFilterRequest = {
  searchTerm?: string | undefined
  academicFacultyId?: string | undefined
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export type UserUpdateInput = {
  password: string
  passwordChangedAt: Date
}

export type IPayloadType = {
  file?: IUploadFile
  body: Record<string, any>
  params: { id: string }
}

export interface UpdateUserResponse {
  success?: boolean
  data?: any
  error?: string
}

export type IUserFilterRequest = {
  searchTerm?: string | undefined
  propertyId?: string | undefined
  id?: string | undefined
}
