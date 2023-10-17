"use strict";
// const pick = <T extends Record<string, unknown>, k extends keyof T>(
//   obj: T,
//   keys: k[],
// ): Partial<T> => {
//   const finalObj: Partial<T> = {}
Object.defineProperty(exports, "__esModule", { value: true });
//   for (const key of keys) {
//     if (obj && Object.hasOwnProperty.call(obj, key)) {
//       finalObj[key] = obj[key]
//     }
//   }
//   return finalObj
// }
// export default pick
/**
 * Picks specific keys from an object.
 *
 * @param obj - The source object from which the keys are to be picked.
 * @param keys - An array of keys that need to be picked from the source object.
 * @returns A new object containing only the picked keys.
 */
const pick = (obj, keys) => {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
};
exports.default = pick;
