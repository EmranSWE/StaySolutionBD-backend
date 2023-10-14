import express from 'express'
import { ReviewController } from './review.controller'
import validateRequest from '../../middleware/validateRequest'
import { ReviewValidation } from './review.validation'
import { ENUM_USER_ROLE } from '../../../enum/user'
import auth from '../../middleware/auth'
const router = express.Router()

router.delete('/:id', auth(ENUM_USER_ROLE.USER), ReviewController.deleteReview)

router.post(
  '/',
  validateRequest(ReviewValidation.addReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  ReviewController.addReview,
)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  ReviewController.getAllReviews,
)
router.get('/:id', ReviewController.getSingleReview)

router.patch(
  '/:id',
  validateRequest(ReviewValidation.updateReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  ReviewController.updateReview,
)
router.get('/user/:id/reviews', ReviewController.singleUserReview)
router.get(
  '/properties/:id/average-rating',
  ReviewController.singlePropertiesRating,
)

export const ReviewRoutes = router
