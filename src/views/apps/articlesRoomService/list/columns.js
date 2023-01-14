// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getArticle, deleteArticle} from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, Trash2, Archive } from 'react-feather'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const columns = [
  {
    name: 'Name',
    // minWidth: '297px',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'Price',
    maxWidth: '150px',
    selector: 'price',
    sortable: true,
    cell: row => `${row.price} MAD`
  },
  /* {
    name: 'Description',
    minWidth: '300px', 
    selector: 'description',
    sortable: true,
    cell: row => row.description
  }, */
  {
    name: 'Category',
    // minWidth: '297px',
    selector: 'category.name',
    sortable: true,
    cell: row => row.category.name
  },

  {
    name: 'Actions',
    maxWidth: '100px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/articles/edit/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getArticle(row.id))}
          >
            <Archive size={14} className='mr-50' />
            <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem className='w-100' onClick={() => store.dispatch(deleteArticle(row.id))}>
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]
