import express from 'express'
import { FeedbackController } from './feedback..controller'
import { ENUM_USER_ROLE } from '../../../enum/user'
import auth from '../../middleware/auth'
const router = express.Router()

router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.RENTER,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  FeedbackController.deleteFeedback,
)

router.post(
  '/',
  auth(ENUM_USER_ROLE.RENTER, ENUM_USER_ROLE.OWNER),
  FeedbackController.addFeedback,
)
router.get('/', FeedbackController.getAllFeedbacks)
router.get('/my-feedback/:id', FeedbackController.singleUserFeedback)
router.get('/:id', FeedbackController.getSingleFeedback)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.RENTER, ENUM_USER_ROLE.OWNER),
  FeedbackController.updateFeedback,
)

export const FeedbackRoutes = router
