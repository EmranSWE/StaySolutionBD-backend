"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const marketplace_controller_1 = require("./marketplace.controller");
const router = express_1.default.Router();
//Post to create property
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), FileUploadHelper_1.FileUploadHelper.upload.single('file'), marketplace_controller_1.MarketplaceController.addMarketplace);
router.get('/', marketplace_controller_1.MarketplaceController.getMarketplaces);
router.get('/:id', marketplace_controller_1.MarketplaceController.getSingleMarketplace);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), FileUploadHelper_1.FileUploadHelper.upload.single('file'), marketplace_controller_1.MarketplaceController.updateMarketplace);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), marketplace_controller_1.MarketplaceController.deleteMarketplace);
router.get('/my-marketplace/:id/', marketplace_controller_1.MarketplaceController.singleUserMarketplace);
exports.MarketplaceRoutes = router;
