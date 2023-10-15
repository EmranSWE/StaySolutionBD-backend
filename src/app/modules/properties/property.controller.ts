// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable no-unused-vars */
// import { NextFunction, Request, Response } from 'express'
// import catchAsync from '../../../shared/catchAsync'
// import sendResponse from '../../../shared/sendResponse'
// import httpStatus from 'http-status'
// import { propertyService } from './property.service'

// const createProperties = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const propertyData = req.body
//     const result = await propertyService.createProperties(propertyData)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Properties created successfully !',
//       data: result,
//     })
//   },
// )

// export const propertyController = {
//   createProperties,
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
// import config from '../../../config'
import { PropertyService } from './property.service'
import {
  IPropertyQueryOption,
  propertyFilterableFields,
} from './property.constant'

const addProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const PropertyData = req.body
    const result = await PropertyService.addProperty(PropertyData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property added successfully! ',
      data: result,
    })
  },
)

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, propertyFilterableFields)
    const options = pick(req.query, IPropertyQueryOption)

    const result = await PropertyService.getAllProperties(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Propertys fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// //Getting a single Property
// const getSingleProperty = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const PropertyId = req.params.id

//     const result = await PropertyService.getSingleProperty(PropertyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Propertys fetched successfully',
//       data: result,
//     })
//   },
// )

// //Updating a single Property
// const updateProperty = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const PropertyId = req.params.id
//     const updatedData = req.body
//     const ids = req.user?.id
//     const result = await PropertyService.updateProperty(
//       ids,
//       PropertyId,
//       updatedData,
//     )
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Propertys fetched successfully',
//       data: result,
//     })
//   },
// )

// //Delete a single Property
// const deleteProperty = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const PropertyId = req.params.id
//     const ids = req.user?.id

//     const result = await PropertyService.deleteProperty(ids, PropertyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Property deleted Successfully',
//       data: result,
//     })
//   },
// )

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
  getAllProperties,
  // getAllPropertys,
  // getSingleProperty,
  // updateProperty,
  // deleteProperty,
  // singleUserProperty,
  // singlePropertiesRating,
}
