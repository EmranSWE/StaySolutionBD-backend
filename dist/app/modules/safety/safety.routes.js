"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const safety_validation_1 = require("./safety.validation");
const safety_controller_1 = require("./safety.controller");
const router = express_1.default.Router();
//Post to create Safety
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.OWNER, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(safety_validation_1.SafetyValidation.CreateSafetyZodSchema), safety_controller_1.SafetyController.addSafety);
router.get('/', safety_controller_1.SafetyController.getSafeties);
router.get('/:id', safety_controller_1.SafetyController.getSingleSafety);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(safety_validation_1.SafetyValidation.UpdateSafetyZodSchema), safety_controller_1.SafetyController.updateSafety);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.OWNER), safety_controller_1.SafetyController.deleteSafety);
exports.SafetyRoutes = router;
