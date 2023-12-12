/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, User } from '.prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import bcrypt from 'bcrypt'
import { Secret } from 'jsonwebtoken'
import {
  ChangePasswordPayload,
  IUserFilterRequest,
  UpdateUserResponse,
  UserUpdateInput,
} from './user.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  userRelationalFields,
  userRelationalFieldsMapper,
  userSearchableFields,
} from './user.constants'
import config from '../../../config'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import httpStatus from 'http-status'
import { ICloudinaryResponse } from '../../../interface/file'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import { getUniqueRecord } from '../../utils/utils'

const createUser = async (data: User) => {
  if (!data?.password) {
    throw new ApiError(400, 'Password is required')
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  )

  data.password = hashedPassword

  const result = await prisma.user.create({ data })

  // Hide sensitive data
  const { password, ...userData } = result

  return userData
}

const loginUser = async (data: User) => {
  if (!data?.password || !data?.email) {
    throw new ApiError(400, 'Both username and password are required')
  }

  // Find the user in the database by their username
  const user = await prisma.user.findUnique({
    where: { email: data.email }, // or use email if that's your unique identifier
  })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  // Compare the input password with the stored hashed password
  const isPasswordCorrect = await bcrypt.compare(data.password, user.password)

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Invalid password')
  }

  //Access token and refresh token
  const accessToken = jwtHelpers.createToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  //refresh token and refresh token
  const refreshToken = jwtHelpers.createToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  )

  return { accessToken, refreshToken }
}

const updateUser = async (payload: any): Promise<UpdateUserResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { file, params, user, body } = payload
  const { id: paramsId } = params
  const { id: userId } = user
  if (paramsId !== userId) {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  if (body.email) {
    return { success: false, error: 'You cannot update primary email' }
  }

  // Upload Marketplace image to Cloudinary using the stream approach
  const uploadedImage: ICloudinaryResponse =
    await FileUploadHelper.uploadToCloudinary(file.buffer)
  if (!uploadedImage?.secure_url) {
    return { success: false, error: 'Failed to upload image' }
  }

  const updatedData = {
    ...body,
    profilePic: uploadedImage.secure_url,
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
  })

  return { success: true, data: result }
}

const refreshToken = async (token: string) => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    )
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token')
  }

  const { email, role } = verifiedToken
  const isUserExist = await prisma.user.findUnique({
    where: { email: email },
  })
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist")
  }

  //Access token and refresh token
  const newAccessToken = jwtHelpers.createToken(
    { email: email, role: role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )
  return {
    accessToken: newAccessToken,
  }
}

const getUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filterData } = filters

  const andConditions = []
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
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
        if (userRelationalFields.includes(key)) {
          return {
            [userRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}
  const result = await prisma.user.findMany({
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
  const total = await prisma.user.count({
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

const changePassword = async (
  currentUser: { email: string },
  payload: ChangePasswordPayload,
) => {
  const { oldPassword, newPassword } = payload
  // Validate provided data
  if (!oldPassword || !newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Old password and new password are required',
    )
  }
  // Ensure that the password field in the database is not null or undefined
  if (oldPassword === newPassword) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "You can't use old password",
    )
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: currentUser.email },
    })

    if (!existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    // Ensure that the password field in the database is not null or undefined
    if (!existingUser.password) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Stored password is missing',
      )
    }

    // Compare the provided old password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      existingUser.password,
    )

    if (!isPasswordCorrect) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid old password')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    )

    // Update the user's password
    const updateData: UserUpdateInput = {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    }
    await prisma.user.update({
      where: { email: existingUser.email },
      data: updateData,
    })

    return { message: 'Password updated successfully' }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred',
    )
  }
}

const getSingleUser = async (payload: any) => {
  const model = prisma.user
  const result = await getUniqueRecord(model, payload)
  return result
}

const deleteUser = async (authId: any, deletedId: any) => {
  const isSameUser = await prisma.user.findUnique({
    where: {
      id: deletedId,
    },
  })

  if (!isSameUser) {
    throw new ApiError(404, 'User not found')
  }
  if (
    isSameUser?.id !== authId.id &&
    authId.role !== 'admin' &&
    authId.role !== 'super_admin'
  ) {
    throw new ApiError(400, "You haven't permission to delete")
  }

  const result = await prisma.user.delete({
    where: {
      id: deletedId,
    },
  })

  return result
}

export const UserService = {
  createUser,
  getUsers,
  getSingleUser,
  changePassword,
  loginUser,
  updateUser,
  refreshToken,
  deleteUser,
}
