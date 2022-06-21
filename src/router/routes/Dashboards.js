import { lazy } from 'react'

const DashboardRoutes = [
  // Dashboards
  {
    path: '/dashboard/analytics',
    component: lazy(() => import('../../views/dashboard/analytics')),
    meta: {
      action: 'read',
      resource: 'Dashboards'
    }
  },
  {
    path: '/dashboard/ecommerce',
    component: lazy(() => import('../../views/dashboard/ecommerce')),
    exact: true,
    meta: {
      action: 'read',
      resource: 'Dashboards'
    }
  }
]

export default DashboardRoutes
