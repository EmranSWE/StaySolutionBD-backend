import { NextFunction, Request, Response } from 'express'
import ApiError from '../../errors/ApiError'
import httpStatus from 'http-status'
import { jwtHelpers } from '../../helpers/jwtHelpers'
import config from '../../config'
import { Secret } from 'jsonwebtoken'

/**
 * Authentication Middleware to authenticate the user based on JWT and roles.
 *
 * @param {...requiredRoles} array of required roles to access the api controller and service
 * @returns Express middleware Next() function to the next controller
 */
const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Check for the current of the authorization token from headers
    const token = req.headers.authorization
    //If not getting token, then throw an API error
    if (!token) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized'),
      )
    }

    try {
      // Verify the token and extract current user information
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.refresh_secret as Secret,
      )

      req.user = verifiedUser
      // Check if user's role is among the required roles, if specified
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden access'))
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
