/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { ReviewService } from './review.service'
import { reviewFilterableFields } from './review.constant'
import { IReviewQueryOption } from '../user/user.constants'

const addReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      file: req.file,
      user: req.user,
    }

    const result = await ReviewService.addReview(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Review added successfully! ',
      data: result,
    })
  },
)

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, reviewFilterableFields)
    const options = pick(req.query, IReviewQueryOption)
    const result = await ReviewService.getAllReviews(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

//Getting a single review
const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id

    const result = await ReviewService.getSingleReview(reviewId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Reviews fetched successfully',
      data: result,
    })
  },
)

//Updating a single review
const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }

    const payload = {
      body: req.body,
      file: req.file,
      user: req.user,
      review: req.params,
    }

    const result = await ReviewService.updateReview(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Reviews fetched successfully',
      data: result,
    })
  },
)

//Delete a single review
const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = req.params.id
    const ids = req.user?.id
    const result = await ReviewService.deleteReview(ids, reviewId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Review deleted Successfully',
      data: result,
    })
  },
)

//Get a single review
const singleUserReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const result = await ReviewService.singleUserReview(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Get a single user all review',
      data: result,
    })
  },
)
//Get a single review
const singlePropertiesRating = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.id
    const result = await ReviewService.singlePropertiesRating(propertyId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get a single property average rating',
      data: result,
    })
  },
)
export const ReviewController = {
  addReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  singleUserReview,
  singlePropertiesRating,
}
