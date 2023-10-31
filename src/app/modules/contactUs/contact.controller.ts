/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import { ContactService } from './contact.service'

const addContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ContactService.addContact(req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contact added successfully! ',
      data: result,
    })
  },
)

const getAllContacts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ContactService.getAllContacts()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Contacts fetched successfully',
      data: result,
    })
  },
)

//Getting a single Contact
const getSingleContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ContactId = req.params.id

    const result = await ContactService.getSingleContact(ContactId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Contacts fetched successfully',
      data: result,
    })
  },
)

//Delete a single Contact
const deleteContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ContactId = req.params.id

    const result = await ContactService.deleteContact(ContactId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: ' Contact deleted Successfully',
      data: result,
    })
  },
)

export const ContactController = {
  addContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
}
