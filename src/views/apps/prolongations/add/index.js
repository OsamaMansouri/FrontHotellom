// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useState, useEffect } from 'react'
import { Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'

const ToastContent = ({ message }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>{message}</span>
        </div>
    </>
)

const ProlongationAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [token, setToken] = useState(null)
    const [prolongation, setProlongation] = useState({})
    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        setUserData(JSON.parse(localStorage.getItem('userData')))
        setToken(JSON.parse(localStorage.getItem('accessToken')))
    }, [])

    const handleFormSubmit = () => {

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }

        const formData = new FormData()
        formData.append('hotel_id', userData.hotel.id)
        if (prolongation.number_days) formData.append('number_days', prolongation.number_days)

        axiosInstance.post('/prolongations', formData, config).then(res => {
            toast.success(
                <ToastContent message='Prolongation has been successfully created !' />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/prolongations/list')
        }).catch(err => {
            // console.log(err.response.data.errors)
            // setErrors(err.response.data.errors)
            console.log(errors)
        })
    }

    return (
        <div className='app-user-list'>
            <h1>Add new prolongation</h1>
            <Row>
                <Col sm='6'>
                    <FormGroup>
                        <Label for="number_days">Number of days</Label>
                        <Input
                            invalid={errors.number_days !== undefined}
                            type="number"
                            name="number_days"
                            id="number_days"
                            placeholder="Select number of days"
                            onChange={(e) => setProlongation({ ...prolongation, number_days: e.target.value })}
                        />
                        {errors.number_days && <FormFeedback>{errors.number_days[0]}</FormFeedback>}
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col sm='6' className='d-flex justify-content-start align-items-center'>
                    <Button color='primary' onClick={handleFormSubmit}>Create Prolongation</Button>
                </Col>
            </Row>
        </div>
    )
}

export default ProlongationAdd