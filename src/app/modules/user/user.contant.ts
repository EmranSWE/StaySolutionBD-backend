export const userFilterableFields: string[] = [
  'searchTerm',
  'id',
  'academicFacultyId',
]

export const userSearchableFields: string[] = ['title']

export const userRelationalFields: string[] = ['academicFacultyId']
export const userRelationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
}
