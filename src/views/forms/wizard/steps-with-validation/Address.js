import { Fragment, useState } from 'react'

import axiosInstance from '../../../../@core/api/axiosInstance'

import classnames from 'classnames'
import Avatar from '@components/avatar'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight, Coffee } from 'react-feather'
import { Label, FormGroup, Row, Col, Button, Form, Input } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
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


const Address = ({ stepper, accountData, hotelData, rooms}) => {
  const { register, errors, handleSubmit, trigger } = useForm()
  const [hotelStaffs, setHotelStaffs] = useState({})
  const history = useHistory()

  const handleChange = (e) => {
    setHotelStaffs({
      ...hotelStaffs,
      [e.target.id]: e.target.value
    })
  }

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      
      const token = JSON.parse(localStorage.getItem('accessToken'))
      axiosInstance.post(
        '/users',
        { ...accountData, hotelData, rooms, hotelStaffs, source: 'hottelom' },
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
     //stepper.next()
    }
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Enter Room services Infos.</h5>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`room_services_email`}>
              Email
            </Label>
            <Input
              type='text'
              id={`room_services_email`}
              name={`room_services_email`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`room_services_email`] })}
            />
          </FormGroup>
      
        </Row>
        <div className='content-header'>
          <h5 className='mb-0'>Enter receptionist Infos.</h5>
        </div>
        <Row>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`receptionist_email`}>
              Email
            </Label>
            <Input
              type='email'
              name={`receptionist_email`}
              id={`receptionist_email`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`receptionist_email`] })}
            />
          </FormGroup>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple>

          <Button.Ripple type='submit' color='success' className='btn-submit'>
            Submit
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default Address
