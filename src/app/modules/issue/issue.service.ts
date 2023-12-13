import {
  IIssueRelationalFields,
  IIssueRelationalFieldsMapper,
  IIssueSearchableFields,
} from './issue.constant'
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Issue, Review } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import { IPaginationOptions } from '../../../interface/pagination'
import { IGenericResponse } from '../../../interface/common'
import { paginationHelpers } from '../../../helpers/paginationHelper'

import { getUniqueRecord } from '../../utils/utils'
import { IIssueFilterRequest, UpdateIssueResponse } from './issue.interface'

const addIssue = async (payload: any) => {
  // Validate payload input
  if (!payload || !payload.body || !payload.user) {
    return { success: false, error: 'Invalid data or missing' }
  }

  // Destructure payload
  const { role, id: userId } = payload.user
  const { propertyId, ...issueData } = payload.body

  // Authorization check: Ensure user has the 'renter' role
  if (role !== 'renter') {
    return {
      success: false,
      error: 'Unauthorized: You cannot create an issue',
    }
  }
  const result = await prisma.issue.create({
    data: {
      ...issueData,
      user: {
        connect: {
          id: userId,
        },
      },
      property: {
        connect: {
          id: propertyId,
        },
      },
    },
  })

  return { success: true, data: result }
}

const getProperties = async (
  filters: IIssueFilterRequest,
  options: IPaginationOptions,
): Promise<IGenericResponse<Issue[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)

  const { searchTerm, issueStatus, priorityLevel, monthlyRent, ...filterData } =
    filters
  const andConditions = []

  // Handling search term
  if (searchTerm) {
    andConditions.push({
      OR: IIssueSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  // Check if the parsed value is a valid number
  if (priorityLevel !== undefined) {
    andConditions.push({ priorityLevel })
  }

  if (issueStatus !== undefined) {
    andConditions.push({ issueStatus })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (IIssueRelationalFields.includes(key)) {
          return {
            [IIssueRelationalFieldsMapper[key]]: {
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

  const result = await prisma.issue.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            reportDate: 'desc',
          },
  })
  const total = await prisma.issue.count({
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

const getSingleIssue = async (payload: any) => {
  const model = prisma.issue
  const result = await getUniqueRecord(model, payload)
  return result
}

//Update Issue
const updateIssue = async (payload: any): Promise<UpdateIssueResponse> => {
  if (!payload.params?.id || !payload.user?.id) {
    return { success: false, error: 'Invalid input or file is missing' }
  }
  const { params, user, body } = payload

  const { id: IssueId } = params
  const { id: userId, role } = user
  const existingIssue = await prisma.issue.findUnique({
    where: {
      id: IssueId,
    },
  })

  if (existingIssue?.renterId !== userId && role !== 'admin') {
    return {
      success: false,
      error: 'Unauthorized: You cannot update this user',
    }
  }

  const { propertyId, renterId, ...restData } = body

  const result = await prisma.issue.update({
    where: { id: IssueId },
    data: restData,
  })
  return { success: true, data: result }
}

const deleteIssue = async (
  authUser: string | any,
  deletedId: any,
): Promise<any> => {
  const isSameUser = await prisma.issue.findUnique({
    where: {
      id: deletedId,
    },
  })

  // If the Issue does not exist, throw an error.
  if (!isSameUser) {
    throw new ApiError(404, 'Issue not found')
  }
  const { role, id } = authUser

  if (
    isSameUser.renterId !== id &&
    role !== 'admin' &&
    role !== 'super_admin'
  ) {
    throw new ApiError(400, "You haven't permission to delete the Issue")
  }

  const result = await prisma.issue.delete({
    where: {
      id: deletedId,
    },
  })
  return result
}

const getSingleRenterIssue = async (userId: any) => {
  const allIssues = await prisma.issue.findMany({
    where: {
      renterId: userId.id,
    },
  })
  if (!allIssues) {
    throw new ApiError(404, 'Review not found')
  }
  return allIssues
}
export const IssueService = {
  addIssue,
  getProperties,
  getSingleIssue,
  updateIssue,
  deleteIssue,
  getSingleRenterIssue,
}
