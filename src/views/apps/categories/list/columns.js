// ** React Imports
import { Link } from 'react-router-dom'

// ** Store & Actions
import { getCategory, deleteCategory } from '../store/action'
import { store } from '@store/storeConfig/store'
import axiosInstance from '../../../../@core/api/axiosInstance'

// ** Third Party Components
import { UncontrolledDropdown, Button, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, FileText, Trash2, Archive } from 'react-feather'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const handleConfirmDelete = (id) => {
  return MySwal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-danger ml-1'
    },
    buttonsStyling: false
  }).then(function (result) {
    if (result.value) {
      axiosInstance.delete(`/categories/${id}`)
      .then(() => {
        const userData = JSON.parse(localStorage.getItem('userData'))
        if (userData) {
          axiosInstance
            .get(`/categories?hotel_id=${userData.hotel.id}&web=5`)
            .then(res => { 
              setData(res.data)
              setDataCount(res.data.length)
            })
            .catch(err => { console.log(err) })
        }
      })
      
      MySwal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Your file has been deleted.',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      })
    }
  })
}

const btnStyle = {
  marginLeft: "5px",
  padding:"0.386rem 0.9rem !important" 
}

export const columns = [
  {
    name: 'Name',
    minWidth: '297px',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'Time start',
    minWidth: '172px',
    selector: 'startTime',
    sortable: true,
    cell: row => row.startTime
  },
  {
    name: 'Time end',
    minWidth: '172px',
    selector: 'endTime',
    sortable: true,
    cell: row => row.endTime
  },
  /* {
    name: 'Sequence',
    minWidth: '138px',
    selector: 'Sequence',
    sortable: true,
    cell: row => <span className='text-capitalize'>{row.Sequence}</span>
  }, */
  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <div>
        <div className='d-flex align-items-space-between'>
            <Link to={`/apps/categories/edit/${row.id}`}>
              <Button.Ripple style={{padding: "0.386rem 0.9rem !important"}} color='primary'>
                Edit
              </Button.Ripple>
            </Link>
            <Button.Ripple style={btnStyle} color='warning' onClick={() => handleConfirmDelete(row.id)} >
                Delete
            </Button.Ripple>
        </div>
        {/* <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/categories/edit/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getCategory(row.id))}
          >
            <Archive size={14} className='mr-50' />
            <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem className='w-100' onClick={() => store.dispatch(deleteCategory(row.id))}>
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown> */}
      </div>
      
    )
  }
]
