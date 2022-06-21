import { Mail, MessageSquare, CheckSquare, Calendar, FileText, Circle, ShoppingCart, Package, User } from 'react-feather'

export default [
  {
    header: 'Users & Permissions'
  },
  {
    id: 'users',
    title: 'Users & Permissions',
    icon: <User size={20} />,
    action: 'manage',
    resource: 'Permissions',
    navLink: '/apps/user/permission'
  }
]
