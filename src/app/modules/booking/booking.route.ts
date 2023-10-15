import express, { NextFunction, Request, Response } from 'express'
// import { BookingController } from './Booking.controller'
// import auth from '../../middleware/auth'
// import { ENUM_USER_ROLE } from '../../../enum/user'

// import { BookingValidation } from './Booking.validation'

import { BookingController } from './booking.controller'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
const router = express.Router()

router.post(
  '/add-Booking',
  FileUploadHelper.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return BookingController.addBooking(req, res, next)
  },
)
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.USER),
//   BookingController.deleteBooking,
// )

// router.post(
//   '/',
//   validateRequest(BookingValidation.addBookingZodSchema),
//   auth(ENUM_USER_ROLE.USER),
//   BookingController.addBooking,
// )
// router.get(
//   '/',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
//   BookingController.getAllProperties,
// )
// router.get('/:id', BookingController.getSingleBooking)

// router.patch(
//   '/:id',
//   validateRequest(BookingValidation.updateBookingZodSchema),
//   auth(ENUM_USER_ROLE.USER),
//   BookingController.updateBooking,
// )
// router.get('/user/:id/Bookings', BookingController.singleUserBooking)
// router.get(
//   '/properties/:id/average-rating',
//   BookingController.singlePropertiesRating,
// )
export const BookingRoutes = router
