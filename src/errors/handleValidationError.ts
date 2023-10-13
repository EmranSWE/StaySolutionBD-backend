import { Prisma } from '@prisma/client'
import { IGenericErrorResponse } from '../interface/common'
import { logger } from '../shared/logger'

// const handleValidationError = (
//   error: Prisma.PrismaClientValidationError,
// ): IGenericErrorResponse => {
//   logger.info(error)
//   const errors = [
//     {
//       path: 'Dur hoooo🧑‍💻🧑‍💻🧑‍💻🧑‍💻',
//       message: error.message,
//     },
//   ]
//   const statusCode = 400
//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorMessages: errors,
//   }
// }

const handleValidationError = (
  error: Prisma.PrismaClientValidationError,
): IGenericErrorResponse => {
  logger.info(error)

  // Extract the relevant error message for invalid values
  const errorMessageMatch = error.message.match(
    /Invalid value for argument `(.*?)`. (Expected .*?\.)/,
  )

  // Extract the relevant error message for missing arguments
  const errorMessageMatchOne = error.message.match(
    /Argument `(.*?)` is missing./,
  )

  // Extract the relevant error message for missing arguments
  const errorMessageMatchTwo = error.message.match(
    /Argument `(.*?)`: Invalid value provided./,
  )
  let errorMessage = ''
  let errorPath = 'Unknown Field'

  // Handle the case where the value is invalid
  if (errorMessageMatch && errorMessageMatch.length >= 3) {
    errorPath = errorMessageMatch[1]
    errorMessage = errorMessageMatch[0] // Full match gives the entire error message
  }

  // Handle the case where the argument is missing
  else if (errorMessageMatchOne && errorMessageMatchOne.length >= 2) {
    errorPath = errorMessageMatchOne[1]
    errorMessage = errorMessageMatchOne[0] // Full match gives the entire error message
  }

  // Handle the case where the argument is missing
  else if (errorMessageMatchTwo && errorMessageMatchTwo.length >= 2) {
    errorPath = errorMessageMatchTwo[1]
    errorMessage =
      'You entered invalid type value for ' + errorMessageMatchTwo[0] // Full match gives the entire error message
  }

  const errors = [
    {
      path: errorPath,
      message: errorMessage,
    },
  ]

  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorMessages: errors,
  }
}

export default handleValidationError
