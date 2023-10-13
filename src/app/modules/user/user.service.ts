/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, User } from '.prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import bcrypt from 'bcrypt'
import { Secret } from 'jsonwebtoken'
import { IAcademicDepartmentFilterRequest } from './user.interface'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { userRelationalFields, userSearchableFields } from './user.contant'
import config from '../../../config'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import httpStatus from 'http-status'

const createUser = async (data: User) => {
  if (!data?.password) {
    throw new ApiError(400, 'Password is required')
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  )
  data.password = hashedPassword
  try {
    const result = await prisma.user.create({
      data,
    })

    // Hide sensitive data
    delete result.password

    return result
  } catch (error) {
    throw new ApiError(500, 'Internal server error')
  }
}
const loginUser = async (data: User) => {
  if (!data?.password || !data?.email) {
    throw new ApiError(400, 'Both username and password are required')
  }
  try {
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
    const { password, ...userWithoutPassword } = user
    return { userWithoutPassword, accessToken, refreshToken }
  } catch (error) {
    // For other types of errors, throw a general internal server error
    throw new ApiError(500, 'Internal server error')
  }
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
  filters: IAcademicDepartmentFilterRequest,
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
            [userRelationalFields[key]]: {
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
    // include: {
    //   academicFaculty: true,
    // },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            address: 'desc',
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

interface IChangedPassword {
  email: string
  oldPassword: string
  newPassword: string
}
const changePassword = async (data: IChangedPassword) => {
  const { oldPassword, newPassword, email } = data

  // Validate provided data
  if (!email || !oldPassword || !newPassword) {
    throw new ApiError(
      400,
      'Email, old password, and new password are required',
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }, // Use email as the unique identifier
    })

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    // Compare the input password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

    if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid old password')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds),
    )

    // Update password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    })

    return {} // Return empty object or maybe some relevant info if needed
  } catch (error) {
    // Handle other unexpected errors here if needed
    throw error
  }
}
export const UserService = {
  createUser,
  getUsers,
  changePassword,
  loginUser,
  refreshToken,
}
