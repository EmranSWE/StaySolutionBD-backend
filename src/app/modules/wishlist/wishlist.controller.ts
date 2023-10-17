/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'

import {
  IWishlistQueryOption,
  wishlistFilterableFields,
} from './wishlist.constant'
import { WishlistService } from './wishlist.service'

const addWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result = await WishlistService.addWishlist(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wishlist added successfully! ',
      data: result,
    })
  },
)

const getWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, wishlistFilterableFields)
    const options = pick(req.query, IWishlistQueryOption)
    const result = await WishlistService.getWishlist(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wishlist fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Wishlist
const getSingleWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const WishlistId = req.params.id

    const result = await WishlistService.getSingleWishlist(WishlistId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Wishlist
const updateWishlist = catchAsync(
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

    const result = await WishlistService.updateWishlist(payload)
    res.status(200).json({
      success: true,
      message: 'Wishlistupdated successfully',
      data: result,
    })
  },
)

//Delete a single Wishlist
const deleteWishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const WishlistId = req.params.id
    const ids = req.user

    const result = await WishlistService.deleteWishlist(ids, WishlistId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Wishlistdeleted Successfully',
      data: result,
    })
  },
)

// //Get a single Wishlist
// const singleUserWishlist= catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await WishlistService.singleUserWishlist(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Wishlist',
//       data: result,
//     })
//   },
// )
// //Get a single Wishlist
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const WishlistId = req.params.id
//     const result = await WishlistService.singlePropertiesRating(WishlistId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single Wishlistaverage rating',
//       data: result,
//     })
//   },
// )
export const WishlistController = {
  addWishlist,
  getWishlist,
  getSingleWishlist,
  updateWishlist,
  deleteWishlist,
  // singleUserWishlist,
  // singlePropertiesRating,
}
