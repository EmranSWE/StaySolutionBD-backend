/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { propertyService } from './property.service'

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyData = req.body
    const result = await propertyService.createProperties(propertyData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties created successfully !',
      data: result,
    })
  },
)

export const propertyController = {
  createProperties,
}
