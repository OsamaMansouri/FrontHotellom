// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// ** Columns
import { columns } from './columns'
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, Badge, Input, Row, Col, Label, CardBody, Button,
  Modal, ModalHeader, ModalBody, ModalFooter, Table
   , TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Swall Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const OffersList = () => {

  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  
  const [currentPageOffer, setCurrentPageOffer] = useState(0)
  const [rowsPerPageOffer, setRowsPerPageOffer] = useState(15)
  const [offerDataCount, setOfferDataCount] = useState(0)
  const [data2, setData2] = useState([])
  const [searchValue2, setSearchValue2] = useState('')
  const [filteredData2, setFilteredData2] = useState([])
  const [scrollInnerModalOffer, setScrollInnerModalOffer] = useState(false)
  const [offerData, setOfferData] = useState({})

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const [active, setActive] = useState('1')
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      axiosInstance
        .get(`/offers?web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })

      axiosInstance
        .get(`/commandOffers?web=5`)
        .then(res => { 
          setData2(res.data)
          setOfferDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }

  }, [])

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
        axiosInstance.delete(`/offers/${id}`)
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('userData'))
          if (userData) {
            axiosInstance
              .get(`/offers?web=5`)
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

  const statusObj = {
    pending: 'light-warning',
    active: 'light-success',
    inactive: 'light-secondary'
  }

  //Btn Style
  const btnStyle = {
    marginLeft: "5px",
    padding:"0.386rem 0.9rem !important" 
  }
  
  const columns = [
    {
      name: 'Title',
      selector: 'titre',
      minWidth: '250px',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.titre}</span>
      )
    },
    {
      name: 'Price',
      selector: 'prix',
      sortable: true,
      cell: row => `${row.prix} MAD`
    },
    {
      name: 'Discount',
      selector: 'discount',
      sortable: true,
      cell: row => `${row.discount} %`
    },
    {
      name: 'Final Price',
      selector: 'prixFinal',
      sortable: true,
      cell: row =>  `${row.prixFinal} MAD`
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => (
        <Badge color={`light-${row.statusClass}`}>{row.status}</Badge>
      )
    },
    {
      name: 'Orders',
      selector: 'orders',
      sortable: true,
      cell: row => row.orders
    },
  
    {
      name: 'Actions',
      minWidth: '220px',
      cell: row => (
        <div>
          <div className='d-flex align-items-space-between'>
              <Link to={`/apps/offers/edit/${row.id}`}>
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
  const columnsOffer = [
    {
      name: 'Offer',
      selector: 'Title',
      minWidth: '200px',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{row.offer.titre}</span>
      ) 
    },
    {
      name: 'Client',
      selector: 'name',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{`${row.user.firstname} ${row.user.lastname}`}</span>
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
        <Badge color={`light-${row.orderStatus === "In preparation" ? "warning" : "success"}`}>{row.orderStatus}</Badge>
      )
    },
    {
      name: 'Quantity',
      selector: 'quantity',
      sortable: true,
      cell: row => row.quantity
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: row => `${row.total} MAD`
    }
    /* {
      name: 'Action',
      minWidth: '150px',
      cell: row => (
        <Button color='primary' onClick={() => offerDetails(row.id)}>
            Detail
        </Button>
      )
    } */
  
  ]

  
  // ** Function in get data on page change
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const handleOfferPagination = page => {
    setCurrentPageOffer(page.selected)
  }

  // ** Function in get data on search query change
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const price = `${item.prix} `
        const finalPrice = `${item.prixFinal} `
        const discount = `${item.discount} `
        const startsWith =
          item.description.toLowerCase().startsWith(value.toLowerCase()) ||
          item.titre.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase()) ||
          price.toLowerCase().startsWith(value.toLowerCase()) ||
          finalPrice.toLowerCase().startsWith(value.toLowerCase()) ||
          price.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.description.toLowerCase().startsWith(value.toLowerCase()) ||
          item.titre.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase()) ||
          price.toLowerCase().startsWith(value.toLowerCase()) ||
          finalPrice.toLowerCase().startsWith(value.toLowerCase()) ||
          discount.toLowerCase().startsWith(value.toLowerCase())

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

  const handleOfferFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue2(value)
    
    if (value.length) {
      updatedData = data2.filter(item => {
        const total = `${item.total} `
        const offer = `${item.offer.titre}`
        const room = `${item.room.room_number}`
        const name = `${item.user.firstname} ${item.user.lastname}`
        const startsWith = item.orderStatus.toLowerCase().startsWith(value.toLowerCase()) ||
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          total.toLowerCase().startsWith(value.toLowerCase()) ||
          room.toLowerCase().startsWith(value.toLowerCase()) ||
          offer.toLowerCase().startsWith(value.toLowerCase())

        const includes = item.orderStatus.toLowerCase().startsWith(value.toLowerCase()) ||
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          total.toLowerCase().startsWith(value.toLowerCase()) ||
          room.toLowerCase().startsWith(value.toLowerCase()) ||
          offer.toLowerCase().startsWith(value.toLowerCase())

        if (startsWith) {
          return startsWith
        } else if (!startsWith && includes) {
          return includes
        } else return null
      })
      setFilteredData2(updatedData)
      setSearchValue2(value)
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

  const CustomOfferPagination = () => {
    const count = Number(Math.ceil(offerDataCount / rowsPerPageOffer))

    return (
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        forcePage={currentPageOffer}
        pageCount={searchValue2.length ? filteredData2.length / rowsPerPageOffer : count || 1}
        activeClassName='active'
        onPageChange={page => handleOfferPagination(page)}
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
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Orders</h1>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1')
                }}
              >
                Promotions Orders
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2')
                }}
              >
                Promotions
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className='py-50' activeTab={active}>
            <TabPane tabId='2'>
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
                  <Link to="/apps/offers/add">
                    <Button.Ripple color='primary'>
                      Add New Promotion
                    </Button.Ripple>
                  </Link>
                </Col>
              </Row>
            </div>
            <DataTable
              noHeader
              respensive
              pagination
              columns={columns}
              paginationPerPage={rowsPerPage}
              className='react-dataTable'
              sortIcon={<ChevronDown size={10} />}
              paginationDefaultPage={currentPage + 1}
              paginationComponent={CustomPagination}
              data={searchValue.length ? filteredData : data}
            />
            </TabPane>
            <TabPane tabId='1'>
              <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
                <Row>
                  <Col
                    xl='6'
                    className='d-flex align-items-sm-center justify-content-lg-start justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
                  >
                    <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
                      <Label className='mb-0' for='search-invoice'>
                        Search:
                      </Label>
                      <Input
                        id='search-invoice'
                        className='ml-50 w-100'
                        type='text'
                        value={searchValue2}
                        onChange={handleOfferFilter}
                      />
                    </div>

                  </Col>
                </Row>
              </div>
              <DataTable
                noHeader
                pagination
                columns={columnsOffer}
                paginationPerPage={rowsPerPageOffer}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                paginationDefaultPage={currentPageOffer + 1}
                paginationComponent={CustomOfferPagination}
                data={searchValue2.length ? filteredData2 : data2}
              />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>


      {/* <Card>
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
                <Link to="/apps/offers/add">
                  <Button.Ripple color='primary'>
                    Add New Promotion
                  </Button.Ripple>
                </Link>
              </Col>
            </Row>
          </div>
          <DataTable
            noHeader
            respensive
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
      </Card> */}

    </Fragment>
  )
}

export default OffersList
