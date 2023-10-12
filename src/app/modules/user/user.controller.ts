/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'

import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created',
      data: userData,
    })
  },
)

export const UserController = {
  createUser,
}
