// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { getSetting } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Renders Client Columns
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6),
    states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
    color = states[stateNum]

  if (row.avatar.length) {
    return <Avatar className='mr-1' img={row.avatar} width='32' height='32' />
  } else {
    return <Avatar color={color || 'primary'} className='mr-1' content={row.fullName || 'John Doe'} initials />
  }
}

// ** Renders Role Columns
const renderRole = row => {
  const roleObj = {
    subscriber: {
      class: 'text-primary',
      icon: User
    },
    maintainer: {
      class: 'text-success',
      icon: Database
    },
    editor: {
      class: 'text-info',
      icon: Edit2
    },
    author: {
      class: 'text-warning',
      icon: Settings
    },
    admin: {
      class: 'text-danger',
      icon: Slack
    }
  }

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon size={18} className={`${roleObj[row.role] ? roleObj[row.role].class : ''} mr-50`} />
      {row.role}
    </span>
  )
}

const statusObj = {
  pending: 'light-warning',
  active: 'light-success',
  inactive: 'light-secondary'
}

export const columns = [
  {
    name: 'Tax',
    selector: 'tax',
    sortable: true,
    cell: row => `${row.tax} %`
  },
  {
    name: 'Timer',
    selector: 'timer',
    sortable: true,
    cell: row => `${row.timer} Min`
  },
  {
    name: 'Licence Days',
    selector: 'licence_days',
    sortable: true,
    cell: row => row.licence_days
  },

  {
    name: 'Actions',
    minWidth: '120px',
    cell: row => (
      <div className='d-flex align-items-center'>
          <Link to={`/apps/settings/edit/${row.id}`}>
            <Button.Ripple color='primary'>
              Edit
            </Button.Ripple>
          </Link>
      </div>
    )
  }
]
