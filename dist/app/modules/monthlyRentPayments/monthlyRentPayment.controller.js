'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.MonthlyRentPaymentController = void 0
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'))
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'))
const http_status_1 = __importDefault(require('http-status'))
const pick_1 = __importDefault(require('../../../shared/pick'))
const monthlyRentPayment_service_1 = require('./monthlyRentPayment.service')
const monthlyRentPayment_constant_1 = require('./monthlyRentPayment.constant')
const addMonthlyRentPayment = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
      body: req.body,
      user: req.user,
    }
    const result =
      yield monthlyRentPayment_service_1.MonthlyRentPaymentService.addMonthlyRentPayment(
        payload,
      )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'MonthlyRentPayment added successfully! ',
      data: result,
    })
  }),
)
const getMonthlyRentPayments = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      monthlyRentPayment_constant_1.MonthlyRentPaymentFilterableFields,
    )
    const options = (0, pick_1.default)(
      req.query,
      monthlyRentPayment_constant_1.MonthlyRentPaymentQueryOption,
    )
    const result =
      yield monthlyRentPayment_service_1.MonthlyRentPaymentService.getMonthlyRentPayments(
        filters,
        options,
      )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'MonthlyRentPayments fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
// Getting a single MonthlyRentPayment
const getSingleMonthlyRentPayment = (0, catchAsync_1.default)(
  (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const MonthlyRentPaymentId = req.params.id
      const result =
        yield monthlyRentPayment_service_1.MonthlyRentPaymentService.getSingleMonthlyRentPayment(
          MonthlyRentPaymentId,
        )
      ;(0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Rent fetched successfully',
        data: result,
      })
    }),
)
// Getting a total MonthlyRentPayment
const getTotalMonthlyRentPayment = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result =
      yield monthlyRentPayment_service_1.MonthlyRentPaymentService.getTotalMonthlyRentPayment()
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Total Rent fetched successfully',
      data: result,
    })
  }),
)
// Fetch specific a total rent
const getSpecificPropertyTotalPayment = (0, catchAsync_1.default)(
  (req, res, next) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const propertyId = req.params.propertyId
      const result =
        yield monthlyRentPayment_service_1.MonthlyRentPaymentService.getSpecificPropertyTotalPayment(
          propertyId,
        )
      ;(0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Total Rent specific property fetched successfully',
        data: result,
      })
    }),
)
//Updating a single MonthlyRentPayment
// const updateMonthlyRentPayment = catchAsync(
//   async (req, res: Response, next: NextFunction) => {
//     if (req.body.data) {
//       req.body = JSON.parse(req.body.data)
//     }
//     const payload = {
//       body: req.body,
//       file: req.file,
//       params: req.params,
//       user: req.user,
//     }
//     const result =
//       await MonthlyRentPaymentService.updateMonthlyRentPayment(payload)
//     res.status(200).json({
//       success: true,
//       message: 'MonthlyRentPayment updated successfully',
//       data: result,
//     })
//   },
// )
// //Delete a single MonthlyRentPayment
// const deleteMonthlyRentPayment = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const MonthlyRentPaymentId = req.params.id
//     const ids = req.user
//     const result = await MonthlyRentPaymentService.deleteMonthlyRentPayment(
//       ids,
//       MonthlyRentPaymentId,
//     )
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' MonthlyRentPayment deleted Successfully',
//       data: result,
//     })
//   },
// )
exports.MonthlyRentPaymentController = {
  addMonthlyRentPayment,
  getMonthlyRentPayments,
  getSingleMonthlyRentPayment,
  getTotalMonthlyRentPayment,
  getSpecificPropertyTotalPayment,
  // updateMonthlyRentPayment,
  // deleteMonthlyRentPayment,
  // singleUserMonthlyRentPayment,
  // singlePropertiesRating,
}