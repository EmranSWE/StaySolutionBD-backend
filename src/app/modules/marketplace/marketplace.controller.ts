/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { MarketplaceService } from './marketplace.service'
import {
  IMarketplaceQueryOption,
  marketplaceFilterableFields,
} from './marketplace.constant'

const addMarketplace = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      file: req.file,
      user: req.user,
    }

    const result = await MarketplaceService.addMarketplace(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Marketplace added successfully! ',
      data: result,
    })
  },
)

const getMarketplaces = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, marketplaceFilterableFields)
    const options = pick(req.query, IMarketplaceQueryOption)
    const result = await MarketplaceService.getMarketplaces(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Marketplace fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Marketplace
const getSingleMarketplace = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const MarketplaceId = req.params.id

    const result = await MarketplaceService.getSingleMarketplace(MarketplaceId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Marketplace
const updateMarketplace = catchAsync(
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

    const result = await MarketplaceService.updateMarketplace(payload)
    res.status(200).json({
      success: true,
      message: 'Marketplace updated successfully',
      data: result,
    })
  },
)

//Delete a single Marketplace
const deleteMarketplace = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const MarketplaceId = req.params.id
    const ids = req.user

    const result = await MarketplaceService.deleteMarketplace(
      ids,
      MarketplaceId,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Marketplace deleted Successfully',
      data: result,
    })
  },
)

//Get a single Marketplace
const singleUserMarketplace = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const result = await MarketplaceService.singleUserMarketplace(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get a my user all Property',
      data: result,
    })
  },
)
// //Get a single Marketplace
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const MarketplaceId = req.params.id
//     const result = await MarketplaceService.singlePropertiesRating(MarketplaceId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Marketplace average rating',
//       data: result,
//     })
//   },
// )
export const MarketplaceController = {
  addMarketplace,
  getMarketplaces,
  getSingleMarketplace,
  updateMarketplace,
  deleteMarketplace,
  singleUserMarketplace,
  // singlePropertiesRating,
}
