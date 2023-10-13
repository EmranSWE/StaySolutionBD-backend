export type IAcademicDepartmentFilterRequest = {
  searchTerm?: string | undefined
  academicFacultyId?: string | undefined
}

export type IChangedPassword = {
  oldPassword: string
  newPassword: string
}
