import { User } from '.prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'

const createUser = (data: User) => {
  const result = prisma.user.create({
    data,
  })
  if (!result) {
    throw new ApiError(400, 'Failed to create')
  }
  return result
}

export const UserService = {
  createUser,
}
