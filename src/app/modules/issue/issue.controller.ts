/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { IssueService } from './issue.service'
import { IIIssueQueryOption, IIssueFilterableFields } from './issue.constant'

const addIssue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      user: req.user,
    }

    const result = await IssueService.addIssue(payload)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Issue added successfully! ',
      data: result,
    })
  },
)

const getIssues = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, IIssueFilterableFields)
    const options = pick(req.query, IIIssueQueryOption)
    const result = await IssueService.getProperties(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

// Getting a single Issue
const getSingleIssue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const IssueId = req.params.id

    const result = await IssueService.getSingleIssue(IssueId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

// Getting a single Issue
const getSingleRenterIssue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.user

    const result = await IssueService.getSingleRenterIssue(UserId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  },
)

//Updating a single Issue
const updateIssue = catchAsync(
  async (req, res: Response, next: NextFunction) => {
    const payload = {
      body: req.body,
      params: req.params,
      user: req.user,
    }

    const result = await IssueService.updateIssue(payload)
    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: result,
    })
  },
)

//Delete a single Issue
const deleteIssue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const IssueId = req.params.id
    const ids = req.user
    const result = await IssueService.deleteIssue(ids, IssueId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Issue deleted Successfully',
      data: result,
    })
  },
)

export const IssueController = {
  addIssue,
  getIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getSingleRenterIssue,
  // singleUserIssue,
  // singlePropertiesRating,
}
