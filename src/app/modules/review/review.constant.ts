export const reviewFilterableFields: string[] = ['searchTerm', 'id']

export const reviewSearchableFields: string[] = ['reviewTest']

export const reviewRelationalFields: string[] = ['rating', 'propertyId']
export const reviewRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'propertyId',
}
