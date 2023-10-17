export const wishlistFilterableFields: string[] = ['searchTerm', 'propertyId']

export const wishlistSearchableFields: string[] = ['propertyId']

export const wishlistRelationalFields: string[] = ['ownerId', 'propertyId']
export const wishlistRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'property',
}

export const IWishlistQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
