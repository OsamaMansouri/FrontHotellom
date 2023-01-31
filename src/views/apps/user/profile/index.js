import { Fragment, useState, useEffect } from 'react'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { Row, Col, Button, Card, CardImg, CardBody, Label, Input } from 'reactstrap'
import { useHistory } from 'react-router-dom'
// ** Config
import themeConfig from '@configs/themeConfig'
import { toast, Slide } from 'react-toastify'
import { Coffee } from 'react-feather'
import '@styles/react/pages/page-profile.scss'
import Avatar from '@components/avatar'

const ToastContent = () => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Your profile has been successfully updated !</span>
    </div>
  </>
)

const Profile = () => {
  const [data, setData] = useState(null)
  const history = useHistory()
  const [block, setBlock] = useState(false)
  const [userD, setUserD] = useState({}),
  [errors, setErrors] = useState({})

  const userData = JSON.parse(localStorage.getItem('userData'))
  useEffect(() => {
    console.log(userData)
    setUserD(userData)
  }, [])

  const handleFormSubmit = () => {

    const formData = new FormData()
    formData.append("_method", 'PUT')
    if (userD.firstname) formData.append('firstname', userD.firstname)
    if (userD.lastname) formData.append('lastname', userD.lastname)
    if (userD.email) formData.append('email', userD.email)
    if (userD.phone_number) formData.append('phone_number', userD.phone_number)
    if (userD.password) formData.append('password', userD.password)
    //for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/update/profile`, formData).then(res => {
      setUserD(res.data)
      localStorage.setItem('userData', JSON.stringify(res.data))
      history.push('/apps/staff/list')
      toast.success(
        <ToastContent />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
    }).catch(err => {
      console.log(err)
    })

  }

  return (
    <Fragment>
      
        <div id='user-profile'>
          <Row>
            <Col sm='12'>
            <Card className='profile-header mb-2'>
              <CardImg src={themeConfig.app.appLogoImage} alt='User Profile Image' top />
              <div className='position-relative'>
                <div className='profile-img-container d-flex align-items-center'>
                  <div className='profile-title ml-3'></div>
                </div>
              </div>
            </Card>
            </Col>
          </Row>
          <section id='profile-info'>
            <Row>
              <Col lg={{ size: 12, order: 1 }} sm={{ size: 12 }} xs={{ order: 1 }}>
              <Card>
                <CardBody>
                  <h1>Update Profile</h1>
                  <br />
                  <Row>
                    <Col sm='6'>
                      <Label for="firstname">Firtname</Label>
                      <Input 
                        invalid={errors.firstname !== undefined}
                        type="text" 
                        id="firstname"
                        name="firstname"
                        placeholder='Enter firstname'
                        required
                        value={userD.firstname || ''}
                        onChange={(e) => setUserD({ ...userD, firstname: e.target.value })}
                      />
                      {errors.firstname && <FormFeedback>{errors.firstname[0]}</FormFeedback>}
                    </Col>
                    <Col sm='6'>
                      <Label for="lastname">Lastname</Label>
                      <Input 
                        invalid={errors.lastname !== undefined}
                        type="text" 
                        id="lastname"
                        name="lastname"
                        placeholder='Enter lastname'
                        required
                        value={userD.lastname || ''}
                        onChange={(e) => setUserD({ ...userD, lastname: e.target.value })}
                      />
                      {errors.lastname && <FormFeedback>{errors.lastname[0]}</FormFeedback>}
                    </Col>
                  </Row>
                  <Row>
                  <Col sm='6'>
                      <Label for="password">Password</Label>
                      <Input 
                        invalid={errors.password !== undefined}
                        type="password" 
                        id="password"
                        name="password"
                        placeholder='Enter password'
                        required
                        value={userD.password || ''}
                        onChange={(e) => setUserD({ ...userD, password: e.target.value })}
                      />
                      {errors.password && <FormFeedback>{errors.password[0]}</FormFeedback>}
                    </Col>
                    <Col sm='6'>
                      <Label for="phone_number">Phone</Label>
                      <Input 
                        invalid={errors.phone_number !== undefined}
                        type="text" 
                        id="phone_number"
                        name="phone_number"
                        placeholder='Enter phone_number'
                        required
                        value={userD.phone_number || ''}
                        onChange={(e) => setUserD({ ...userD, phone_number: e.target.value })}
                      />
                      {errors.phone_number && <FormFeedback>{errors.phone_number[0]}</FormFeedback>}
                    </Col>
                    <Col sm='12'>
                      <Label for="email">Email</Label>
                      <Input 
                        invalid={errors.email !== undefined}
                        type="text" 
                        id="email"
                        name="email"
                        placeholder='Enter email'
                        required
                        value={userD.email || ''}
                        onChange={(e) => setUserD({ ...userD, email: e.target.value })}
                      />
                      {errors.email && <FormFeedback>{errors.email[0]}</FormFeedback>}
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col className='text-center' sm='12'>
                      <Button color='primary' onClick={handleFormSubmit}>
                        Update profile
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              </Col>
            </Row>
          </section>
        </div>
    </Fragment>
  )
}

export default Profile
