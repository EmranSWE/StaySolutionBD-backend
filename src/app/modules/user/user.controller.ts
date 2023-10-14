/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { userFilterableFields } from './user.contant'
import config from '../../../config'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const result = await UserService.createUser(userData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully ! YAY',
      data: result,
    })
  },
)

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    const result = await UserService.loginUser(userData)
    const { refreshToken, ...others } = result
    //set refresh token
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    }
    res.cookie('refreshToken', result.refreshToken, cookieOptions)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully ! YAY',
      data: others,
    })
  },
)

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const oldPassword = req.body
    const result = await UserService.changePassword(
      user as { email: string },
      oldPassword,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password changed successfully',
      data: result,
    })
  },
)

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies
    const result = await UserService.refreshToken(refreshToken)
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    }
    res.cookie('refreshToken', refreshToken, cookieOptions)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully ! YAY',
      data: result,
    })
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
  loginUser,
  refreshToken,
  changePassword,
}
