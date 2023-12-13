"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_1 = require("../../../enum/user");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const issue_validation_1 = require("./issue.validation");
const issue_controller_1 = require("./issue.controller");
const router = express_1.default.Router();
//Post to create property
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), (0, validateRequest_1.default)(issue_validation_1.IssueValidation.CreateIssueZodSchema), issue_controller_1.IssueController.addIssue);
router.get('/', issue_controller_1.IssueController.getIssues);
router.get('/single-renter-issue', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), issue_controller_1.IssueController.getSingleRenterIssue);
router.get('/:id', issue_controller_1.IssueController.getSingleIssue);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(issue_validation_1.IssueValidation.UpdateIssueZodSchema), issue_controller_1.IssueController.updateIssue);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.RENTER), issue_controller_1.IssueController.deleteIssue);
exports.IssueRoutes = router;
