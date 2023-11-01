import express from 'express'
import { ReviewController } from './review.controller'
import { ENUM_USER_ROLE } from '../../../enum/user'
import auth from '../../middleware/auth'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
const router = express.Router()

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.RENTER, ENUM_USER_ROLE.ADMIN),
  ReviewController.deleteReview,
)

router.post(
  '/',
  auth(ENUM_USER_ROLE.RENTER),
  FileUploadHelper.upload.single('file'),
  ReviewController.addReview,
)
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.RENTER,
  ),
  ReviewController.getAllReviews,
)
router.get('/:id', ReviewController.getSingleReview)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.RENTER),
  FileUploadHelper.upload.single('file'),
  ReviewController.updateReview,
)
router.get('/user/:id/reviews', ReviewController.singleUserReview)
router.get(
  '/properties/:id/average-rating',
  ReviewController.singlePropertiesRating,
)

export const ReviewRoutes = router
