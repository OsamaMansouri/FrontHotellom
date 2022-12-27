// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Invoice List Sidebar
import Sidebar from './Sidebar'
// ** Columns
//import { columns } from './columns'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Badge, Input, Row, Col, Label, CardBody
   , TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Link } from 'react-router-dom'
import Avatar from '@components/avatar'

const ArticlesList = () => {

  // ** States
  const [currentRequestPage, setCurrentRequestPage] = useState(0)
  const [rowsRequestPerPage, setRowsRequestPerPage] = useState(15)
  const [dataRequestCount, setDataRequestCount] = useState(0)
  const [dataRequest, setDataRequest] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchRequestValue, setSearchRequestValue] = useState('')
  const [filteredRequestData, setFilteredRequestData] = useState([])
  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  //Btn Style
  const btnStyle = {
    marginLeft: "5px",
    padding:"0.386rem 0.9rem !important" 
  }

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {

      axiosInstance
        .get(`/demmandUsers?web=5`)
        .then(res => { 
          setDataRequest(res.data)
          setDataRequestCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }

  }, [])

  const columnsRequest = [
    {
      name: 'Title',
      minWidth: '297px',
      selector: 'name',
      sortable: true,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <Avatar className='mr-1' img={row.demmand.icon} width='32' height='32' />
          <div className='d-flex flex-column'>
              <span className='font-weight-bold'>{row.demmand.name}</span>
          </div>
        </div>
      )
    },
    {
      name: 'Message',
      selector: 'message',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{`${row.message}`}</span>
      )
    },
    {
      name: 'Room',
      selector: 'room',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.room.room_number}</span>
      ) 
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => (
        <Badge color={`light-${row.status === "pending" ? "warning" : "success"}`}>{row.status}</Badge>
      )
    }
  
  ]

  // ** Function in get data on page change
  const handleRequestPagination = page => {
    setCurrentRequestPage(page.selected)
  }

  // ** Function in get data on search query change
  const handleRequestFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchRequestValue(value)
    
    if (value.length) {
      updatedData = dataRequest.filter(item => {
        //console.log(item.user.firstname)
        const name = `${item.demmand.name} `
        const room = `${item.room.room_number} `
        const option = `${item.option.name} `
        const message = `${item.message}`
        const status = `${item.status}`
        const startsWith =
         name.toLowerCase().startsWith(value.toLowerCase()) ||
          option.toLowerCase().startsWith(value.toLowerCase()) ||
          message.toLowerCase().startsWith(value.toLowerCase()) ||
          status.toLowerCase().startsWith(value.toLowerCase()) ||
          room.toLowerCase().startsWith(value.toLowerCase()) 

        const includes =
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          option.toLowerCase().startsWith(value.toLowerCase()) ||
          message.toLowerCase().startsWith(value.toLowerCase()) ||
          status.toLowerCase().startsWith(value.toLowerCase()) ||
          room.toLowerCase().startsWith(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredRequestData(updatedData)
      setSearchRequestValue(value)
    }
  }

  // ** Custom Pagination
  const CustomRequestPagination = () => {
    const count = Number(Math.ceil(dataRequestCount / rowsRequestPerPage))

    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        forcePage={currentRequestPage}
        pageCount={searchRequestValue.length ? filteredRequestData.length / rowsRequestPerPage : count || 1}
        activeClassName='active'
        onPageChange={page => handleRequestPagination(page)}
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

  return (
    <Fragment>
      <Card>
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Clients requests</h1>
        <CardBody>
          <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
            <Row>
              <Col
                xl='6'
                className='d-flex justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
              >
                <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
                  <Label className='mb-0' for='search-invoice'>
                    Search:
                  </Label>
                  <Input
                    id='search-invoice'
                    className='ml-50 w-100'
                    type='text'
                    value={searchRequestValue}
                    onChange={handleRequestFilter}
                  />
                </div>

              </Col>
            </Row>
          </div>
          <DataTable
            noHeader
            pagination
            columns={columnsRequest}
            paginationPerPage={rowsRequestPerPage}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentRequestPage + 1}
            paginationComponent={CustomRequestPagination}
            data={searchRequestValue.length ? filteredRequestData : dataRequest}
          />
        </CardBody>
      </Card>
      
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default ArticlesList
