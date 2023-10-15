import express from 'express'
import { PropertyController } from './property.controller'
// import auth from '../../middleware/auth'
// import { ENUM_USER_ROLE } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { PropertyValidation } from './property.validation'
import { ENUM_USER_ROLE } from '../../../enum/user'
import auth from '../../middleware/auth'
const router = express.Router()

router.post(
  '/add-property',
  validateRequest(PropertyValidation.addPropertyZodSchema),
  PropertyController.addProperty,
)
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.USER),
//   PropertyController.deleteProperty,
// )

// router.post(
//   '/',
//   validateRequest(PropertyValidation.addPropertyZodSchema),
//   auth(ENUM_USER_ROLE.USER),
//   PropertyController.addProperty,
// )
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  PropertyController.getAllProperties,
)
// router.get('/:id', PropertyController.getSingleProperty)

// router.patch(
//   '/:id',
//   validateRequest(PropertyValidation.updatePropertyZodSchema),
//   auth(ENUM_USER_ROLE.USER),
//   PropertyController.updateProperty,
// )
// router.get('/user/:id/Propertys', PropertyController.singleUserProperty)
// router.get(
//   '/properties/:id/average-rating',
//   PropertyController.singlePropertiesRating,
// )
export const PropertyRoutes = router
