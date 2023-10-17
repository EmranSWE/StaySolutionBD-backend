/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'

import {
  IPropertyQueryOption,
  propertyFilterableFields,
} from './property.constant'
import { PropertyService } from './property.service'

const addProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      file: req.file,
      user: req.user,
    }

    const result = await PropertyService.addProperty(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property added successfully! ',
      data: result,
    })
  },
)

const getProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, propertyFilterableFields)
    const options = pick(req.query, IPropertyQueryOption)
    const result = await PropertyService.getProperties(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Property
const getSingleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const PropertyId = req.params.id

    const result = await PropertyService.getSingleProperty(PropertyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Property
const updateProperty = catchAsync(
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

    const result = await PropertyService.updateProperty(payload)
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: result,
    })
  },
)

//Delete a single Property
const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const PropertyId = req.params.id
    const ids = req.user

    const result = await PropertyService.deleteProperty(ids, PropertyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Property deleted Successfully',
      data: result,
    })
  },
)

// //Get a single Property
// const singleUserProperty = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await PropertyService.singleUserProperty(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Property',
//       data: result,
//     })
//   },
// )
// //Get a single Property
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const propertyId = req.params.id
//     const result = await PropertyService.singlePropertiesRating(propertyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single property average rating',
//       data: result,
//     })
//   },
// )
export const PropertyController = {
  addProperty,
  getProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  // singleUserProperty,
  // singlePropertiesRating,
}
