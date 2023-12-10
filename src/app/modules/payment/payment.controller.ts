/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'

import { PaymentService } from './payment.service'
import {
  IPaymentQueryOption,
  paymentFilterableFields,
} from './payment.constant'

const addPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result = await PaymentService.addPayment(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment added successfully! ',
      data: result,
    })
  },
)

const addPaymentStripe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }
    const result = await PaymentService.addPaymentStripe(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payment added successfully! ',
      data: result,
    })
  },
)
const getPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, paymentFilterableFields)
    const options = pick(req.query, IPaymentQueryOption)
    const result = await PaymentService.getPayments(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
const getAllRent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, paymentFilterableFields)
    const options = pick(req.query, IPaymentQueryOption)
    const result = await PaymentService.getAllRent(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Payments fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Payment
const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const PaymentId = req.params.id

    const result = await PaymentService.getSinglePayment(PaymentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Payment
const updatePayment = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      file: req.file,
      params: req.params,
      user: req.user,
    }

    const result = await PaymentService.updatePayment(payload)
    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: result,
    })
  },
)

//Delete a single Payment
const deletePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const PaymentId = req.params.id
    const ids = req.user

    const result = await PaymentService.deletePayment(ids, PaymentId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Payment deleted Successfully',
      data: result,
    })
  },
)

export const PaymentController = {
  addPayment,
  addPaymentStripe,
  getPayments,
  getAllRent,
  getSinglePayment,
  updatePayment,
  deletePayment,
}
