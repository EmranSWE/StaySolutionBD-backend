import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { BookingController } from './booking.controller'
const router = express.Router()

router.get(
  '/my-booking',
  auth(ENUM_USER_ROLE.RENTER),
  BookingController.getSingleUserBooking,
)
router.post('/', auth(ENUM_USER_ROLE.RENTER), BookingController.addBooking)
router.get('/', BookingController.getBookings)
router.get('/:id', BookingController.getSingleBooking)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  BookingController.updateBooking,
)
router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.RENTER,
  ),
  BookingController.deleteBooking,
)

export const BookingRoutes = router
