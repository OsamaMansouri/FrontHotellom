// ** Axios
import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// ** Invoice List Sidebar
import Sidebar from './Sidebar'
// ** Columns
/* import { columns } from './columns' */
// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardBody, Input, Row, Col, Label, Button } from 'reactstrap'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
// ** Swall Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Custom Components
import Avatar from '@components/avatar'

const MySwal = withReactContent(Swal)

const ArticlesList = () => {

  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [dataCount, setDataCount] = useState(0)
  const [data, setData] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState([])

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    if (userData) {
      axiosInstance
        .get(`/RoomServiceArticles?hotel_id=${userData.hotel_id}&web=5`)
        .then(res => { 
          setData(res.data)
          setDataCount(res.data.length)
        })
        .catch(err => { console.log(err) })
    }
  }, [])

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
        axiosInstance.delete(`/articles/${id}`)
        .then(() => {
          const userData = JSON.parse(localStorage.getItem('userData'))
          if (userData) {
            axiosInstance
              .get(`/articles?hotel_id=${userData.hotel.id}&web=5`)
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

  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      minWidth: '300px',
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <Avatar className='mr-1' img={row.image} width='32' height='32' />
          <div className='d-flex flex-column'>
            <span className='font-weight-bold'>{row.name}</span>
          </div>
        </div>
      )
    },
    {
      name: 'Price',
      selector: 'price',
      sortable: true,
      cell: row => `${row.price} MAD`
    },
    {
      name: 'Profit',
      selector: 'profit',
      sortable: true,
      cell: row => `${row.profit} MAD`
    },
    {
      name: 'Category',
      selector: 'category.name',
      sortable: true,
      minWidth: '200px',
      cell: row => row.category.name
    },
    {
      name: 'Article Type', 
      selector: 'category.shop_id.name',
      sortable: true,
      cell: row => row.category.shop.name
    },
    {
      name: 'Actions',
      minWidth: '220px',
      cell: row => (
        <div>
          <div className='d-flex align-items-space-between'>
              <Link to={`/apps/articlesRoomService/edit/${row.id}`}>
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
    setCurrentPage(page.selected)
  }

  // ** Function in get data on search query change
  const handleFilter = e => {
    const value = e.target.value
    let updatedData = []
    setSearchValue(value)

    if (value.length) {
      updatedData = data.filter(item => {
        const total = `${item.price} `
        const startsWith =
          item.description.toLowerCase().startsWith(value.toLowerCase()) ||
          item.category.name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.name.toLowerCase().startsWith(value.toLowerCase()) ||
          total.toLowerCase().startsWith(value.toLowerCase())

        const includes =
          item.description.toLowerCase().startsWith(value.toLowerCase()) ||
          item.category.name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.name.toLowerCase().startsWith(value.toLowerCase()) ||
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
        <h1 style={{paddingLeft:'15px', paddingTop:'15px'}}>Articles</h1>
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
                <Link to="/apps/articlesRoomService/add">
                  <Button.Ripple color='primary'>
                    Add New Article
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
        </CardBody>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default ArticlesList
