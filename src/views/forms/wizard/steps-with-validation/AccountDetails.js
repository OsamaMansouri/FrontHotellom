import * as yup from 'yup'
import { Fragment, useState } from 'react'
import classnames from 'classnames'
import { isObjEmpty } from '@utils'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Label, Input, FormGroup, Row, Col, Button } from 'reactstrap'

const AccountDetails = ({ stepper, setAccountData }) => {
  const [formData, setFormData] = useState({})

  const SignupSchema = yup.object().shape({
    [`firstname`]: yup.string().required(),
    [`lastname`]: yup.string().required(),
    [`email`]: yup.string().email().required()
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(SignupSchema)
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const onSubmit = () => {
    trigger()
    if (isObjEmpty(errors)) {
      setAccountData(formData)
      console.log('FormData', formData)
      stepper.next()
    }
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>User Infos</h5>
        <small className='text-muted'>Enter User Info.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
        <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`firstname`}>
              Firstname
            </Label>
            <Input
              name={`firstname`}
              id={`firstname`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`firstname`] })}
            />
          </FormGroup>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`lastname`}>
              Lastname
            </Label>
            <Input
              name={`lastname`}
              id={`lastname`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`lastname`] })}
            />
          </FormGroup>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`name`}>
              Username
            </Label>
            <Input
              name={`nme`}
              id={`name`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`name`] })}
            />
          </FormGroup>
          <FormGroup tag={Col} md='6'>
            <Label className='form-label' for={`email`}>
              Email
            </Label>
            <Input
              type='email'
              name={`email`}
              id={`email`}
              onChange={handleChange}
              innerRef={register({ required: true })}
              className={classnames({ 'is-invalid': errors[`email`] })}
            />
          </FormGroup>
        </Row>
        <div className='d-flex justify-content-between'>
          <Button.Ripple color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle mr-sm-25 mr-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button.Ripple>
          <Button.Ripple type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ml-sm-25 ml-0'></ArrowRight>
          </Button.Ripple>
        </div>
      </Form>
    </Fragment>
  )
}

export default AccountDetails
