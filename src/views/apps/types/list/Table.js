// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
// ** Invoice List Sidebar
import Sidebar from './Sidebar'
// ** Columns
/* import { columns } from './columns' */
// ** Store & Actions
import { getAllData, getData, deleteType } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '@store/storeConfig/store'
// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors, isUserLoggedIn } from '@utils'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Swall
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const ability = useContext(AbilityContext)
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          {/* <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div> */}
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Search:
            </Label>
            <Input
              id='search-invoice'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>

          {/* {ability.can('edit', 'Permissions') && ( */}
          <Link to="/apps/types/add">
            <Button.Ripple color='primary'>
              Add New Type
            </Button.Ripple>
          </Link>
          {/*)}*/}
        </Col>
      </Row>
    </div>
  )
}

const TypesList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.categories)
  // ** Store length
  const storeLength = store && store.data ? store.data.length : 0

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      /* dispatch(getAllData(userData.hotel.id))
      dispatch(
        getData({
          page: currentPage,
          perPage: rowsPerPage,
          role: currentRole.value,
          currentPlan: currentPlan.value,
          status: currentStatus.value,
          q: searchTerm,
          hotel_id: userData.hotel.id
        })
      ) */
      axiosInstance
        .get(`/types?hotel_id=${userData.hotel_id}&web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }

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
        axiosInstance.delete(`/types/${id}`)
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('userData'))
          if (userData) {
            axiosInstance
              .get(`/types?hotel_id=${userData.hotel_id}&web=5`)
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

  //Btn Style
  const btnStyle = {
    marginLeft: "5px",
    padding:"0.386rem 0.9rem !important" 
  }
  const btnStyleEdit = {
    padding:"0.386rem 0.9rem !important" 
  }
  const btnStyleDisable = {
    display: "none"
  }

  const columns = [
    {
      name: 'Name',
      minWidth: '297px',
      selector: 'name',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.name}</span>
      )
    },
  
    {
      name: 'Actions',
      minWidth: '200px',
      cell: row => (
        <div>
          {/* style={row.name === "Room Service" ? btnStyleDisable : btnStyleEdit} */}
          <div className='d-flex align-items-space-between'>
              <Link to={`/apps/types/edit/${row.id}`}>
                <Button.Ripple style={btnStyleEdit} color='primary'>
                  Edit
                </Button.Ripple>
              </Link>
              <Button.Ripple style={row.name === "Room Service" ? btnStyleDisable : btnStyle} color='warning' onClick={() => handleConfirmDelete(row.id)} >
                  Delete
              </Button.Ripple>
          </div>
        </div>
      )
    }
  ]

  // ** User filter options
  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'author', label: 'Author' },
    { value: 'editor', label: 'Editor' },
    { value: 'maintainer', label: 'Maintainer' },
    { value: 'subscriber', label: 'Subscriber' }
  ]

  const planOptions = [
    { value: '', label: 'Select Plan' },
    { value: 'basic', label: 'Basic' },
    { value: 'company', label: 'Company' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'team', label: 'Team' }
  ]

  const statusOptions = [
    { value: '', label: 'Select Status', number: 0 },
    { value: 'pending', label: 'Pending', number: 1 },
    { value: 'active', label: 'Active', number: 2 },
    { value: 'inactive', label: 'Inactive', number: 3 }
  ]

  // ** Function in get data on page change
  const handlePagination = page => {
    /* dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        role: currentRole.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setCurrentPage(page.selected + 1) */
    setCurrentPage(page.selected)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    /* const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        page: currentPage,
        perPage: value,
        role: currentRole.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setRowsPerPage(value) */
    
  }

  // ** Function in get data on search query change
  const handleFilter = e => {
    /* setSearchTerm(val)
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        role: currentRole.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
        q: val
      })
    ) */
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith = item.name.toLowerCase().startsWith(value.toLowerCase()) 

        const includes = item.name.toLowerCase().startsWith(value.toLowerCase()) 

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

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(dataCount / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        forcePage={currentPage}
        pageCount={searchValue.length ? filteredData.length / rowsPerPage : count || 1}
        activeClassName='active'
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      role: currentRole.value,
      currentPlan: currentPlan.value,
      status: currentStatus.value,
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    // return store.data
    if (storeLength > 0) {
      return store.data
    } else if (storeLength === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card>
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Types</h1>
        <CardBody>
          <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
            <Row>
              <Col xl='6' className='d-flex align-items-center p-0'>
                <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
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
                </div>
              </Col>
              <Col
                xl='6'
                className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
              >
                <Link to="/apps/types/add">
                  <Button.Ripple color='primary'>
                    Add New Type
                  </Button.Ripple>
                </Link>
              </Col>
            </Row>
          </div>
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={rowsPerPage}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={searchValue.length ? filteredData : data}
          />
          {/* <DataTable
            noHeader
            pagination
            subHeader
            responsive
            paginationServer
            columns={columns}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                toggleSidebar={toggleSidebar}
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                searchTerm={searchTerm}
                handleFilter={handleFilter}
              />
            }
          /> */}
        </CardBody>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default TypesList
