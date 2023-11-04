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
exports.PropertyController = void 0
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'))
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'))
const http_status_1 = __importDefault(require('http-status'))
const pick_1 = __importDefault(require('../../../shared/pick'))
const property_constant_1 = require('./property.constant')
const property_service_1 = require('./property.service')
const addProperty = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }
    const payload = {
      body: req.body,
      file: req.file,
      user: req.user,
    }
    const result = yield property_service_1.PropertyService.addProperty(payload)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Property added successfully! ',
      data: result,
    })
  }),
)
const getProperties = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      property_constant_1.propertyFilterableFields,
    )
    const options = (0, pick_1.default)(
      req.query,
      property_constant_1.IPropertyQueryOption,
    )
    const result = yield property_service_1.PropertyService.getProperties(
      filters,
      options,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Properties fetched successfully',
      meta: result.meta,
      data: result.data,
    })
  }),
)
// Getting a single Property
const getSingleProperty = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const PropertyId = req.params.id
    const result =
      yield property_service_1.PropertyService.getSingleProperty(PropertyId)
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Single Properties fetched successfully',
      data: result,
    })
  }),
)
//Updating a single Property
const updateProperty = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data)
    }
    const payload = {
      body: req.body,
      file: req.file,
      params: req.params,
      user: req.user,
    }
    const result =
      yield property_service_1.PropertyService.updateProperty(payload)
    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: result,
    })
  }),
)
//Delete a single Property
const deleteProperty = (0, catchAsync_1.default)((req, res, next) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const PropertyId = req.params.id
    const ids = req.user
    const result = yield property_service_1.PropertyService.deleteProperty(
      ids,
      PropertyId,
    )
    ;(0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: ' Property deleted Successfully',
      data: result,
    })
  }),
)
// //Get a single Property
// const singleUserProperty = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id
//     const result = await PropertyService.singleUserProperty(userId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: ' Get a single user all Property',
//       data: result,
//     })
//   },
// )
// //Get a single Property
// const singlePropertiesRating = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const propertyId = req.params.id
//     const result = await PropertyService.singlePropertiesRating(propertyId)
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Get a single property average rating',
//       data: result,
//     })
//   },
// )
exports.PropertyController = {
  addProperty,
  getProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  // singleUserProperty,
  // singlePropertiesRating,
}
