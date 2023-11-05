import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { MonthlyRentPaymentController } from './monthlyRentPayment.controller'
const router = express.Router()

// Route to create a new MonthlyRentPayment entry
router.post(
  '/monthly-rent-payments',
  auth(ENUM_USER_ROLE.RENTER),
  MonthlyRentPaymentController.addMonthlyRentPayment,
)

router.post(
  '/regular-monthly-payments',
  auth(ENUM_USER_ROLE.RENTER),
  MonthlyRentPaymentController.addRegularMonthlyRentPayment,
)
// Fetch all MonthlyRentPayment entries
router.get('/', MonthlyRentPaymentController.getMonthlyRentPayments)

router.get(
  '/current-month-rent/:id',
  MonthlyRentPaymentController.getCurrentMonthPayments,
)
// Fetch a single MonthlyRentPayment entry by its ID
router.get('/:id', MonthlyRentPaymentController.getSingleMonthlyRentPayment)
// Fetch total rent amount across all properties and renters

router.get(
  '/rents/total',
  MonthlyRentPaymentController.getTotalMonthlyRentPayment,
)
router.get(
  '/rents/month-wise-totals',
  MonthlyRentPaymentController.getMonthWiseMonthlyRentPayment,
)
// Fetch monthly total of rent amount across all properties and renters
// router.get(
//   '/rents/monthly-total',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// Fetch rent details for a specific property
router.get(
  '/properties/:propertyId/rents',
  MonthlyRentPaymentController.getSpecificPropertyTotalPayment,
)

// Fetch rent details for a specific renter
router.get(
  '/renters/my-rents',
  auth(ENUM_USER_ROLE.RENTER),
  MonthlyRentPaymentController.getSingleUserMonthlyRentPayment,
)

// // Fetch all rents that are pending
// router.get(
//   '/rents/pending',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch a summary of rent details
// router.get(
//   '/rents/summary',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch yearly overview of rents
// router.get(
//   '/rents/yearly-overview',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch MonthlyRentPayment details for a specific property
// router.get(
//   '/properties/:propertyId/monthly-rent-MonthlyRentPayments',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch MonthlyRentPayment details for a specific property and specific month/year
// router.get(
//   '/properties/:propertyId/monthly-rent-MonthlyRentPayments/:year/:month',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch MonthlyRentPayment details for a specific renter
// router.get(
//   '/users/:renterId/monthly-rent-MonthlyRentPayments',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Fetch MonthlyRentPayment details by its ID
// router.get(
//   '/monthly-rent-MonthlyRentPayments/:MonthlyRentPaymentId',
//   MonthlyRentPaymentController.getSingleMonthlyRentPayment,
// )

// // Update MonthlyRentPayment details by its ID
// router.patch(
//   '/:id',
//   auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
//   MonthlyRentPaymentController.updateMonthlyRentPayment,
// )

// // Update MonthlyRentPayment details by its ID
// router.patch(
//   '/monthly-rent-MonthlyRentPayments/:MonthlyRentPaymentId',
//   auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
//   MonthlyRentPaymentController.updateMonthlyRentPayment,
// )

// // Mark a MonthlyRentPayment entry as paid
// router.patch(
//   '/monthly-rent-MonthlyRentPayments/:MonthlyRentPaymentId/mark-as-paid',
//   auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
//   MonthlyRentPaymentController.updateMonthlyRentPayment,
// )

// // Delete a MonthlyRentPayment entry by its ID
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  MonthlyRentPaymentController.deleteMonthlyRentPayment,
)

// // Delete a MonthlyRentPayment entry by its ID
// router.delete(
//   '/monthly-rent-MonthlyRentPayments/:MonthlyRentPaymentId',
//   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
//   MonthlyRentPaymentController.deleteMonthlyRentPayment,
// )

// // Route to create MonthlyRentPayment intent using Stripe (assumed purpose based on name)
// router.post(
//   '/create-MonthlyRentPayment-intent',
//   auth(ENUM_USER_ROLE.RENTER),
//   MonthlyRentPaymentController.addMonthlyRentPaymentStripe,
// )

export const MonthlyRentPaymentRoutes = router
