export const SafetyFilterableFields: string[] = [
  'searchTerm',
  'id',
  'propertyId',
  'safetyScore',
]

export const SafetySearchableFields: string[] = ['safetyAmenities']

export const SafetyRelationalFields: string[] = ['propertyId']
export const SafetyRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'property',
}

export const ISafetyQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
