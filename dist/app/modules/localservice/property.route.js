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
router.get('/', property_controller_1.PropertyController.getProperties);
router.get('/:id', property_controller_1.PropertyController.getSingleProperty);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), FileUploadHelper_1.FileUploadHelper.upload.single('file'), property_controller_1.PropertyController.updateProperty);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), property_controller_1.PropertyController.deleteProperty);
// router.delete('/user/:id/Propertys', PropertyController.singleUserProperty)
// router.get(
//   '/properties/:id/average-rating',
//   PropertyController.singlePropertiesRating,
// )
exports.PropertyRoutes = router;
