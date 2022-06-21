// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useState, useEffect } from 'react'
import { Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback, Card, CardBody, CardTitle } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'

const ToastContent = ({ staff }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>User '{staff}' has been successfully added !</span>
        </div>
    </>
)

const ManagerAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [staff, setStaff] = useState({})

    const [hotels, setHotels] = useState([])
    const [hotel, setHotel] = useState({})
    const [selectedHotel, setSelectedHotel] = useState()

    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
        // Fetch Hotels
        axiosInstance
        .get(`/hotels?web=1`)
        .then(res => { setHotels(res.data) })
        .catch(err => { console.log(err.data) })

    }, [])

    const handleFormSubmit = () => {
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const formData = new FormData()
        formData.append('hotel_id', selectedHotel)
        formData.append('is_manager', 1)


        if (staff.name) formData.append('name', staff.name)
        if (staff.email) formData.append('email', staff.email)
        if (staff.role) formData.append('role', 2)
        if (staff.etat) formData.append('etat', 1)


        //for (const entry of formData.entries()) console.log(entry)

        axiosInstance.post('/manager/add', formData, config).then(res => {
            toast.success(
                <ToastContent staff={staff.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/managers/list')
        }).catch(err => {
            console.log(err.response.data.errors)
            setErrors(err.response.data.errors)
            console.log(errors)
        })
    }

    const handelOnChange = (hotel) => {
        setSelectedHotel(hotel.target.value)
    }

    const renderHotels = () => {
        return (
            <Col xl='6' md='6' xs='12'>
              <Card className='card-statistics'>
                <CardBody className='statistics-body'>
                  <Row>
                    <Col xl='12' md='12' xs='12'>
                        <Label for="hotel_id">Filter By Hotel</Label>
                        <Input
                            type="select"
                            id="hotel_id"
                            defaultValue="0"
                            required
                            value={hotel.id}
                        >
                            <option value='0' selected>Select Hotel</option>
                            {
                                hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)
                            }
                        </Input>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
        )
    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new user</h1>
                    <Row>
                        <Col sm='6'>
                            <Label for="name">Name</Label>
                            <Input
                                invalid={errors.name !== undefined}
                                type="text"
                                name="name"
                                id="name"
                                placeholder='Enter user name'
                                required
                                onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                            />
                            {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
                        </Col>
                        <Col sm='6'>
                            <Label for="email">Email</Label>
                            <Input
                                invalid={errors.email !== undefined}
                                type="text"
                                name="email"
                                id="email"
                                placeholder='Enter email'
                                required
                                onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                            />
                            {errors.email && <FormFeedback> {errors.email[0]} </FormFeedback>}
                        </Col>
                    </Row>
                    <br />
                    <Row>
         

                        <Col sm='12'>
                            <Label for="etat">Hotels</Label>
                            <Input
                                type="select"
                                id="hotel_id"
                                defaultValue="0"
                                required
                                value={hotel.id}
                                onChange={handelOnChange}
                            >
                                <option value='0' selected>Select Hotel</option>
                                {
                                    hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)
                                }
                            </Input>
                            {errors.etat && <FormFeedback> {errors.etat[0]} </FormFeedback>}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col sm='12' className='d-flex justify-content-start align-items-center'>
                            <Button color='primary' onClick={handleFormSubmit}>Create User</Button>
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </Card>
    )
}

export default ManagerAdd