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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
/**
 * Authentication Middleware to authenticate the user based on JWT and roles.
 *
 * @param {...requiredRoles} array of required roles to access the api controller and service
 * @returns Express middleware Next() function to the next controller
 */
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for the current of the authorization token from headers
    const token = req.headers.authorization;
    //If not getting token, then throw an API error
    if (!token) {
        return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized'));
    }
    try {
        // Verify the token and extract current user information
        const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
        req.user = verifiedUser;
        // Check if user's role is among the required roles, if specified
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            return next(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden access'));
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = auth;
