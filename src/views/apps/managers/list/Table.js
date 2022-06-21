// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
// ** Columns
/* import { columns } from './columns' */
// ** Store & Actions
import { getStaffs } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Label, CustomInput, Button, CardBody, Badge } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const StaffsList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.staffs)
  // ** Store length
  const storeLength = store && store.data ? store.data.length : 0

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  const staffRole = (roles) => {
    let roleName = roles[0].name
    if (roleName === 'receptionist') {
      roleName = 'Receptionist'
    } else if (roleName === 'rooms-servant') {
      roleName = 'Rooms servant'
    } else if (roleName === 'housekeeping') {
      roleName = 'HK / Eng'
    } else if (roleName === 'manager') {
      roleName = 'Manager'
    }
    return roleName
  }

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    dispatch(getStaffs())
    console.log(store.data)
  }, [dispatch, storeLength])

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
        axiosInstance.delete(`/users/${id}`)
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('userData'))
          if (userData) {
            dispatch(getStaffs({hotel_id: userData.hotel_id}))
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

  //Btn Style
  const btnStyle = {
    marginLeft: "5px",
    padding:"0.386rem 0.9rem !important" 
  }

  const statusObj = {
    pending: 'light-warning',
    active: 'light-success',
    inactive: 'light-secondary'
  }

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      minWidth: '180px',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.name}</span>
      )
    },
    {
      name: 'Email',
      selector: 'email',
      minWidth: '300px',
      sortable: true,
      cell: row => row.email
    },
    {
      name: 'Role',
      selector: 'role',
      minWidth: '130px',
      sortable: true,
      cell: row => staffRole(row.roles)
      //cell: row => row.roles[0].name
    }
    /*,
    {
      name: 'Actions',
      minWidth: '220px',
      cell: row => (
        <div>
          <div className='d-flex align-items-space-between'>
              <Link to={`/apps/managers/edit/${row.id}`}>
                <Button.Ripple style={{padding: "0.386rem 0.9rem !important"}} color='primary'>
                  Edit
                </Button.Ripple>
              </Link>
              <Button.Ripple style={btnStyle} color='warning' onClick={() => handleConfirmDelete(row.id)} >
                  Delete
              </Button.Ripple>
          </div>
        </div>
      )
    }*/
  ]
  
  // ** Function in get data on search query change
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith = item.email.toLowerCase().startsWith(value.toLowerCase()) 

        const includes = item.email.toLowerCase().startsWith(value.toLowerCase()) 

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
  }

  // ** Table data to render
  const dataToRender = () => {
    if (storeLength > 0) {
      return store.data
    } else {
      return []
    }
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
        <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
            <Row>
              <Col xl='6' className='d-flex align-items-center p-0'>
                {/* <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
                  <Label className='mb-0' for='search-invoice'>
                    Search:
                  </Label>
                  <Input
                    id='search-invoice'
                    className='ml-50 w-100'
                    type='text'
                    value={searchValue}
                    onChange={handleFilter}
                  />
                </div> */}
              </Col>
              <Col
                xl='6'
                className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
              >
                <Link to="/apps/managers/add">
                  <Button.Ripple color='primary'>
                    Add New Manager
                  </Button.Ripple>
                </Link>
              </Col>
            </Row>
          </div>
          <DataTable
            noHeader
            subHeader
            responsive
            columns={columns}
            sortIcon={<ChevronDown />}
            className='react-dataTable mb-5'
            data={dataToRender()}
          />
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default StaffsList
