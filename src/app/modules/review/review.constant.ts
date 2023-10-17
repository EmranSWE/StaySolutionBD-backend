export const reviewFilterableFields: string[] = ['searchTerm', 'id']

export const reviewSearchableFields: string[] = ['comments']

export const reviewRelationalFields: string[] = ['renterId', 'propertyId']
export const reviewRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'propertyId',
}
