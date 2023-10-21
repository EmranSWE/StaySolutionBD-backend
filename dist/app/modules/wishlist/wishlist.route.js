"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const wishlist_controller_1 = require("./wishlist.controller");
const FileUploadHelper_1 = require("../../../helpers/FileUploadHelper");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), wishlist_controller_1.WishlistController.addWishlist);
router.get('/', wishlist_controller_1.WishlistController.getWishlist);
router.get('/:id', wishlist_controller_1.WishlistController.getSingleWishlist);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER), FileUploadHelper_1.FileUploadHelper.upload.single('file'), wishlist_controller_1.WishlistController.updateWishlist);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), wishlist_controller_1.WishlistController.deleteWishlist);
exports.WishlistRoutes = router;
