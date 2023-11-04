/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Property, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { ICloudinaryResponse, IUploadFile } from '../../../interface/file'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import {
  IPropertyFilterRequest,
  UpdatePropertyResponse,
} from './property.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  propertyFilterableFields,
  propertyRelationalFields,
  propertyRelationalFieldsMapper,
  propertySearchableFields,
} from './property.constant'
import { getUniqueRecord } from '../../utils/utils'

/**
 * Service function to add a new property to the database.
 *
 * @param payload - The input object containing file, user, and property details.
 * @param payload.file - The image file for the property.
 * @param payload.user - The user object with information about the user making the request.
 * @param payload.body - The property details.
 *
 * @returns An object indicating the success status and the data or error message.
 *
 * @example
 * const response = await addProperty({ file, user, body });
 * if (response.success) console.log("Property added:", response.data);
 * else console.error("Error:", response.error);
 */
const addProperty = async (payload: any) => {
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
  // Upload Marketplace image to Cloudinary using the stream approach
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }
  // Prepare property data with the uploaded image URL
  const updatedData = {
    ...body,
    imageGallery: [uploadedImage.secure_url],
  }

  // Create a new property record in the database using Prisma
  const result = await prisma.property.create({
    data: updatedData,
  })

  // Return the created property data
  return { success: true, data: result }
}

const getProperties = async (
  filters: IPropertyFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Property[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const {
    searchTerm,
    numberOfRooms,
    availableAfter,
    monthlyRent,
    location,
    size,
    maxOccupancy,
    propertyStatus,
    ...filterData
  } = filters

  const andConditions = []

  // Handling search term
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

  // Handling number of rooms
  const numberOfRoomsInt = Number(numberOfRooms)

  if (!isNaN(numberOfRoomsInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ numberOfRooms: numberOfRoomsInt })
  }

  // Handling number of rooms
  const maxOccupancyInt = Number(maxOccupancy)

  if (!isNaN(maxOccupancyInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ maxOccupancy: maxOccupancyInt })
  }
  const monthlyRentInt = Number(monthlyRent)

  if (!isNaN(monthlyRentInt)) {
    // Check if the parsed value is a valid number
    andConditions.push({ monthlyRent: { lte: monthlyRentInt } })
  }
  // Handling available after date
  if (availableAfter) {
    andConditions.push({ availableDate: { gte: availableAfter } })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (propertyRelationalFields.includes(key)) {
          return {
            [propertyRelationalFieldsMapper[key]]: {
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
            createdAt: 'desc',
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

const getSingleProperty = async (payload: any) => {
  const model = prisma.property
  const result = await getUniqueRecord(model, payload)
  return result
}

// Get featured Property
const getFeaturedProperties = async () => {
  const result = await prisma.property.findMany({
    where: {
      propertyStatus: 'available',
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 4,
  })
  return result
}
//Update property
const updateProperty = async (
  payload: any,
): Promise<UpdatePropertyResponse> => {
  if (!payload.params?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { file, params, user, body } = payload
  const { id: propertyId } = params
  const { id: userId, role } = user
  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  })

  if (existingProperty?.ownerId !== userId && role !== 'admin') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  // Upload Marketplace image to Cloudinary using the stream approach
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }

  const updatedData = {
    ...body,
    imageGallery: {
      push: uploadedImage.secure_url,
    },
  }

  const result = await prisma.property.update({
    where: { id: propertyId },
    data: updatedData,
  })

  return { success: true, data: result }
}

const deleteProperty = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.property.findUnique({
    where: {
      id: deletedId,
    },
    include: {
      bookings: true,
    },
  })

  // If the property does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Property not found')
  }
  const { role, id } = authUser

  if (isSameUser.ownerId !== id && role !== 'admin' && role !== 'super_admin') {
    throw new ApiError(400, "You haven't permission to delete the property")
  }

  const result = await prisma.property.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

const singleUserProperty = async (userId: any) => {
  const result = await prisma.property.findMany({
    where: { ownerId: userId },
  })

  return result
}

const popularCategory = async () => {
  const properties = await prisma.property.findMany()

  const tagFrequency = new Map()

  properties.forEach(property => {
    property.propertyTags.forEach(tag => {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1)
    })
  })

  const sortedTags = Array.from(tagFrequency.entries()).sort(
    (a, b) => b[1] - a[1],
  )

  // Get the top 3 most frequent tags
  const popularTags = sortedTags.slice(0, 4).map(entry => entry[0])

  // Filter the properties to those that include the popular tags
  const popularProperties = properties.filter(property =>
    property.propertyTags.some(tag => popularTags.includes(tag)),
  )

  // Map the popular properties to an array of objects with only the tag and image gallery
  const popularCategoriesWithImages = popularProperties.map(property => ({
    category: property.propertyTags.filter(tag => popularTags.includes(tag)),
    imageGallery: property.imageGallery,
  }))

  // Return the popular categories with their images
  return popularCategoriesWithImages
}

const singleRenterProperty = async (renterId: any) => {
  const result = await prisma.property.findMany({
    where: {
      bookings: {
        some: {
          renterId: renterId,
          bookingStatus: 'Confirmed',
        },
      },
    },
    include: {
      bookings: true,
    },
  })

  return result
}
export const PropertyService = {
  addProperty,
  getProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  singleUserProperty,
  getFeaturedProperties,
  singleRenterProperty,
  popularCategory,
  // singlePropertiesRating,
}
