/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ZodError, ZodIssue } from 'zod'
import { IGenericErrorResponse } from '../interface/common'
import { IGenericErrorMessage } from '../interface/error'
const handleZodError = (error: ZodError): IGenericErrorResponse => {
  //@ts-ignore
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    }
  })

  const statusCode = 400

  return {
    statusCode,
    message: 'Zod Validation Error',
    errorMessages: errors,
  }
}

export default handleZodError
