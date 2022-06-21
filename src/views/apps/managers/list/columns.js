
// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'

const staffRole = (roles) => {
  const roleName = roles[0].name
  return roleName === 'receptionist' ? 'Receptionist' : 'Rooms servant'
}

export const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true,
    cell: row => row.email
  },
  {
    name: 'Role',
    selector: 'role',
    sortable: true,
    cell: row => staffRole(row.roles)
  },

  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/staffs/edit/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getType(row.id))}
          >
            <Archive size={14} className='mr-50' />
            <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem className='w-100' onClick={() => store.dispatch(deleteType(row.id))}>
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]
