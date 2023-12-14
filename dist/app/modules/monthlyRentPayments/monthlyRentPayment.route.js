"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyRentPaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const monthlyRentPayment_controller_1 = require("./monthlyRentPayment.controller");
const router = express_1.default.Router();
router.post('/monthly-rent-payments', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.addMonthlyRentPayment);
router.post('/regular-monthly-payments', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.addRegularMonthlyRentPayment);
router.get('/', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getMonthlyRentPayments);
router.get('/current-month-rent/:id', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getCurrentMonthPayments);
// Fetch a single MonthlyRentPayment entry by its ID
router.get('/:id', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getSingleMonthlyRentPayment);
// Fetch total rent amount across all properties and renters
router.get('/rents/total', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getTotalMonthlyRentPayment);
router.get('/rents/month-wise-totals', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), monthlyRentPayment_controller_1.MonthlyRentPaymentController.getMonthWiseMonthlyRentPayment);
router.get('/rents/flat-status', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), monthlyRentPayment_controller_1.MonthlyRentPaymentController.getFlatStatus);
router.get('/properties/:propertyId/rents', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getSpecificPropertyTotalPayment);
router.get('/properties/:propertyId/details', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getSpecificPropertyPaymentDetails);
// Fetch rent details for a specific renter
router.get('/renters/my-rents', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.getSingleUserMonthlyRentPayment);
// Fetch rent details for a specific renter
router.get('/properties/all-flat', monthlyRentPayment_controller_1.MonthlyRentPaymentController.getAllFlat);
// This month total rents
router.get('/rents/this-month', monthlyRentPayment_controller_1.MonthlyRentPaymentController.thisMonthTotalRents);
// This month total rents
router.get('/rents/my-total-rents/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.singleUserTotalRentAmount);
// This month total rents
router.get('/rents/my-total-earn/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.singleOwnerTotalEarn);
// My total apartment
router.get('/rents/my-total-property/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.singleOwnerTotalProperty);
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
// Delete a MonthlyRentPayment entry by its ID
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), monthlyRentPayment_controller_1.MonthlyRentPaymentController.deleteMonthlyRentPayment);
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
exports.MonthlyRentPaymentRoutes = router;
