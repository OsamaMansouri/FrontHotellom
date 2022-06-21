// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getShop, deleteShop } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'

export const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  /* {
    name: 'Type',
    selector: 'name',
    sortable: true,
    cell: row => row.type_id
  }, */
  {
    name: 'Menu',
    selector: 'menu',
    minWidth: '20%',
    sortable: true,
    cell: row => row.menu
  },
  {
    name: 'Time start',
    selector: 'startTime',
    sortable: true,
    cell: row => row.startTime
  },
  {
    name: 'Time end',
    selector: 'endTime',
    sortable: true,
    cell: row => row.endTime
  },
  {
    name: 'Color',
    selector: 'color',
    sortable: true,
    cell: row => <span className='text-capitalize'>{row.color}</span>
  },
  {
    name: 'Sequence',
    selector: 'Sequence',
    sortable: true,
    cell: row => <span className='text-capitalize'>{row.sequence}</span>
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
            to={`/apps/shops/edit/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getShop(row.id))}
          >
            <Archive size={14} className='mr-50' />
            <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem className='w-100' onClick={() => store.dispatch(deleteShop(row.id))}>
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]
