"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const property_controller_1 = require("./property.controller");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const router = express_1.default.Router();
//Post to create property
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), FileUploadHelper_1.FileUploadHelper.upload.single('file'), property_controller_1.PropertyController.addProperty);
router.get('/available-property', property_controller_1.PropertyController.availableProperty);
router.get('/booked-property/', property_controller_1.PropertyController.bookedProperty);
router.get('/popular-category', property_controller_1.PropertyController.popularCategory);
router.get('/', property_controller_1.PropertyController.getProperties);
router.get('/featured-property', property_controller_1.PropertyController.getFeaturedProperties);
router.get('/:id', property_controller_1.PropertyController.getSingleProperty);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), FileUploadHelper_1.FileUploadHelper.upload.single('file'), property_controller_1.PropertyController.updateProperty);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), property_controller_1.PropertyController.deleteProperty);
router.get('/my-property/:id/', property_controller_1.PropertyController.singleUserProperty);
router.get('/properties/:id/my-property', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), property_controller_1.PropertyController.singleRenterProperty);
router.get('/properties/:id/owner-property', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), property_controller_1.PropertyController.singleOwnerProperty);
exports.PropertyRoutes = router;
