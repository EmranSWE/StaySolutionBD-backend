/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, WishList } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'

import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  wishlistRelationalFields,
  wishlistRelationalFieldsMapper,
  wishlistSearchableFields,
} from './wishlist.constant'
import { getUniqueRecord } from '../../utils/utils'
import {
  IWishlistFilterRequest,
  UpdateWishlistResponse,
} from './wishlist.interface'

const addWishlist = async (payload: any) => {
  const { user, body } = payload
  if (user.role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot create wishlist',
    }
  }

  const updatedData = {
    renter: {
      connect: {
        id: user.id,
      },
    },
    property: {
      connect: {
        id: body.propertyId,
      },
    },
  }

  const result = await prisma.wishList.create({
    data: updatedData,
  })

  return { success: true, data: result }
}

const getWishlist = async (
  filters: IWishlistFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<WishList[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, ...filterData } = filters

  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: wishlistSearchableFields.map(field => ({
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
        if (wishlistRelationalFields.includes(key)) {
          return {
            [wishlistRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.WishListWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.wishList.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            dateAdded: 'desc',
          },
  })
  const total = await prisma.wishList.count({
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

const getSingleWishlist = async (payload: any) => {
  const model = prisma.wishList
  const result = await getUniqueRecord(model, payload)
  return result
}

//Update Wishlist
const updateWishlist = async (
  payload: any,
): Promise<UpdateWishlistResponse> => {
  if (!payload?.file || !payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { file, params, user, body } = payload
  const { id: WishlistId } = params
  const { id: userId } = user
  const existingWishlist = await prisma.wishList.findUnique({
    where: {
      id: WishlistId,
    },
  })

  if (existingWishlist?.renterId !== userId) {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  const updatedData = {
    ...body,
  }

  const result = await prisma.wishList.update({
    where: { id: WishlistId },
    data: updatedData,
  })

  return { success: true, data: result }
}
const deleteWishlist = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.wishList.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the Wishlist does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Wishlist not found')
  }
  const { role, id } = authUser

  if (
    isSameUser.renterId !== id &&
    role !== 'admin' &&
    role !== 'super_admin'
  ) {
    throw new ApiError(400, "You haven't permission to delete the Wishlist")
  }

  const result = await prisma.wishList.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}
export const WishlistService = {
  addWishlist,
  getWishlist,
  getSingleWishlist,
  updateWishlist,
  deleteWishlist,
  // singleUserWishlist,
  // singlePropertiesRating,
}
