export const paymentFilterableFields: string[] = [
  'searchTerm',
  'paymentStatus',
  'paymentAmount',
  'bookingId',
  'id',
  'renterId',
]

export const paymentSearchableFields: string[] = ['paymentMethod']

export const paymentRelationalFields: string[] = ['renterId', 'bookingId']
export const paymentRelationalFieldsMapper: { [key: string]: string } = {
  renterId: 'renter',
  bookingId: 'booking',
}

export const IPaymentQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
