"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("./contact.controller");
const user_1 = require("../../../enum/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER, user_1.ENUM_USER_ROLE.ADMIN), contact_controller_1.ContactController.deleteContact);
router.post('/', contact_controller_1.ContactController.addContact);
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), contact_controller_1.ContactController.getAllContacts);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN), contact_controller_1.ContactController.getSingleContact);
exports.ContactRoutes = router;
