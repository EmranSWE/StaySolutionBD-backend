export const userFilterableFields: string[] = ['searchTerm', 'id', 'propertyId']

export const userSearchableFields: string[] = [
  'email',
  'phone',
  'firstName',
  'middleName',
  'lastName',
]

export const userRelationalFields: string[] = ['propertyId']
export const userRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'propertyId',
}

export const IReviewQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
