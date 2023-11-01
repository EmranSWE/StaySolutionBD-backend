import express from 'express'
import { ContactController } from './contact.controller'
import { ENUM_USER_ROLE } from '../../../enum/user'
import auth from '../../middleware/auth'
const router = express.Router()

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.RENTER, ENUM_USER_ROLE.ADMIN),
  ContactController.deleteContact,
)

router.post('/', ContactController.addContact)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ContactController.getAllContacts,
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ContactController.getSingleContact,
)

export const ContactRoutes = router
