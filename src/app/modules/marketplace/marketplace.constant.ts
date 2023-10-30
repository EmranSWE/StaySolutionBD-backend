export const marketplaceFilterableFields: string[] = [
  'searchTerm',
  'price',
  'category',
  'id',
  'ownerId',
]

export const marketplaceSearchableFields: string[] = [
  'title',
  'itemDescription',
]

export const marketplaceRelationalFields: string[] = ['ownerId']
export const marketplaceRelationalFieldsMapper: { [key: string]: string } = {
  ownerId: 'owner',
}

export const IMarketplaceQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
