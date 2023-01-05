
import axiosInstance from '../../../../@core/api/axiosInstance'
import { Fragment, useState, useEffect } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table, Label, Input, Button } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
// ** Swall Alert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const RoomsList = () => {
    // ** State
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const [rooms, setRooms] = useState([])
    const [errors, setErrors] = useState({})
    const history = useHistory()
    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dataCount, setDataCount] = useState(0)
    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const MySwal = withReactContent(Swal)
    const {Id} = useParams()
    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            const user = JSON.parse(localStorage.getItem('userData'))
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            // fetch rooms
            axiosInstance.get(`/getRoomsByHotel/${Id}?web=5`, config).then(res => {
                setRooms(res.data)
                setData(res.data)
                setDataCount(res.data.length)
                console.log(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [])

    const donwloadQrcode = async (source) => {

        const fileName = source.split('/').pop()
        const el = document.createElement("a")
        el.setAttribute("href", source)
        el.setAttribute("target", '_black')
        el.setAttribute("download", fileName)
        document.body.appendChild(el)
        el.click()
        el.remove()
      }

      const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
      
      const Submit = (room_number, qrcode) => {
        const user = JSON.parse(localStorage.getItem('userData'))
        openInNewTab(`http://localhost:8000/pdfroom/${user.hotel.code}/${room_number}/${qrcode}`)
        
      }

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
            const room_number = `${item.room_number} `
            const startsWith = room_number.toLowerCase().startsWith(value.toLowerCase()) 

            const includes = room_number.toLowerCase().startsWith(value.toLowerCase()) 

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

    const deleteRoom = (room) => {
        
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
                axiosInstance.delete(`/rooms/${room}`)
                .then(() => {
                    const userData = JSON.parse(localStorage.getItem('userData'))
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userData.accessToken}`
                        }
                    }
                    if (userData) {
                        // fetch rooms
                        axiosInstance.get(`/getRoomsByHotel?hotel_id=${id}&web=5`, config).then(res => {
                            setRooms(res.data)
                            setData(res.data)
                            setDataCount(res.data.length)
                            setSearchValue('')
                        }).catch(err => {
                            console.log(err)
                        })
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

        /* if (isUserLoggedIn() !== null) {
            const user = JSON.parse(localStorage.getItem('userData'))

            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            // Delete Room
            axiosInstance.delete(`/rooms/${room}`, config).then(res => {
                
                axiosInstance.get(`/getRoomsByHotel?hotel_id=${id}&web=5`, config).then(res => {
                    setRooms(res.data)
                    setData(res.data)
                    setDataCount(res.data.length)
                    setSearchValue('')
                }).catch(err => {
                    console.log(err)
                })
                //console.log(data)
            }).catch(err => {
                console.log(err)
            })
        } */
    }

    const columns = [
                {
                    name: 'Room Number',
                    minWidth: '297px',
                    selector: 'room_number',
                    sortable: true,
                    cell: row => row.room_number
                },
                {
                    name: 'Actions',
                    minWidth: '350px',
                    cell: row => (
                                <div className='d-flex align-items-space-between'>
                                    <a className="btn btn-danger"  onClick={() => deleteRoom(row.id)}>delete</a>
                                    <Link to={`/apps/rooms/edit/${Id}/${row.id}`}>
                                        <Button.Ripple className="ml-1" color='primary'>
                                            Edit
                                        </Button.Ripple>
                                    </Link>
                                    <Button.Ripple 
                                    className="ml-1"
                                        color='success'
                                        onClick={(e) => { Submit(row.room_number, row.qrcode) }}
                                        >
                                        Generate PDF
                                    </Button.Ripple>
                                
                                </div>
                                
                               
                    )
                },
                {
                    name: 'Qrcode',
                    minWidth: '100px',  
                    cell: row => (
                                <div className='d-flex align-items-center'>
                                   {/* { rooms.map((item) => { return (<a className="btn btn-success" onClick={(e) => donwloadQrcode(`https://api.hotellom.com/img/hotels/hotel-${row.reference}.png`)}>Qrcode</a>) }) } */}
                                   <a className="btn btn-success" onClick={(e) => donwloadQrcode(`https://api.hotellom.com/img/rooms/room-${row.room_number}${row.qrcode}.png`)}>Qrcode</a>
                                </div>
                               
                    )
                }
            ]

    return (
        <Fragment>
            <Card>
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
                         <Link to={`/apps/rooms/add/${Id}`}>
                            <Button.Ripple color='primary'>
                            Add New Room
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
        </Fragment>
    )
}

export default RoomsList