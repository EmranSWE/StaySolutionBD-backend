import express from 'express'
import { propertyController } from './property.controller'
const router = express.Router()

router.post('/create-properties', propertyController.createProperties)

export const PropertyRoutes = router
