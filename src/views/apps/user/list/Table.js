// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'

// ** React Imports
import { Fragment, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { AbilityContext } from '@src/utility/context/Can'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllData, getData } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const ability = useContext(AbilityContext)
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
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
          </div>
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
          
         {ability.can('read', 'Users') ? (
            <Link to="/forms/wizard">
            <Button.Ripple color='primary'>
              Add New Hotel
            </Button.Ripple>
            </Link>
          ) : null}
        </Col>
      </Row>
    </div>
  )
}

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)
  // ** Store length
  const storeLength = store && store.data ? store.data.length : 0

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const ability = useContext(AbilityContext)

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      axiosInstance
        .get(`/hotels?web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }
    /* dispatch(getAllData())
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: searchTerm
      })
    ) */
  }, [/* dispatch, storeLength */])

  // ** Function in get data on page change
  const handlePagination = page => {
    /* setCurrentPage(page.selected + 1) */
    /* dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        q: searchTerm
      })
    ) */
    setCurrentPage(page.selected)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        page: currentPage,
        perPage: value,
        q: searchTerm
      })
    )
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const startsWith = item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                            item.city.toLowerCase().startsWith(value.toLowerCase()) ||
                            item.status.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.name.toLowerCase().startsWith(value.toLowerCase()) ||
                          item.city.toLowerCase().startsWith(value.toLowerCase()) ||
                          item.status.toLowerCase().startsWith(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData(updatedData)
      setSearchValue(value)
    }
    /* setSearchTerm(val)
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        q: val
      })
    ) */
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
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (storeLength > 0) {
      return storeLength
    } else if (storeLength === 0 && isFiltered) {
      return []
    } else {
      const data = store.allData
      console.log(store)
      return data.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>

      <Card>
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Hotels</h1>
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
                {ability.can('read', 'Users') ? (
                  <Link to="/forms/wizard">
                  <Button.Ripple color='primary'>
                    Add New Hotel
                  </Button.Ripple>
                  </Link>
                ) : null}
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
        </CardBody>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default UsersList
