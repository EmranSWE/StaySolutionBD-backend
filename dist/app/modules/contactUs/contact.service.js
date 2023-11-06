"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.ContactService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../utils/utils");
const addContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contactUs.create({
        data: payload,
    });
    // Return the created Contact data
    return { success: true, data: result };
});
const getAllContacts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contactUs.findMany({});
    return { success: true, data: result };
});
const getSingleContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const model = prisma_1.default.contactUs;
    const result = (0, utils_1.getUniqueRecord)(model, payload);
    return result;
});
const deleteContact = (deletedId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contactUs.delete({
        where: {
            id: deletedId,
        },
    });
    return result;
});
exports.ContactService = {
    addContact,
    getAllContacts,
    getSingleContact,
    deleteContact,
};
