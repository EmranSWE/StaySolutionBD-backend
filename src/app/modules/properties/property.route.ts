import express from 'express'

import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { PropertyController } from './property.controller'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
const router = express.Router()

//Post to create property
router.post(
  '/',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.single('file'),
  PropertyController.addProperty,
)
router.get('/available-property', PropertyController.availableProperty)
router.get('/booked-property/', PropertyController.bookedProperty)

router.get('/popular-category', PropertyController.popularCategory)
router.get('/', PropertyController.getProperties)
router.get('/featured-property', PropertyController.getFeaturedProperties)
router.get('/:id', PropertyController.getSingleProperty)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  FileUploadHelper.upload.single('file'),
  PropertyController.updateProperty,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  PropertyController.deleteProperty,
)

router.get('/my-property/:id/', PropertyController.singleUserProperty)

router.get(
  '/properties/:id/my-property',
  auth(ENUM_USER_ROLE.RENTER),
  PropertyController.singleRenterProperty,
)
router.get(
  '/properties/:id/owner-property',
  auth(ENUM_USER_ROLE.OWNER),
  PropertyController.singleOwnerProperty,
)

export const PropertyRoutes = router
