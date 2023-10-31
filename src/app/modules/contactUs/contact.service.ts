/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from '../../../shared/prisma'
import { getUniqueRecord } from '../../utils/utils'

const addContact = async (payload: any) => {
  const result = await prisma.contactUs.create({
    data: payload,
  })

  // Return the created Contact data
  return { success: true, data: result }
}

const getAllContacts = async () => {
  const result = await prisma.contactUs.findMany({})
  return { success: true, data: result }
}

const getSingleContact = async (payload: any) => {
  const model = prisma.contactUs
  const result = getUniqueRecord(model, payload)
  return result
}

const deleteContact = async (deletedId: any) => {
  const result = await prisma.contactUs.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

export const ContactService = {
  addContact,
  getAllContacts,
  getSingleContact,
  deleteContact,
}
