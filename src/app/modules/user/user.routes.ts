import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
// import validateRequest from '../../middleware/validateRequest'
// import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-user',
  //   validateRequest(UserValidation.CreateUserZodSchema),
  UserController.createUser,
)
router.post(
  '/login',
  //   validateRequest(UserValidation.CreateUserZodSchema),
  UserController.loginUser,
)
router.get('/get-user', auth(ENUM_USER_ROLE.USER), UserController.getUsers)
router.get('/refresh-token', UserController.refreshToken)
export const UserRoutes = router
