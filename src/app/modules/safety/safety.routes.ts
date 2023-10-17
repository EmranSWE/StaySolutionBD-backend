import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { SafetyValidation } from './safety.validation'
import { SafetyController } from './safety.controller'

const router = express.Router()

//Post to create Safety
router.post(
  '/',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN),
  validateRequest(SafetyValidation.CreateSafetyZodSchema),
  SafetyController.addSafety,
)
router.get('/', SafetyController.getSafeties)
router.get('/:id', SafetyController.getSingleSafety)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(SafetyValidation.UpdateSafetyZodSchema),
  SafetyController.updateSafety,
)
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.OWNER),
  SafetyController.deleteSafety,
)

export const SafetyRoutes = router
