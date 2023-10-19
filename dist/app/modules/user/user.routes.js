'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.UserRoutes = void 0
const express_1 = __importDefault(require('express'))
const user_controller_1 = require('./user.controller')
const auth_1 = __importDefault(require('../../middleware/auth'))
const user_1 = require('../../../enum/user')
const FileUploadHelper_1 = require('../../../helpers/FileUploadHelper')
const validateRequest_1 = __importDefault(
  require('../../middleware/validateRequest'),
)
const user_validation_1 = require('./user.validation')
const router = express_1.default.Router()
router.post(
  '/signup',
  (0, validateRequest_1.default)(
    user_validation_1.UserValidation.CreateUserZodSchema,
  ),
  user_controller_1.UserController.createUser,
)
router.post(
  '/login',
  (0, validateRequest_1.default)(
    user_validation_1.UserValidation.UserLoginZodSchema,
  ),
  user_controller_1.UserController.loginUser,
)
router.post(
  '/change-password',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.RENTER,
    user_1.ENUM_USER_ROLE.OWNER,
  ),
  (0, validateRequest_1.default)(
    user_validation_1.UserValidation.UserChangePasswordZodSchema,
  ),
  user_controller_1.UserController.changePassword,
)
router.patch(
  '/update-profile/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.RENTER,
    user_1.ENUM_USER_ROLE.OWNER,
  ),
  FileUploadHelper_1.FileUploadHelper.upload.single('file'),
  user_controller_1.UserController.updateUser,
)
router.get(
  '/get-user',
  (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN),
  user_controller_1.UserController.getUsers,
)
router.delete(
  '/:id',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.RENTER,
    user_1.ENUM_USER_ROLE.OWNER,
  ),
  user_controller_1.UserController.deleteUser,
)
router.get('/refresh-token', user_controller_1.UserController.refreshToken)
exports.UserRoutes = router