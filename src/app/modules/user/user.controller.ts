/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { userFilterableFields } from './user.contant'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created',
      data: userData,
    })
    next()
  },
)
const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, userFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await UserService.getUsers(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'AcademicDepartments fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)

export const UserController = {
  createUser,
  getUsers,
}
