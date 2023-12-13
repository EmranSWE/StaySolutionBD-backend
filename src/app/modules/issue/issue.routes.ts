import express from 'express'
import auth from '../../middleware/auth'
import { ENUM_USER_ROLE } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { IssueValidation } from './issue.validation'
import { IssueController } from './issue.controller'
const router = express.Router()

//Post to create property
router.post(
  '/',
  auth(ENUM_USER_ROLE.RENTER),
  validateRequest(IssueValidation.CreateIssueZodSchema),
  IssueController.addIssue,
)

router.get('/', IssueController.getIssues)
router.get(
  '/single-renter-issue',
  auth(ENUM_USER_ROLE.RENTER),
  IssueController.getSingleRenterIssue,
)

router.get('/:id', IssueController.getSingleIssue)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.RENTER, ENUM_USER_ROLE.ADMIN),
  validateRequest(IssueValidation.UpdateIssueZodSchema),
  IssueController.updateIssue,
)
router.delete('/:id', auth(ENUM_USER_ROLE.RENTER), IssueController.deleteIssue)

export const IssueRoutes = router
