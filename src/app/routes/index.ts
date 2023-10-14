import express from 'express'
import { UserRoutes } from '../modules/user/user.routes'
import { PropertyRoutes } from '../modules/properties/property.route'
import { ReviewRoutes } from '../modules/review/review.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/properties',
    route: PropertyRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
