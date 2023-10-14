import { Property } from '@prisma/client'
import prisma from '../../../shared/prisma'

const createProperties = async (payload: Property) => {
  const result = await prisma.property.create({
    data: payload,
    include: {
      owner: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          role: true,
          address: true,
          email: true,
          password: false,
        },
      },
    },
  })
  return result
}
export const propertyService = {
  createProperties,
}
