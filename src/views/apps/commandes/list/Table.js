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
import { Card, Badge, Input, Row, Col, Label, CardBody, Button,
         Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const ArticlesList = () => {

  // ** States
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [scrollInnerModal, setScrollInnerModal] = useState(false)
  const [commandData, setCommandData] = useState([])
  const [commandComment, setCommandComment] = useState('')

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const commandeDetails = (id) => {
    setScrollInnerModal(!scrollInnerModal)
    axiosInstance
      .get(`/commands/getData/${id}`)
      .then(res => { 
        setCommandData(res.data)
        setCommandComment(res.data[0].comment)
      })
      .catch(err => { console.log(err) })
  }

  /* const offerDetails = (id) => {
    setScrollInnerModalOffer(!scrollInnerModalOffer)
    axiosInstance
      .get(`/commandOffers/getData/${id}`)
      .then(res => { 
        console.log(res.data)
        setOfferData(res.data)
      })
      .catch(err => { console.log(err) })
  } */

  const columns = [
    {
      name: 'Client',
      // minWidth: '297px',
      selector: 'name',
      sortable: true,
      cell: row => (
        <span className='font-weight-bold' >{`${row.user.firstname} ${row.user.lastname}`}</span>
      ) 
    },
    {
      name: 'Room',
      // minWidth: '297px',
      selector: 'room_number',
      sortable: true,
      cell: row => row.room.room_number
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => (
        <Badge color={`light-${row.status === "In preparation" ? "warning" : "success"}`}>{row.status}</Badge>
      )
    },
    {
      name: 'Payment',
      selector: 'payment',
      sortable: true,
      cell: row => row.payment
    },
    {
      name: 'Total',
      selector: 'total',
      sortable: true,
      cell: row => `${row.total} MAD`
    },
    {
      name: 'Action',
      minWidth: '150px',
      cell: row => (
        <Button color='primary' onClick={() => commandeDetails(row.id)}>
            Detail
        </Button>
      )
    }
  
  ]
  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      axiosInstance
        .get(`/commands?web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }
  }, [])


  // ** Function in get data on page change
  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  // ** Function in get data on search query change
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)
    
    if (value.length) {
      updatedData = data.filter(item => {
        //console.log(item.user.firstname)
        const room_id = `${item.room.room_number} `
        const total = `${item.total} `
        const name = `${item.user.firstname} ${item.user.lastname}`
        const startsWith =
         room_id.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase()) ||
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.payment.toLowerCase().startsWith(value.toLowerCase()) ||
          total.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          room_id.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase()) ||
          name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.payment.toLowerCase().startsWith(value.toLowerCase()) ||
          total.toLowerCase().startsWith(value.toLowerCase())

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

  return (
    <Fragment>
      
      <Card>
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Orders</h1>
        <CardBody>
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
                    value={searchValue}
                    onChange={handleFilter}
                  />
                </div>

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

      <div>
        <Modal 
          scrollable 
          isOpen={scrollInnerModal} 
          toggle={() => setScrollInnerModal(!scrollInnerModal)}
          className={`modal-dialog-centered modal-lg`}
        >
          <ModalHeader toggle={() => setScrollInnerModal(!scrollInnerModal)}></ModalHeader>
          <ModalBody>
            
            <br />
            <p>Note : {commandComment}</p>
            <br />
            <Table responsive>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {commandData.map(com => <tr key={com.article.id}>
                    <td>{com.article.name}</td>
                    <td>{com.quantity}</td>
                    <td>{com.total} MAD</td>
                  </tr>
                  ) }
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setScrollInnerModal(!scrollInnerModal)}>
              Fermer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default ArticlesList
