/* eslint-disable no-console */
import { Prisma } from '@prisma/client'
import { IGenericErrorMessage } from '../interface/error'

const handleClientError = (error: Prisma.PrismaClientKnownRequestError) => {
  const errors: IGenericErrorMessage[] = []
  console.log(error.code === 'P2003')
  let message = 'An unexpected error occurred.'

  if (error.code === 'P2025') {
    message = (error.meta?.cause as string) || 'Record not found!'
    errors.push({
      path: '',
      message,
    })
  } else if (error.code === 'P2002') {
    // Handling unique constraint violations
    const uniqueConstraintMatch = error.message.match(
      /Unique constraint failed on the fields: \(`(.*?)`\)/,
    )

    const fieldName = uniqueConstraintMatch ? uniqueConstraintMatch[1] : 'field'
    message = `The value for ${fieldName} already exists. Please use a different value.`

    errors.push({
      path: fieldName,
      message,
    })
  } else if (error.code === 'P2003') {
    if (error.message.includes('delete()` invocation:')) {
      message = 'Delete failed due to referenced records.'

      errors.push({
        path: '',
        message,
      })
    } else if (error.message.includes('create()` invocation:')) {
      message = 'Foreign key added failed due to referenced records.'

      errors.push({
        path: '',
        message,
      })
    } else if (error.message.includes('update()` invocation:')) {
      message = 'Failed to update the data, you cannot change foreign key'

      errors.push({
        path: '',
        message,
      })
    }
  }

  return {
    statusCode: 400,
    message,
    errorMessages: errors,
  }
}

export default handleClientError
