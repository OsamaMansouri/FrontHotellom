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

const StaffAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [staff, setStaff] = useState({})
    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
    }, [])

    const handleFormSubmit = () => {
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const formData = new FormData()
        formData.append('hotel_id', userData.hotel_id)
        if (staff.name) formData.append('name', staff.name)
        if (staff.email) formData.append('email', staff.email)
        if (staff.role) formData.append('role', staff.role)
        if (staff.etat !== null)formData.append('etat', 'active')
        if (staff.etat) formData.append('etat', staff.etat)

        //for (const entry of formData.entries()) console.log(entry)

        axiosInstance.post('/staff/add', formData, config).then(res => {
            toast.success(
                <ToastContent staff={staff.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/staff/list')
        }).catch(err => {
            console.log(err.response.data.errors)
            setErrors(err.response.data.errors)
            console.log(errors)
        })
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
                        <Col sm='6'>
                            <Label for="role">Role</Label>
                            <select defaultValue={'0'} name="role" className="form-control" id="role" onChange={(e) => setStaff({ ...staff, role: e.target.value })}>
                                <option value='0' disabled>Select Role</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="rooms-servant">Rooms service</option>
                                <option value="housekeeping">HK / Eng</option>
                                <option value="manager">Manager</option>
                            </select>
                            {errors.role && <FormFeedback> {errors.role[0]} </FormFeedback>}
                        </Col>
                        <Col sm='6'>
                            <Label for="etat">Status</Label>
                            <select defaultValue={'0'} name="etat" className="form-control" id="etat" onChange={(e) => setStaff({ ...staff, etat: e.target.value })}>
                                <option value='active' disabled>Select Status</option>
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
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

export default StaffAdd