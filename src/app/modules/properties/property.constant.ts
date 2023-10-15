export const propertyFilterableFields: string[] = ['searchTerm', 'id']

export const propertySearchableFields: string[] = [
  'address',
  'numberOfRooms',
  'monthlyRent',
]

export const propertyRelationalFields: string[] = [
  'rating',
  'propertyId',
  'monthlyRent',
]
export const propertyRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'propertyId',
}

export const IPropertyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
