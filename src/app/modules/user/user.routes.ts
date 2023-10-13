import express from 'express'
import { UserController } from './user.controller'
// import validateRequest from '../../middleware/validateRequest'
// import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-user',
  //   validateRequest(UserValidation.CreateUserZodSchema),
  UserController.createUser,
)

router.get(
  '/get-user',

  UserController.getUsers,
)
export const UserRoutes = router
