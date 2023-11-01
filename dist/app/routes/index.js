"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const review_route_1 = require("../modules/review/review.route");
const issue_routes_1 = require("../modules/issue/issue.routes");
const safety_routes_1 = require("../modules/safety/safety.routes");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const marketplace_route_1 = require("../modules/marketplace/marketplace.route");
const booking_route_1 = require("../modules/booking/booking.route");
const property_route_1 = require("../modules/properties/property.route");
const monthlyRentPayment_route_1 = require("../modules/monthlyRentPayments/monthlyRentPayment.route");
const contact_route_1 = require("../modules/contactUs/contact.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/property',
        route: property_route_1.PropertyRoutes,
    },
    {
        path: '/reviews',
        route: review_route_1.ReviewRoutes,
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRoutes,
    },
    {
        path: '/issues',
        route: issue_routes_1.IssueRoutes,
    },
    {
        path: '/safety',
        route: safety_routes_1.SafetyRoutes,
    },
    {
        path: '/wishlist',
        route: wishlist_route_1.WishlistRoutes,
    },
    {
        path: '/marketplace',
        route: marketplace_route_1.MarketplaceRoutes,
    },
    {
        path: '/payment',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/rent',
        route: monthlyRentPayment_route_1.MonthlyRentPaymentRoutes,
    },
    {
        path: '/contact',
        route: contact_route_1.ContactRoutes,
    },
    {
        path: '/feedback',
        route: feedback_route_1.FeedbackRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
