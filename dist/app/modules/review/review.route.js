'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ReviewRoutes = void 0
const express_1 = __importDefault(require('express'))
const review_controller_1 = require('./review.controller')
const user_1 = require('../../../enum/user')
const auth_1 = __importDefault(require('../../middleware/auth'))
const FileUploadHelper_1 = require('../../../helpers/FileUploadHelper')
const router = express_1.default.Router()
router.delete(
  '/:id',
  (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER),
  review_controller_1.ReviewController.deleteReview,
)
router.post(
  '/',
  (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER),
  FileUploadHelper_1.FileUploadHelper.upload.single('file'),
  review_controller_1.ReviewController.addReview,
)
router.get(
  '/',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.SUPER_ADMIN,
    user_1.ENUM_USER_ROLE.OWNER,
    user_1.ENUM_USER_ROLE.RENTER,
  ),
  review_controller_1.ReviewController.getAllReviews,
)
router.get('/:id', review_controller_1.ReviewController.getSingleReview)
router.patch(
  '/:id',
  (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER),
  FileUploadHelper_1.FileUploadHelper.upload.single('file'),
  review_controller_1.ReviewController.updateReview,
)
router.get(
  '/user/:id/reviews',
  review_controller_1.ReviewController.singleUserReview,
)
router.get(
  '/properties/:id/average-rating',
  review_controller_1.ReviewController.singlePropertiesRating,
)
exports.ReviewRoutes = router