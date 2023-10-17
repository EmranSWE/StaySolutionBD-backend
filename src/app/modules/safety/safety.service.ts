/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Safety, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { ICloudinaryResponse, IUploadFile } from '../../../interface/file'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import { ISafetyFilterRequest, UpdateSafetyResponse } from './safety.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  SafetyRelationalFields,
  SafetyRelationalFieldsMapper,
} from './safety.constant'
import { getUniqueRecord } from '../../utils/utils'

const addSafety = async (payload: any) => {
  const { user, body } = payload

  // Authorization check: Ensure user has the 'owner' role
  const { role } = user
  if (role !== 'owner' && role !== 'admin') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  // Prepare Safety data with the uploaded image URL
  const updatedData = {
    ...body,
  }

  // Create a new Safetyrecord in the database using Prisma
  const result = await prisma.safety.create({
    data: updatedData,
  })

  // Return the created Safety data
  return { success: true, data: result }
}

const getProperties = async (
  filters: ISafetyFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Safety[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, safetyScore, ...filterData } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      safetyAmenities: {
        has: searchTerm,
      },
    })
  }

  // Handling number of rooms
  const safetyScoreInt = Number(safetyScore)

  if (!isNaN(safetyScoreInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ safetyScore: safetyScoreInt })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (SafetyRelationalFields.includes(key)) {
          return {
            [SafetyRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.SafetyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.safety.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            safetyScore: 'desc',
          },
  })
  const total = await prisma.safety.count({
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

const getSingleSafety = async (payload: any) => {
  const model = prisma.safety
  const result = await getUniqueRecord(model, payload)
  return result
}

//Update safety
const updateSafety = async (payload: any): Promise<UpdateSafetyResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { params, body } = payload
  const { id: safetyId } = params

  const updatedData = {
    ...body,
  }

  const result = await prisma.safety.update({
    where: { id: safetyId },
    data: updatedData,
  })

  return { success: true, data: result }
}
const deleteSafety = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const result = await prisma.safety.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}
export const SafetyService = {
  addSafety,
  getProperties,
  getSingleSafety,
  updateSafety,
  deleteSafety,
  // singleUserSafety,
  // singlePropertiesRating,
}
