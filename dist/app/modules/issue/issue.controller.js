"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const issue_service_1 = require("./issue.service");
const issue_constant_1 = require("./issue.constant");
const addIssue = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        user: req.user,
    };
    const result = yield issue_service_1.IssueService.addIssue(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Issue added successfully! ',
        data: result,
    });
}));
const getIssues = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, issue_constant_1.IIssueFilterableFields);
    const options = (0, pick_1.default)(req.query, issue_constant_1.IIIssueQueryOption);
    const result = yield issue_service_1.IssueService.getProperties(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Properties fetched successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Getting a single Issue
const getSingleIssue = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const IssueId = req.params.id;
    const result = yield issue_service_1.IssueService.getSingleIssue(IssueId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
// Getting a single Issue
const getSingleRenterIssue = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const UserId = req.user;
    const result = yield issue_service_1.IssueService.getSingleRenterIssue(UserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Properties fetched successfully',
        data: result,
    });
}));
//Updating a single Issue
const updateIssue = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        body: req.body,
        params: req.params,
        user: req.user,
    };
    const result = yield issue_service_1.IssueService.updateIssue(payload);
    res.status(200).json({
        success: true,
        message: 'Issue updated successfully',
        data: result,
    });
}));
//Delete a single Issue
const deleteIssue = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const IssueId = req.params.id;
    const ids = req.user;
    const result = yield issue_service_1.IssueService.deleteIssue(ids, IssueId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: ' Issue deleted Successfully',
        data: result,
    });
}));
exports.IssueController = {
    addIssue,
    getIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
    getSingleRenterIssue,
    // singleUserIssue,
    // singlePropertiesRating,
};
