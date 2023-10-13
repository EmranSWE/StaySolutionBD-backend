import { Prisma } from '@prisma/client'
import { IGenericErrorResponse } from '../interface/common'

const errorPatterns: { [key: string]: RegExp } = {
  invalidValue: /Invalid value for argument `(.*?)`. (Expected .*?\.)/,
  missingArgument: /Argument `(.*?)` is missing./,
  invalidArgumentValue: /Argument `(.*?)`: Invalid value provided./,
}

/**
 * Build error detail from the matched error.
 */
const buildErrorDetail = (
  errorType: string,
  match: RegExpMatchArray,
): { path: string; message: string } => {
  switch (errorType) {
    case 'invalidValue':
    case 'missingArgument':
      return { path: match[1], message: match[0] }
    case 'invalidArgumentValue':
      return {
        path: match[1],
        message: `You entered an invalid type value for ${match[0]}`,
      }
    default:
      return { path: 'Unknown Field', message: 'An unknown error occurred' }
  }
}

/**
 * Extracts error details from the provided Prisma validation error.
 * @param error - The Prisma validation error.
 * @returns A formatted error response.
 */
const handleValidationError = (
  error: Prisma.PrismaClientValidationError,
): IGenericErrorResponse => {
  let errorDetail = {
    path: 'Unknown Field',
    message: 'An unknown error occurred',
  }

  for (const [errorType, pattern] of Object.entries(errorPatterns)) {
    const match = error.message.match(pattern)
    if (match) {
      errorDetail = buildErrorDetail(errorType, match)
      break
    }
  }

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: [errorDetail],
  }
}

export default handleValidationError
