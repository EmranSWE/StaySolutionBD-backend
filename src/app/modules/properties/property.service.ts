/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Property } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import { IPropertyFilterRequest } from './property.interface'
import {
  propertyRelationalFields,
  propertySearchableFields,
} from './property.constant'

const addProperty = async (payload: Property) => {
  const PropertyData = await prisma.property.create({
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

  return PropertyData
}

const getAllProperties = async (
  filters: IPropertyFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Property[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters
  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: propertySearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (propertyRelationalFields.includes(key)) {
          return {
            //@ts-ignore
            [propertyRelationalFields[key]]: {
              id: (filterData as any)[key],
            },
          }
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          }
        }
      }),
    })
  }

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            monthlyRent: 'desc',
          },
  })
  const total = await prisma.property.count({
    where: whereConditions,
  })

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

// const getSingleProperty = async (payload: any) => {
//   const model = prisma.Property
//   const result = getUniqueRecord(model, payload)
//   return result
// }

// const updateProperty = async (
//   authId: any,
//   PropertyId: any,
//   payload: Property,
// ) => {
//   const { propertyId, tenantId, ...safePayload } = payload
//   const existingProperty = await prisma.Property.findUnique({
//     where: {
//       id: PropertyId,
//     },
//   })

//   if (existingProperty?.tenantId !== authId) {
//     throw new ApiError(400, "You haven't permission to change the Property")
//   }
//   if (propertyId && tenantId) {
//     throw new ApiError(400, "You can't change the foreign key")
//   }
//   const result = await prisma.Property.update({
//     where: {
//       id: PropertyId,
//     },
//     data: safePayload,
//   })
//   return result
// }

// const deleteProperty = async (authId: any, deletedId: any) => {
//   const isSameUser = await prisma.Property.findUnique({
//     where: {
//       id: deletedId,
//     },
//   })

//   // If the Property does not exist, throw an error.
//   if (!isSameUser) {
//     throw new ApiError(404, 'Property not found')
//   }

//   if (isSameUser?.tenantId !== authId) {
//     throw new ApiError(400, "You haven't permission to change the Property")
//   }

//   const result = await prisma.Property.delete({
//     where: {
//       id: deletedId,
//     },
//   })

//   return result
// }

// const singleUserProperty = async (userId: any) => {
//   const allPropertys = await prisma.Property.findMany({
//     where: {
//       tenantId: userId,
//     },
//   })

//   // If the Property does not exist, throw an error.
//   if (!allPropertys) {
//     throw new ApiError(404, 'Property not found')
//   }

//   return allPropertys
// }
// const singlePropertiesRating = async (propertyId: any) => {
//   const propertyAvgRating = await prisma.Property.aggregate({
//     where: {
//       propertyId: propertyId,
//     },
//     _avg: {
//       rating: true,
//     },
//   })

//   const averageRating = propertyAvgRating._avg.rating

//   // If there's no average rating (e.g. no Propertys exist), handle it appropriately.
//   if (averageRating === null) {
//     throw new ApiError(404, 'Property not found')
//   }

//   const avgRate = Math.round(averageRating)

//   return avgRate // return the rounded value
// }
export const PropertyService = {
  addProperty,
  getAllProperties,
  // getSingleProperty,
  // updateProperty,
  // deleteProperty,
  // singleUserProperty,
  // singlePropertiesRating,
}
