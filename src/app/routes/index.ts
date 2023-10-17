import express from 'express'
import { UserRoutes } from '../modules/user/user.routes'
import { PropertyRoutes } from '../modules/properties/property.route'
import { ReviewRoutes } from '../modules/review/review.route'
import { BookingRoutes } from '../modules/booking/booking.route'
import { IssueRoutes } from '../modules/issue/issue.routes'
import { SafetyRoutes } from '../modules/safety/safety.routes'
import { WishlistRoutes } from '../modules/wishlist/wishlist.route'
import { MarketplaceRoutes } from '../modules/marketplace/marketplace.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/property',
    route: PropertyRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/issues',
    route: IssueRoutes,
  },
  {
    path: '/safety',
    route: SafetyRoutes,
  },
  {
    path: '/wishlist',
    route: WishlistRoutes,
  },
  {
    path: '/marketplace',
    route: MarketplaceRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
