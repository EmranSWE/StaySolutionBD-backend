export const MonthlyRentPaymentFilterableFields: string[] = [
  'searchTerm',
  'year',
  'amount',
  'status',
]

export const MonthlyRentPaymentSearchableFields: string[] = [
  'status',
  'year',
  'month',
  'amount',
]

export const MonthlyRentPaymentRelationalFields: string[] = [
  'renterId',
  'propertyId',
]
export const MonthlyRentPaymentRelationalFieldsMapper: {
  [key: string]: string
} = {
  renterId: 'renter',
  propertyId: 'property',
}

export const MonthlyRentPaymentQueryOption = [
  'limit',
  'page',
  'sortBy',
  'sortOrder',
]
