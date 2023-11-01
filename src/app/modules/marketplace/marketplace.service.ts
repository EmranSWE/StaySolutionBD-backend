/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Marketplace } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { ICloudinaryResponse, IUploadFile } from '../../../interface/file'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'

import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import {
  IMarketplaceFilterRequest,
  UpdateMarketplaceResponse,
} from './marketplace.interface'
import {
  marketplaceRelationalFields,
  marketplaceRelationalFieldsMapper,
  marketplaceSearchableFields,
} from './marketplace.constant'

const addMarketplace = async (payload: any) => {
  const { file, user, body } = payload
  // Validate file input
  if (!file) {
    return { success: false, error: 'Invalid input or file is missing' }
  }

  // Authorization check: Ensure user has the 'owner' role
  const { role } = user
  if (role !== 'owner') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  // Upload Marketplace image to Cloudinary (or similar cloud storage)
  // const uploadedImage: ICloudinaryResponse =
  //   await FileUploadHelper.uploadToCloudinary(file as IUploadFile)
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }

  // Prepare Marketplace data with the uploaded image URL
  const updatedData = {
    ...body,
    ownerId: user.id,
    propertyImage: uploadedImage.secure_url,
  }

  // Create a new Marketplace record in the database using Prisma
  const result = await prisma.marketplace.create({
    data: updatedData,
    include: { owner: true },
  })

  // Return the created Marketplace data
  return { success: true, data: result }
}

const getMarketplaces = async (
  filters: IMarketplaceFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Marketplace[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, price, category, ...filterData } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: marketplaceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  // Handling number of rooms
  const priceInt = Number(price)

  if (!isNaN(priceInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ price: priceInt })
  }
  if (category) {
    andConditions.push({ category: category })
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (marketplaceRelationalFields.includes(key)) {
          return {
            [marketplaceRelationalFieldsMapper[key]]: {
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

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.marketplace.findMany({
    where: whereConditions,
    include: { owner: true },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            price: 'desc',
          },
  })
  const total = await prisma.marketplace.count({
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

const getSingleMarketplace = async (payload: any) => {
  const result = await prisma.marketplace.findUnique({
    where: {
      id: payload,
    },
    include: {
      owner: true,
    },
  })
  return result
}

//Update Marketplace
const updateMarketplace = async (
  payload: any,
): Promise<UpdateMarketplaceResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }

  const { file, params, user, body } = payload

  const { id: MarketplaceId } = params
  const { id: userId } = user
  const existingMarketplace = await prisma.marketplace.findUnique({
    where: {
      id: MarketplaceId,
    },
  })

  if (existingMarketplace?.ownerId !== userId) {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)

  const updatedData = {
    ...body,
    propertyImage: uploadedImage.secure_url,
  }

  const result = await prisma.marketplace.update({
    where: { id: MarketplaceId },
    data: updatedData,
  })

  return { success: true, data: result }
}
const deleteMarketplace = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.marketplace.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the Marketplace does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Marketplace not found')
  }
  const { role, id } = authUser

  if (isSameUser.ownerId !== id && role !== 'admin' && role !== 'super_admin') {
    throw new ApiError(400, "You haven't permission to delete the Marketplace")
  }

  const result = await prisma.marketplace.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

const singleUserMarketplace = async (userId: any) => {
  const result = await prisma.marketplace.findMany({
    where: { ownerId: userId },
    include: { owner: true },
  })

  return result
}
export const MarketplaceService = {
  addMarketplace,
  getMarketplaces,
  getSingleMarketplace,
  updateMarketplace,
  deleteMarketplace,
  singleUserMarketplace,
  // singlePropertiesRating,
}
