import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import { WishlistController } from './wishlist.controller'
import { FileUploadHelper } from '../../../helpers/FileUploadHelper'
const router = express.Router()

router.post('/', auth(ENUM_USER_ROLE.RENTER), WishlistController.addWishlist)
router.get('/', WishlistController.getWishlist)
router.get('/:id', WishlistController.getSingleWishlist)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.OWNER),
  FileUploadHelper.upload.single('file'),
  WishlistController.updateWishlist,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  WishlistController.deleteWishlist,
)

export const WishlistRoutes = router
