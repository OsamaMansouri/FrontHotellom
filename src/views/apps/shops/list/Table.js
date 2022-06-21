// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
// ** Columns
/* import { columns } from './columns' */
// ** Store & Actions
import { getData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Label, CustomInput, Button, CardBody, Badge } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Swall Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// ** Table Header
const CustomHeader = ({ handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const ability = useContext(AbilityContext)
  return (
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
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <Link to="/apps/shops/add">
            <Button.Ripple color='primary'>
              Add New Point of sale
            </Button.Ripple>
          </Link>
        </Col>
      </Row>
    </div>
  )
}

const ShopsList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.shops)
  
  // ** Store length
  const storeLength = store && store.data ? store.data.length : 0

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      /* dispatch(
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
        .get(`/shops?web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }

  }, [dispatch])

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
        axiosInstance.delete(`/shops/${id}`)
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('userData'))
          if (userData) {
            axiosInstance
              .get(`/shops?web=5`)
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

  const statusObj = {
    Gold: 'light-warning',
    Purple: 'light-primary'
  }

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      minWidth: '250px',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.name}</span>
      )
    },
    {
      name: 'Color',
      selector: 'color',
      sortable: true,
      cell: row => (
        <Badge className='text-capitalize' color={statusObj[row.color]} pill>
          {row.color}
        </Badge>
      )
    },
    {
      name: 'Sequence',
      selector: 'Sequence',
      sortable: true,
      cell: row => <span className='text-capitalize'>{row.sequence}</span>
    },
    {
      name: 'Actions',
      minWidth: '220px',
      cell: row => (
        <div>
          <div className='d-flex align-items-space-between'>
              <Link to={`/apps/shops/edit/${row.id}`}>
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
    }
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
    const value = parseInt(e.currentTarget.value)
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
    setRowsPerPage(value)
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
        const startsWith = item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                            item.color.toLowerCase().startsWith(value.toLowerCase()) 

        const includes = item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                          item.color.toLowerCase().startsWith(value.toLowerCase()) 

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
    /* const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    ) */
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
    // return store.data
    if (storeLength > 0) {
      return store.data
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card>
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Point of sale</h1>
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
                <Link to="/apps/shops/add">
                  <Button.Ripple color='primary'>
                    Add New Shop
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
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                searchTerm={searchTerm}
                handleFilter={handleFilter}
              />
            }
          /> */}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ShopsList
