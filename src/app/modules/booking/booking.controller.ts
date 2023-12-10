/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { BookingService } from './booking.service'
import {
  BookingFilterableFields,
  IBookingQueryOption,
} from './booking.constant'

const addBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      user: req.user,
    }
    const result = await BookingService.addBooking(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking added successfully! ',
      data: result,
    })
  },
)

const getBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, BookingFilterableFields)
    const options = pick(req.query, IBookingQueryOption)
    const result = await BookingService.getBookings(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Booking
const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const BookingId = req.params.id

    const result = await BookingService.getSingleBooking(BookingId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

// Getting a single User Booking
const getSingleUserBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const result = await BookingService.getSingleUserBooking(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single User booking fetched successfully',
      data: result,
    })
  },
)

//Updating a single Booking
const updateBooking = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      params: req.params,
      user: req.user,
    }

    const result = await BookingService.updateBooking(payload)
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: result,
    })
  },
)

//Delete a single Booking
const deleteBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const BookingId = req.params.id
    const ids = req.user

    const result = await BookingService.deleteBooking(ids, BookingId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Booking deleted Successfully',
      data: result,
    })
  },
)

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
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getSingleUserBooking,
  // singleUserBooking,
  // singlePropertiesRating,
}
