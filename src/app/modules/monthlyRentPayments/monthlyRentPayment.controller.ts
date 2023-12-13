/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { MonthlyRentPaymentService } from './monthlyRentPayment.service'
import {
  MonthlyRentPaymentFilterableFields,
  MonthlyRentPaymentQueryOption,
} from './monthlyRentPayment.constant'

const addMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result =
      await MonthlyRentPaymentService.addMonthlyRentPayment(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'MonthlyRentPayment added successfully! ',
      data: result,
    })
  },
)

const addRegularMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result =
      await MonthlyRentPaymentService.addRegularMonthlyRentPayment(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'MonthlyRentPayment added successfully! ',
      data: result,
    })
  },
)

const getCurrentMonthPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params?.id
    const result =
      await MonthlyRentPaymentService.getCurrentMonthPayments(propertyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'MonthlyRentPayment added successfully! ',
      data: result,
    })
  },
)

const getMonthlyRentPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, MonthlyRentPaymentFilterableFields)
    const options = pick(req.query, MonthlyRentPaymentQueryOption)
    const result = await MonthlyRentPaymentService.getMonthlyRentPayments(
      filters,
      options,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'MonthlyRentPayments fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

const getMonthWiseMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result =
      await MonthlyRentPaymentService.getMonthWiseMonthlyRentPayment()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'MonthlyRentPayments fetched successfully',

      data: result,
    })
  },
)

const getFlatStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MonthlyRentPaymentService.getFlatStatus()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Current Flat fetched successfully',

      data: result,
    })
  },
)
const getAllFlat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MonthlyRentPaymentService.getAllFlat()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Current Flat fetched successfully',

      data: result,
    })
  },
)
// Getting a single MonthlyRentPayment
const getSingleMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const MonthlyRentPaymentId = req.params.id

    const result =
      await MonthlyRentPaymentService.getSingleMonthlyRentPayment(
        MonthlyRentPaymentId,
      )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Rent fetched successfully',
      data: result,
    })
  },
)

// Getting a single MonthlyRentPayment
const getSingleUserMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const renterId = req?.user?.id
    const result =
      await MonthlyRentPaymentService.getSingleUserMonthlyRentPayment(renterId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single USer Rent fetched successfully',
      data: result,
    })
  },
)
// Getting a total MonthlyRentPayment
const getTotalMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MonthlyRentPaymentService.getTotalMonthlyRentPayment()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent fetched successfully',
      data: result,
    })
  },
)
// Getting a This month total MonthlyRentPayment
const thisMonthTotalRents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await MonthlyRentPaymentService.thisMonthTotalRents()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent for this month successfully',
      data: result,
    })
  },
)

// Getting a This month total MonthlyRentPayment
const singleUserTotalRentAmount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const renterId = req?.params?.id
    const result =
      await MonthlyRentPaymentService.singleUserTotalRentAmount(renterId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent for this single successfully',
      data: result,
    })
  },
)

// Getting a This month total MonthlyRentPayment
const singleOwnerTotalEarn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const renterId = req?.params?.id
    const result =
      await MonthlyRentPaymentService.singleOwnerTotalEarn(renterId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent for this single successfully',
      data: result,
    })
  },
)

// Getting a This month total MonthlyRentPayment
const singleOwnerTotalProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ownerId = req?.params?.id
    const result =
      await MonthlyRentPaymentService.singleOwnerTotalProperty(ownerId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent for this single successfully',
      data: result,
    })
  },
)
// Fetch specific a total rent
const getSpecificPropertyTotalPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId
    const result =
      await MonthlyRentPaymentService.getSpecificPropertyTotalPayment(
        propertyId,
      )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent specific property fetched successfully',
      data: result,
    })
  },
)

// Fetch specific a total rent
const getSpecificPropertyPaymentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId
    const result =
      await MonthlyRentPaymentService.getSpecificPropertyPaymentDetails(
        propertyId,
      )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Total Rent specific property fetched successfully',
      data: result,
    })
  },
)

//Delete a single MonthlyRentPayment
const deleteMonthlyRentPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const MonthlyRentPaymentId = req.params.id
    const ids = req.user

    const result = await MonthlyRentPaymentService.deleteMonthlyRentPayment(
      ids,
      MonthlyRentPaymentId,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' MonthlyRentPayment deleted Successfully',
      data: result,
    })
  },
)

export const MonthlyRentPaymentController = {
  addMonthlyRentPayment,
  getMonthlyRentPayments,
  getSingleMonthlyRentPayment,
  addRegularMonthlyRentPayment,
  getTotalMonthlyRentPayment,
  getSpecificPropertyTotalPayment,
  getSingleUserMonthlyRentPayment,
  deleteMonthlyRentPayment,
  getCurrentMonthPayments,
  getMonthWiseMonthlyRentPayment,
  getFlatStatus,
  getAllFlat,
  getSpecificPropertyPaymentDetails,
  thisMonthTotalRents,
  singleUserTotalRentAmount,
  singleOwnerTotalEarn,
  singleOwnerTotalProperty,
}
