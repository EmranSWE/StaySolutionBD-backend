import express from 'express'

import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'

import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
import { MarketplaceController } from './marketplace.controller'
const router = express.Router()

//Post to create property
router.post(
  '/',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.single('file'),
  MarketplaceController.addMarketplace,
)
router.get('/', MarketplaceController.getMarketplaces)
router.get('/:id', MarketplaceController.getSingleMarketplace)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.single('file'),
  MarketplaceController.updateMarketplace,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  MarketplaceController.deleteMarketplace,
)
router.get('/my-marketplace/:id/', MarketplaceController.singleUserMarketplace)

export const MarketplaceRoutes = router
