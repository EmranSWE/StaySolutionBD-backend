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
router.get('/', PropertyController.getProperties)
router.get('/:id', PropertyController.getSingleProperty)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.single('file'),
  PropertyController.updateProperty,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  PropertyController.deleteProperty,
)
// router.delete('/user/:id/Propertys', PropertyController.singleUserProperty)
// router.get(
//   '/properties/:id/average-rating',
//   PropertyController.singlePropertiesRating,
// )

export const PropertyRoutes = router
