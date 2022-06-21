import { Grid } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Grid size={20} />,
    badge: 'light-warning',
    // badgeText: '2',
    action: 'read',
    resource: 'Dashboards',
    /* children: [ */
      // {
      //   id: 'analyticsDash',
      //   title: 'Analytics',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/analytics',
      //   action: 'read',
      //   resource: 'Dashboards'
      // },
      /* {
        id: 'eCommerceDash',
        title: 'Statistics',
        icon: <Circle size={12} />, */
        navLink: '/dashboard/ecommerce'
        /* action: 'read', */
        /* resource: 'Dashboards'
      }
    ] */
  }
]
