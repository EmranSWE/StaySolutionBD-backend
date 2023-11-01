import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { PaymentController } from './payment.controller'
import { PaymentValidation } from './payment.validation'
import validateRequest from '../../middleware/validateRequest'
const router = express.Router()

//Post to create Payment
router.post(
  '/',
  auth(ENUM_USER_ROLE.RENTER),
  validateRequest(PaymentValidation.CreatePaymentZodSchema),
  PaymentController.addPayment,
)
router.get('/', PaymentController.getPayments)
router.get('/rent-management', PaymentController.getAllRent)
router.get('/:id', PaymentController.getSinglePayment)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  PaymentController.updatePayment,
)
router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.OWNER,
    ENUM_USER_ROLE.RENTER,
  ),
  PaymentController.deletePayment,
)

router.post(
  '/create-payment-intent',
  auth(ENUM_USER_ROLE.RENTER),
  PaymentController.addPaymentStripe,
)

export const PaymentRoutes = router
