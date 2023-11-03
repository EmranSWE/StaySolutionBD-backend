"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.get('/my-booking', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), booking_controller_1.BookingController.getSingleUserBooking);
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), booking_controller_1.BookingController.addBooking);
router.get('/', booking_controller_1.BookingController.getBookings);
router.get('/:id', booking_controller_1.BookingController.getSingleBooking);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), booking_controller_1.BookingController.updateBooking);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.RENTER), booking_controller_1.BookingController.deleteBooking);
exports.BookingRoutes = router;
