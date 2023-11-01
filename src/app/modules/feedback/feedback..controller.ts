/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { FeedbackService } from './feedback.service'
import { IPropertyQueryOption } from '../properties/property.constant'

const addFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result = await FeedbackService.addFeedback(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Feedback added successfully! ',
      data: result,
    })
  },
)

const getAllFeedbacks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, IPropertyQueryOption)
    const result = await FeedbackService.getAllFeedbacks(options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

//Getting a single Feedback
// const getSingleFeedback = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const FeedbackId = req.params.id

//     const result = await FeedbackService.getSingleFeedback(FeedbackId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Feedbacks fetched successfully',
//       data: result,
//     })
//   },
// )

// //Updating a single Feedback
// const updateFeedback = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data)
//     }

//     const payload = {
//       body: req.body,
//       file: req.file,
//       user: req.user,
//       Feedback: req.params,
//     }

//     const result = await FeedbackService.updateFeedback(payload)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Single Feedbacks fetched successfully',
//       data: result,
//     })
//   },
// )

//Delete a single Feedback
const deleteFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const FeedbackId = req.params.id
    const ids = req.user?.id

    const result = await FeedbackService.deleteFeedback(ids, FeedbackId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Feedback deleted Successfully',
      data: result,
    })
  },
)

//Get a single Feedback
const singleUserFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const result = await FeedbackService.singleUserFeedback(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Get a single user all Feedback',
      data: result,
    })
  },
)

//Get a single Feedback
const updateFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body
    const id = req.params.id
    const result = await FeedbackService.updateFeedback(data, id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Get a single user all Feedback',
      data: result,
    })
  },
)
//Get a single Feedback
const getSingleFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feedbackId = req.params.id
    const result = await FeedbackService.getSingleFeedback(feedbackId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get a single feedback average rating',
      data: result,
    })
  },
)
export const FeedbackController = {
  addFeedback,
  getAllFeedbacks,
  singleUserFeedback,
  getSingleFeedback,
  deleteFeedback,
  updateFeedback,
}
