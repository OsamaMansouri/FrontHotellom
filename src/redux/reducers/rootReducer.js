// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'
import notifications from './notifications'
import chat from '@src/views/apps/chat/store/reducer'
import todo from '@src/views/apps/todo/store/reducer'
import users from '@src/views/apps/user/store/reducer'
import email from '@src/views/apps/email/store/reducer'
import invoice from '@src/views/apps/invoice/store/reducer'
import calendar from '@src/views/apps/calendar/store/reducer'
import ecommerce from '@src/views/apps/ecommerce/store/reducer'
import dataTables from '@src/views/tables/data-tables/store/reducer'
import categories from '@src/views/apps/categories/store/reducer'
import prolongations from '@src/views/apps/prolongations/store/reducer'
import articles from '@src/views/apps/articles/store/reducer'
import staffs from '@src/views/apps/staff/store/reducer'
import shops from '@src/views/apps/shops/store/reducer'

const rootReducer = combineReducers({
  auth,
  todo,
  chat,
  email,
  users,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  categories,
  prolongations,
  notifications,
  articles,
  staffs,
  shops
})

export default rootReducer
