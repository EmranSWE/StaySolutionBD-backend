"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = express_1.default.Router();
//Post to create Payment
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), (0, validateRequest_1.default)(payment_validation_1.PaymentValidation.CreatePaymentZodSchema), payment_controller_1.PaymentController.addPayment);
router.get('/', payment_controller_1.PaymentController.getPayments);
router.get('/rent-management', payment_controller_1.PaymentController.getAllRent);
router.get('/:id', payment_controller_1.PaymentController.getSinglePayment);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), payment_controller_1.PaymentController.updatePayment);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.RENTER), payment_controller_1.PaymentController.deletePayment);
router.post('/create-payment-intent', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), payment_controller_1.PaymentController.addPaymentStripe);
exports.PaymentRoutes = router;
