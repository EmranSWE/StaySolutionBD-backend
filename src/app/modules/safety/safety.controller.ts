/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { SafetyService } from './safety.service'
import { ISafetyQueryOption, SafetyFilterableFields } from './safety.constant'

const addSafety = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result = await SafetyService.addSafety(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Safety added successfully! ',
      data: result,
    })
  },
)

const getSafeties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, SafetyFilterableFields)
    const options = pick(req.query, ISafetyQueryOption)
    const result = await SafetyService.getProperties(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Safety
const getSingleSafety = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const SafetyId = req.params.id

    const result = await SafetyService.getSingleSafety(SafetyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Safety
const updateSafety = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      params: req.params,
      user: req.user,
    }

    const result = await SafetyService.updateSafety(payload)
    res.status(200).json({
      success: true,
      message: 'Safety updated successfully',
      data: result,
    })
  },
)

//Delete a single Safety
const deleteSafety = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const SafetyId = req.params.id
    const ids = req.user

    const result = await SafetyService.deleteSafety(ids, SafetyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Safety deleted Successfully',
      data: result,
    })
  },
)

// //Get a single Safety
// const singleUserSafety = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await SafetyService.singleUserSafety(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Safety',
//       data: result,
//     })
//   },
// )
// //Get a single Safety
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const SafetyId = req.params.id
//     const result = await SafetyService.singlePropertiesRating(SafetyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Safety average rating',
//       data: result,
//     })
//   },
// )
export const SafetyController = {
  addSafety,
  getSafeties,
  getSingleSafety,
  updateSafety,
  deleteSafety,
  // singleUserSafety,
  // singlePropertiesRating,
}
