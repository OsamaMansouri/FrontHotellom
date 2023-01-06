// ** React Imports
import { Link } from 'react-router-dom'
// ** Custom Components
import Avatar from '@components/avatar'
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** Store & Actions
import { getUser, deleteUser } from '../store/action'
import { store } from '@store/storeConfig/store'
// ** Third Party Components
import { Badge, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Renders Client Columns
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6),
    states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
    color = states[stateNum]

  if (row.avatar?.length) {
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
  inactive: 'light-warning',
  closed: 'light-dark'
}
const btnStyle = {
  marginLeft: "5px",
  padding:"0.386rem 0.9rem !important" 
}

const donwloadQrcode = async (source) => {

  const fileName = source.split('/').pop()
  const el = document.createElement("a")
  el.setAttribute("href", source)
  el.setAttribute("target", '_black')
  el.setAttribute("download", fileName)
  document.body.appendChild(el)
  el.click()
  el.remove()
}
const openInNewTab = url => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const Submit = (reference, code) => {

  openInNewTab(`http://localhost:8000/pdfhotel/${code}/${reference}`)

}
export const columns = [
  {
    name: 'Name',
    minWidth: '200px',
    selector: 'name',
    sortable: true,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        {/* {renderClient(row)} */}
        <div className='d-flex flex-column'>
            <span className='font-weight-bold'>{row.name}</span>
        </div>
      </div>
    )
  },
  {
    name: 'City',
    selector: 'city',
    sortable: true,
    cell: row => row.city
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status]} pill>
        {row.status}
      </Badge>
    )
  },
  {
    name: 'Reason',
    selector: 'reason',
    sortable: true,
    cell: row => row.reason
  },
  {
    name: 'Code Hotel',
    selector: 'code',
    sortable: true,
    cell: row => row.code
  },
  {
    name: 'Actions',
    minWidth: '500px',
    cell: row => (
      <div>
        <div className='d-flex align-items-space-between'>
            <Link to={`/apps/user/edit/${row.id}`}>
              <Button.Ripple style={{padding: "0.386rem 0.9rem !important"}} color='primary'>
                Edit
              </Button.Ripple>
            </Link>
            <Link to={`/apps/user/rooms/${row.id}`}>
              <Button.Ripple style={btnStyle} color='secondary'>
                Rooms
              </Button.Ripple>
            </Link>
            <Link>
              <Button.Ripple 
                style={btnStyle} 
                color='success'
                onClick={(e) => donwloadQrcode(`https://api.hotellom.com/img/hotels/hotel-${row.reference}.png`)}
                >
                View QR
              </Button.Ripple>
            </Link>
            
              <Button.Ripple 
                style={btnStyle} 
                color='primary'
                onClick={(e) => { Submit(row.reference, row.code) }}
                >
                Generate PDF
              </Button.Ripple>
          
        </div>
      </div>
      
    )
  }
]
