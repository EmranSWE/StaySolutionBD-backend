"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const feedback__controller_1 = require("./feedback..controller");
const user_1 = require("../../../enum/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER, user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), feedback__controller_1.FeedbackController.deleteFeedback);
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER, user_1.ENUM_USER_ROLE.OWNER), feedback__controller_1.FeedbackController.addFeedback);
router.get('/', feedback__controller_1.FeedbackController.getAllFeedbacks);
router.get('/my-feedback/:id', feedback__controller_1.FeedbackController.singleUserFeedback);
router.get('/:id', feedback__controller_1.FeedbackController.getSingleFeedback);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER, user_1.ENUM_USER_ROLE.OWNER), feedback__controller_1.FeedbackController.updateFeedback);
exports.FeedbackRoutes = router;
