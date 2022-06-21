// ** Navigation sections imports
import apps from './apps'
import users from './users'
import forms from './forms'
import dashboards from './dashboards'
import paiments from './paiments'


// ** Merge & Export
export default [...dashboards, ...forms, ...users, ...apps, ...paiments]
