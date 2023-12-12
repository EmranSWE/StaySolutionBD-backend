/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { UserService } from './user.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { IReviewQueryOption, userFilterableFields } from './user.constants'
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

// User Profile Update
const updateUser = catchAsync(
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
    const result = await UserService.updateUser(payload)
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result,
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
    const options = pick(req.query, IReviewQueryOption)

    const result = await UserService.getUsers(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  },
)
// get single user

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req?.user?.id

    const result = await UserService.getSingleUser(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get a my user all Property',
      data: result,
    })
  },
)
//Delete a single user
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const UserId = req.params.id
    const ids = req.user
    const result = await UserService.deleteUser(ids, UserId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' User deleted Successfully',
      data: result,
    })
  },
)
export const UserController = {
  createUser,
  getUsers,
  getSingleUser,
  loginUser,
  refreshToken,
  changePassword,
  updateUser,
  deleteUser,
}
