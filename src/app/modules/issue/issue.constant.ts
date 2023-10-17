export const IIssueFilterableFields: string[] = [
  'searchTerm',
  'issueStatus',
  'priorityLevel',
  'id',
  'propertyId',
]

export const IIssueSearchableFields: string[] = ['issueDescription']

export const IIssueRelationalFields: string[] = ['propertyId']
export const IIssueRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'property',
}

export const IIIssueQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
