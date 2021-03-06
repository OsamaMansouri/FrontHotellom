import { ShoppingCart, Package, FileText, Columns, Users, Circle, ShoppingBag, Award, Settings, Type } from 'react-feather'

export default [
  {
    header: 'Room Service',
    action: 'manage',
    resource: 'Categories'
  },
  {
    id: 'commandes',
    title: 'Commandes',
    action: 'read',
    resource: 'Commandes',
    navLink: '/apps/commandes/list',
    icon: <ShoppingBag size={20} />
  },
  {
    id: 'offers',
    title: 'Promotions',
    action: 'read',
    resource: 'Offers',
    navLink: '/apps/offers/list',
    icon: <Award size={20} />
  },
  {
    id: 'demmands',
    title: 'Requests',
    action: 'read',
    resource: 'Demmands',
    navLink: '/apps/demmands/list',
    icon: <ShoppingBag size={20} />
  },
  {
    id: 'clientsdemmands',
    title: 'Clients requests',
    action: 'manage',
    resource: 'ClientsDemmands',
    navLink: '/apps/demmands/listRequests',
    icon: <ShoppingBag size={20} />
  },
  {
    id: 'categories',
    title: 'Categories',
    action: 'manage',
    resource: 'Categories',
    navLink: '/apps/categories/list',
    icon: <Columns size={20} />
  },
  {
    id: 'articles',
    title: 'Articles',
    icon: <Package size={20} />,
    action: 'manage',
    resource: 'Articles',
    navLink: '/apps/articles/list'
  },
  /* {
    id: 'prolongations',
    title: 'Prolongations',
    icon: <FileText size={20} />,
    action: 'read',
    resource: 'Prolongations',
    navLink: '/apps/prolongations/list'
  }, */
  {
    id: 'staffs',
    title: 'Staffs',
    icon: <Users size={20} />,
    action: 'read',
    resource: 'Staffs',
    navLink: '/apps/staff'
  },
  {
    id: 'shops',
    title: 'Point of sale',
    action: 'read',
    resource: 'Shops',
    navLink: '/apps/shops/list',
    icon: <Circle size={20} />
  },
  {
    id: 'generalSettings',
    title: 'Settings',
    action: 'manage',
    resource: 'GeneralSettings',
    navLink: '/apps/settings/list',
    icon: <Settings size={20} />
  },
  {
    id: 'types',
    title: 'Types',
    action: 'manage',
    resource: 'Types',
    navLink: '/apps/types/list',
    icon: <Type size={20} />
  },
  {
    id: 'managers',
    title: 'Managers',
    action: 'manage',
    resource: 'Managers',
    navLink: '/apps/managers/list',
    icon: <Users size={20} />
  }

]
