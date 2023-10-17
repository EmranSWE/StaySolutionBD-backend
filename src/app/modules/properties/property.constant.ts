export const propertyFilterableFields: string[] = [
  'searchTerm',
  'numberOfRooms',
  'monthlyRent',
  'availableAfter',
  'id',
  'ownerId',
  'insuranceId',
]

export const propertySearchableFields: string[] = ['city', 'description']

export const propertyRelationalFields: string[] = ['ownerId', 'insuranceId']
export const propertyRelationalFieldsMapper: { [key: string]: string } = {
  ownerId: 'owner',
  insuranceId: 'insurance',
}

export const IPropertyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
