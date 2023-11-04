import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import validateRequest from '../../middleware/validateRequest'
import { UserValidation } from './user.validation'

const router = express.Router()

router.post(
  '/signup',
  validateRequest(UserValidation.CreateUserZodSchema),
  UserController.createUser,
)
router.post(
  '/login',
  validateRequest(UserValidation.UserLoginZodSchema),
  UserController.loginUser,
)

router.post(
  '/change-password',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.RENTER,
    ENUM_USER_ROLE.OWNER,
  ),
  validateRequest(UserValidation.UserChangePasswordZodSchema),
  UserController.changePassword,
)

router.patch(
  '/update-profile/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.RENTER,
    ENUM_USER_ROLE.OWNER,
  ),

  FileUploadHelper.upload.single('file'),
  UserController.updateUser,
)
router.get(
  '/get-user',

  UserController.getUsers,
)
router.get(
  '/get-user/my-profile',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.RENTER,
  ),
  UserController.getSingleUser,
)
router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.RENTER,
    ENUM_USER_ROLE.OWNER,
  ),
  UserController.deleteUser,
)
router.get('/refresh-token', UserController.refreshToken)
export const UserRoutes = router
