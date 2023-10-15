// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-unused-vars */
// import { NextFunction, Request, Response } from 'express'
// import catchAsync from '../../../shared/catchAsync'
// import sendResponse from '../../../shared/sendResponse'
// import httpStatus from 'http-status'
// import { BookingService } from './Booking.service'

// const createProperties = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingData = req.body
//     const result = await BookingService.createProperties(BookingData)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Properties created successfully !',
//       data: result,
//     })
//   },
// )

// export const BookingController = {
//   createProperties,
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { BookingService } from './booking.service'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
// import config from '../../../config'

// import {
//   IBookingQueryOption,
//   BookingFilterableFields,
// } from './Booking.constant'

const addBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const BookingData = req.body
    // const result = await BookingService.addBooking(BookingData)

    // FileUploadHelper.uploadToCloudinary()
    const result = await BookingService.addBooking(req)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking added successfully! ',
      data: result,
    })
  },
)

// const getAllProperties = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const filters = pick(req.query, BookingFilterableFields)
//     const options = pick(req.query, IBookingQueryOption)

//     const result = await BookingService.getAllProperties(filters, options)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Bookings fetched successfully',
//       meta: result.meta,
//       data: result.data,
//     })
//   },
// )

// //Getting a single Booking
// const getSingleBooking = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingId = req.params.id

//     const result = await BookingService.getSingleBooking(BookingId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Bookings fetched successfully',
//       data: result,
//     })
//   },
// )

// //Updating a single Booking
// const updateBooking = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingId = req.params.id
//     const updatedData = req.body
//     const ids = req.user?.id
//     const result = await BookingService.updateBooking(
//       ids,
//       BookingId,
//       updatedData,
//     )
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Bookings fetched successfully',
//       data: result,
//     })
//   },
// )

// //Delete a single Booking
// const deleteBooking = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingId = req.params.id
//     const ids = req.user?.id

//     const result = await BookingService.deleteBooking(ids, BookingId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Booking deleted Successfully',
//       data: result,
//     })
//   },
// )

// //Get a single Booking
// const singleUserBooking = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await BookingService.singleUserBooking(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Booking',
//       data: result,
//     })
//   },
// )
// //Get a single Booking
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const BookingId = req.params.id
//     const result = await BookingService.singlePropertiesRating(BookingId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Booking average rating',
//       data: result,
//     })
//   },
// )
export const BookingController = {
  addBooking,
  //   getAllProperties,
  // getAllBookings,
  // getSingleBooking,
  // updateBooking,
  // deleteBooking,
  // singleUserBooking,
  // singlePropertiesRating,
}
