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
