import { Home, Package } from 'react-feather'

export default [
  {
    header: 'Hotels'
  },
  {
    id: 'wizard',
    title: 'Hotels',
    icon: <Home size={20} />,
    action: 'read',
    resource: 'Hotels',
    navLink: '/apps/user/list'
  },
  {
    id: 'wizard-permissions',
    title: 'Permissions',
    icon: <Package size={20} />,

    navLink: '/apps/user/permission'
  }
]
