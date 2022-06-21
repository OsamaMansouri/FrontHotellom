import { Fragment, useState } from 'react'
import Select from 'react-select'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Coffee } from 'react-feather'
import { selectThemeColors, isObjEmpty } from '@utils'
import { Label, FormGroup, Row, Col, Button, Form, Input } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import RepeatingForm from '../../form-repeater/RepeatingForm'
import Avatar from '@components/avatar'
import '@styles/react/libs/react-select/_react-select.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useHistory } from 'react-router'

const ToastContent = ({ error, message }) => (
  <>
    <div className='toastify-header'>
      {!error &&
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
          <h6 className='toast-title font-weight-bold'>Success</h6>
        </div>
      }
    </div>
    <div className='toastify-body'>
      <span className={error && 'text-danger'}>{message}</span>
    </div>
  </>
)

const PersonalInfo = ({ stepper, type, accountData }) => {
  const { register, errors, handleSubmit, trigger } = useForm()
  const [hotelFormData, setHotelFormData] = useState({})
  const [hotelData, setHotelData] = useState(hotelFormData)
  const history = useHistory()
  const [roomsData, setRoomsData] = useState([
    {
      id: 0,
      number: ''
    }
  ])
  const [rooms, setRooms] = useState(roomsData)

  const handleChange = (e) => {
    setHotelFormData({
      ...hotelFormData,
      [e.target.id]: e.target.value
    })
  }


  const onSubmit = () => {
    //const token = JSON.parse(localStorage.getItem('accessToken'))
    const token = localStorage.getItem('accessToken')
    trigger()
    if (isObjEmpty(errors)) {
      setHotelData(hotelFormData)
      setRooms(roomsData)
      stepper.next()
      axiosInstance.post(
        '/users',
        { ...accountData, hotelFormData, roomsData, source: 'hottelom' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).then(response => {
        if (response.status === 201) {
          toast.success(
            <ToastContent message={`Hotel '${response.data.hotel.name}' created successfully !`} />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
          )
          history.push('/apps/user/list')
        }
      }).catch(error => {
        toast.error(
          <ToastContent error message="Error occured, please provide valid values and try again !" />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
      })
    }
  }

  const countryOptions = [
    { value: 'UK', label: 'UK' },
    { value: 'USA', label: 'USA' },
    { value: 'Spain', label: 'Spain' },
    { value: 'France', label: 'France' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Australia', label: 'Australia' }
  ]

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'French', label: 'French' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Japanese', label: 'Japanese' }
  ]

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Hotel Info</h5>
        <small>Enter Hotel Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`name`}>
              Name
            </Label>
            <Input
              type='text'
              name={`name`}
              id={`name`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`name`] })}
            />
          </FormGroup>
        </Row>
        <Row>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`city`}>
              City
            </Label>
            <Input
              type='text'
              name={`city`}
              id={`city`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`city`] })}
            />
          </FormGroup>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`address`}>
              Adress
            </Label>
            <Input
              type='text'
              name={`address`}
              onChange={handleChange}
              id={`address`}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`address`] })}
            />
          </FormGroup>
        </Row>
        <div className='content-header'>
          <h5 className='mb-0'>Rooms Info</h5>
        </div>
        <Col sm={12}>
          <RepeatingForm roomsData={roomsData} setRoomsData={setRoomsData} />
        </Col>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple>
          {/* <Button.Ripple type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple> */}
          <Button.Ripple type='submit' color='success' className='btn-submit'>
            Submit
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default PersonalInfo
