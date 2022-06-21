import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const AppRoutes = [
  {
    path: '/apps/email',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email'))
  },
  {
    path: '/apps/email/:folder',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/label/:label',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/:filter',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/chat',
    appLayout: true,
    className: 'chat-application',
    component: lazy(() => import('../../views/apps/chat'))
  },
  {
    path: '/apps/todo',
    exact: true,
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo'))
  },
  {
    path: '/apps/todo/:filter',
    appLayout: true,
    exact: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/todo/tag/:tag',
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/calendar',
    component: lazy(() => import('../../views/apps/calendar'))
  },
  {
    path: '/apps/invoice/list',
    component: lazy(() => import('../../views/apps/invoice/list'))
  },
  {
    path: '/apps/invoice/preview/:id',
    component: lazy(() => import('../../views/apps/invoice/preview')),
    meta: {
      navLink: '/apps/invoice/preview'
    }
  },
  {
    path: '/apps/invoice/preview',
    exact: true,
    component: () => <Redirect to='/apps/invoice/preview/4987' />
  },
  {
    path: '/apps/invoice/edit/:id',
    component: lazy(() => import('../../views/apps/invoice/edit')),
    meta: {
      navLink: '/apps/invoice/edit'
    }
  },
  {
    path: '/apps/invoice/edit',
    exact: true,
    component: () => <Redirect to='/apps/invoice/edit/4987' />
  },
  {
    path: '/apps/invoice/add',
    component: lazy(() => import('../../views/apps/invoice/add'))
  },
  {
    path: '/apps/invoice/print',
    layout: 'BlankLayout',
    component: lazy(() => import('../../views/apps/invoice/print'))
  },
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/shop'))
  },
  {
    path: '/apps/ecommerce/wishlist',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/wishlist'))
  },
  {
    path: '/apps/ecommerce/product-detail',
    exact: true,
    className: 'ecommerce-application',
    component: () => <Redirect to='/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
    path: '/apps/ecommerce/product-detail/:product',
    exact: true,
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/detail')),
    meta: {
      navLink: '/apps/ecommerce/product-detail'
    }
  },
  {
    path: '/apps/ecommerce/checkout',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/checkout'))
  },
  {
    path: '/apps/user/list',
    component: lazy(() => import('../../views/apps/user/list')),
    meta: {
      action: 'read',
      resource: 'Users'
    }
  },
  {
    path: '/apps/user/edit',
    exact: true,
    component: () => <Redirect to='/apps/user/edit/1' />
  },
  {
    path: '/apps/user/edit/:id',
    component: lazy(() => import('../../views/apps/user/edit')),
    meta: {
      action: 'edit',
      resource: 'Users',
      navLink: '/apps/user/edit'
    }
  },
  {
    path: '/apps/user/view',
    exact: true,
    component: () => <Redirect to='/apps/user/view/1' />
  },
  {
    path: '/apps/user/view/:id',
    component: lazy(() => import('../../views/apps/user/view')),
    meta: {
      action: 'read',
      resource: 'Users',
      navLink: '/apps/user/view'
    }
  },
  {
    path: '/apps/user/rooms/:id',
    component: lazy(() => import('../../views/apps/user/rooms')),
    meta: {
      action: 'read',
      resource: 'Users',
      navLink: '/apps/user/rooms'
    }
  },
  {
    path: '/apps/user/license/:id',
    component: lazy(() => import('../../views/apps/user/licence')),
    meta: {
      action: 'read',
      resource: 'Users',
      navLink: '/apps/user/license'
    }
  },

  // Categories
  {
    path: '/apps/categories/list',
    component: lazy(() => import('../../views/apps/categories/list')),
    meta: {
      action: 'read',
      resource: 'Categories'
    }
  },
  {
    path: '/apps/categories/add',
    component: lazy(() => import('../../views/apps/categories/add')),
    meta: {
      action: 'edit',
      resource: 'Categories'
    }
  },
  {
    path: '/apps/categories/edit/:id',
    component: lazy(() => import('../../views/apps/categories/edit')),
    meta: {
      action: 'edit',
      resource: 'Categories'
    }
  },

  // Articles
  {
    path: '/apps/articles/list',
    component: lazy(() => import('../../views/apps/articles/list')),
    meta: {
      action: 'read',
      resource: 'Articles'
    }
  },
  {
    path: '/apps/articles/add',
    component: lazy(() => import('../../views/apps/articles/add')),
    meta: {
      action: 'edit',
      resource: 'Articles'
    }
  },
  {
    path: '/apps/articles/edit/:id',
    component: lazy(() => import('../../views/apps/articles/edit')),
    meta: {
      action: 'edit',
      resource: 'Articles'
    }
  },

  // Prolongations
  /* {
    path: '/apps/prolongations/list',
    component: lazy(() => import('../../views/apps/prolongations/list')),
    meta: {
      action: 'read',
      resource: 'Prolongations'
    }
  },
  {
    path: '/apps/prolongations/add',
    component: lazy(() => import('../../views/apps/prolongations/add')),
    meta: {
      action: 'create',
      resource: 'Prolongations'
    }
  }, */

  // Hotel Staffs
  {
    path: '/apps/staff',
    component: lazy(() => import('../../views/apps/staff/list')),
    meta: {
      action: 'read',
      resource: 'Staffs'
    }
  },
  {
    path: '/apps/staffs/add',
    component: lazy(() => import('../../views/apps/staff/add')),
    meta: {
      action: 'create',
      resource: 'Staffs'
    }
  },
  {
    path: '/apps/staffs/edit/:id',
    component: lazy(() => import('../../views/apps/staff/edit')),
    meta: {
      action: 'edit',
      resource: 'Staffs'
    }
  },

  // Shops
  {
    path: '/apps/shops/list',
    component: lazy(() => import('../../views/apps/shops/list')),
    meta: {
      action: 'read',
      resource: 'Shops'
    }
  },
  {
    path: '/apps/shops/add',
    component: lazy(() => import('../../views/apps/shops/add')),
    meta: {
      action: 'edit',
      resource: 'Shops'
    }
  },
  {
    path: '/apps/shops/edit/:id',
    component: lazy(() => import('../../views/apps/shops/edit')),
    meta: {
      action: 'edit',
      resource: 'Shops'
    }
  },

  // Types
  {
    path: '/apps/types/list',
    component: lazy(() => import('../../views/apps/types/list')),
    meta: {
      action: 'read',
      resource: 'Types'
    }
  },
  {
    path: '/apps/types/add',
    component: lazy(() => import('../../views/apps/types/add')),
    meta: {
      action: 'edit',
      resource: 'Types'
    }
  },
  {
    path: '/apps/types/edit/:id',
    component: lazy(() => import('../../views/apps/types/edit')),
    meta: {
      action: 'edit',
      resource: 'Types'
    }
  },
  
 // Offers
  {
    path: '/apps/offers/list',
    component: lazy(() => import('../../views/apps/offers/list')),
    meta: {
      action: 'read',
      resource: 'Offers'
    }
  },
  {
    path: '/apps/offers/add',
    component: lazy(() => import('../../views/apps/offers/add')),
    meta: {
      action: 'edit',
      resource: 'Offers'
    }
  },
  {
    path: '/apps/offers/edit/:id',
    component: lazy(() => import('../../views/apps/offers/edit')),
    meta: {
      action: 'edit',
      resource: 'Offers'
    }
  },
  
  // Settings
  {
    path: '/apps/settings/list',
    component: lazy(() => import('../../views/apps/settings/list')),
    meta: {
      action: 'manage',
      resource: 'GeneralSettings'
    }
  },
  {
    path: '/apps/settings/edit/:id',
    component: lazy(() => import('../../views/apps/settings/edit')),
    meta: {
      action: 'edit',
      resource: 'GeneralSettings'
    }
  },

  // Commandes
  {
    path: '/apps/commandes/list',
    component: lazy(() => import('../../views/apps/commandes/list')),
    meta: {
      action: 'read',
      resource: 'Commandes'
    }
  },

  // Profil
  {
    path: '/apps/user/profile',
    component: lazy(() => import('../../views/apps/user/profile')),
    meta: {
      action: 'read',
      resource: 'Categories'
    }
  },

  // Demmands
  {
    path: '/apps/demmands/list',
    component: lazy(() => import('../../views/apps/demmands/list')),
    meta: {
      action: 'read',
      resource: 'Demmands'
    }
  },
  {
    path: '/apps/demmands/add',
    component: lazy(() => import('../../views/apps/demmands/add')),
    meta: {
      action: 'edit',
      resource: 'Demmands'
    }
  },
  {
    path: '/apps/demmands/edit/:id',
    component: lazy(() => import('../../views/apps/demmands/edit')),
    meta: {
      action: 'edit',
      resource: 'Demmands'
    }
  },
  
  {
    path: '/apps/demmands/listRequests',
    component: lazy(() => import('../../views/apps/demmands/listRequests')),
    meta: {
      action: 'edit',
      resource: 'ClientsDemmands'
    }
  },
  // Managers
  {
    path: '/apps/managers/list',
    component: lazy(() => import('../../views/apps/managers/list')),
    meta: {
      action: 'read',
      resource: 'Managers'
    }
  },
  {
    path: '/apps/managers/add',
    component: lazy(() => import('../../views/apps/managers/add')),
    meta: {
      action: 'edit',
      resource: 'Managers'
    }
  },
  {
    path: '/apps/managers/edit/:id',
    component: lazy(() => import('../../views/apps/managers/edit')),
    meta: {
      action: 'edit',
      resource: 'Managers'
    }
  }
  
]

export default AppRoutes
