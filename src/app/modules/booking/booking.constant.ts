export const BookingFilterableFields: string[] = [
  'searchTerm',
  'bookingStatus',
  'propertyId',
  'bookingStartDate',
  'id',
]

export const BookingSearchableFields: string[] = ['specialRequest']

export const BookingRelationalFields: string[] = ['propertyId']
export const BookingRelationalFieldsMapper: { [key: string]: string } = {
  propertyId: 'property',
}

export const IBookingQueryOption = ['limit', 'page', 'sortBy', 'sortOrder']
