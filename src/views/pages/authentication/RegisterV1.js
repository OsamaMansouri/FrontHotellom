import { useState, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Facebook, Twitter, Mail, GitHub, Coffee } from 'react-feather'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button, Row, Col } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import BrandLogo from '../../components/logo/brandLogo'
import { useForm } from 'react-hook-form'
import Avatar from '@components/avatar'
import { toast, Slide } from 'react-toastify'
import axiosInstance from '../../../@core/api/axiosInstance'

const ToastContent = ({ hotel }) => (
  <>
      <div className='toastify-header'>
          <div className='title-wrapper'>
              <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
              <h6 className='toast-title font-weight-bold'>Success</h6>
          </div>
      </div>
      <div className='toastify-body'>
          <span>Your hotel '{hotel}' has been successfully created !</span>
      </div>
  </>
)

const RegisterV1 = () => {
  const RememberMe = () => {
    return (
      <Fragment>
        I agree to
        <a className='ml-25' href='/' onClick={e => e.preventDefault()}>
          privacy policy & terms
        </a>
      </Fragment>
    )
  }
  
  const { register, errors, handleSubmit } = useForm()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirPass] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [adress, setAdress] = useState('')
  const [ice, setIce] = useState('')
  const [ifs, setIfs] = useState('')
  const [rc, setRc] = useState('')
  const [rib, setRib] = useState('')
  const [hotelName, setHotelName] = useState('')
  const history = useHistory()


  const onSubmit = () => {

    const formData = new FormData()

    const config = {
      headers: {
          'content-type': 'multipart/form-data'
      }
    }

    formData.append('firstname', firstName)
    formData.append('lastname', lastName)
    formData.append('username', username)
    formData.append('password', password)
    formData.append('email', email)
    formData.append('name', hotelName)
    formData.append('city', city)
    formData.append('address', adress)
    formData.append('ice', ice)
    formData.append('if', ifs)
    formData.append('rc', rc)
    formData.append('rib', rib)

    axiosInstance.post('/registerHotel', formData, config).then(res => {
      toast.success(
          <ToastContent category={name} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/categories/list')
    }).catch(err => {
        console.log(err.response.data.errors)
    })

  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <BrandLogo />
            <Form className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='firstName'>
                      FirstName
                    </Label>
                    <Input type='text'
                   onChange={e => setFirstName(e.target.value)} id='firstName' placeholder='johndoe' autoFocus />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='lastName'>
                      LastName
                    </Label>
                    <Input type='text'
                   onChange={e => setLastName(e.target.value)} id='lastName' placeholder='barbosa' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='username'>
                      Username
                    </Label>
                    <Input type='text'
                   onChange={e => setUsername(e.target.value)} id='username' placeholder='johndoe' />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='email'>
                      Email
                    </Label>
                    <Input type='email'
                   onChange={e => setEmail(e.target.value)} id='email' placeholder='john@example.com' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='12'>
                  <FormGroup>
                    <Label className='form-label' for='name'>
                      Hotel Name
                    </Label>
                    <Input type='text'
                   onChange={e => setHotelName(e.target.value)} id='name' placeholder='Azaro Marrakech' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='3'>
                  <FormGroup>
                    <Label className='form-label' for='city'>
                      City
                    </Label>
                    <Input type='text'
                   onChange={e => setCity(e.target.value)} id='city' placeholder='Marrakech' />
                  </FormGroup>
                </Col>
                <Col sm='9'>
                  <FormGroup>
                    <Label className='form-label' for='adress'>
                      Address
                    </Label>
                    <Input type='text'
                   onChange={e => setAdress(e.target.value)} id='adress' placeholder='Jardin Agdal Num 202' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='ice'>
                      ICE
                    </Label>
                    <Input type='text'
                   onChange={e => setIce(e.target.value)} id='ice' placeholder='5873132' />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='rc'>
                      RC
                    </Label>
                    <Input type='number'
                   onChange={e => setRc(e.target.value)} id='rc' placeholder='523254' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='if'>
                      IF
                    </Label>
                    <Input type='number'
                   onChange={e => setIfs(e.target.value)} id='ifs' placeholder='6465531' />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='rib'>
                      RIB
                    </Label>
                    <Input type='number'
                   onChange={e => setRib(e.target.value)} id='rib' placeholder='6456546835416543' />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='password'>
                      Password
                    </Label>
                    <InputPasswordToggle
                   onChange={e => setPassword(e.target.value)} className='input-group-merge' id='password' />
                  </FormGroup>
                </Col>
                <Col sm='6'>
                  <FormGroup>
                    <Label className='form-label' for='confirm-password'>
                      Confirm Password
                    </Label>
                    <InputPasswordToggle
                   onChange={e => setConfirPass(e.target.value)} className='input-group-merge' id='confirm-password' />
                  </FormGroup>
                </Col>
              </Row>
              <Button.Ripple type='submit' color='primary' block>
                Sign up
              </Button.Ripple>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='mr-25'>Already have an account?</span>
              <Link to='/pages/login-v1'>
                <span>Sign in instead</span>
              </Link>
            </p> */}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default RegisterV1
