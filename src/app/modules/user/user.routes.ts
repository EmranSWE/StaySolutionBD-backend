import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'

const router = express.Router()

router.post('/signup', UserController.createUser)
router.post(
  '/login',
  //   validateRequest(UserValidation.CreateUserZodSchema),
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
  //   validateRequest(UserValidation.CreateUserZodSchema),
  UserController.changePassword,
)

router.patch(
  '/update/:id',
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
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getUsers,
)
router.get('/refresh-token', UserController.refreshToken)
export const UserRoutes = router
