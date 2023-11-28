export const propertyFilterableFields: string[] = [
  'searchTerm',
  'numberOfRooms',
  'monthlyRent',
  'availableAfter',
  'location',
  'size',
  'maxOccupancy',
  'propertyStatus',
  'id',
]

export const propertySearchableFields: string[] = [
  'title',
  'description',
  'flatNo',
]

export const propertyRelationalFields: string[] = ['ownerId', 'insuranceId']
export const propertyRelationalFieldsMapper: { [key: string]: string } = {
  ownerId: 'owner',
  insuranceId: 'insurance',
}

export const IPropertyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
