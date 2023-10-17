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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecord = exports.getUniqueRecord = void 0;
const getUniqueRecord = (model, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model.findUnique({
        where: {
            id: id,
        },
    });
    return result;
});
exports.getUniqueRecord = getUniqueRecord;
const updateRecord = (model, where, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model.update({
        where: where,
        data: data,
    });
    return result;
});
exports.updateRecord = updateRecord;
