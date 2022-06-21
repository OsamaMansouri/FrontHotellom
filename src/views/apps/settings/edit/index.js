// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button, Card, CardBody } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { Coffee, Edit } from 'react-feather'
import { toast, Slide } from 'react-toastify'
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
      <span>General Setting has been successfully Updated !</span>
    </div>
  </>
)

const SettingEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [setting, setSetting] = useState({}),
    [errors, setErrors] = useState({}),
    history = useHistory()

  // ** Function to get type on mount
  useEffect(() => {
    axiosInstance
      .get(`/settings/${id}`)
      .then(response => setSetting(response.data))
      .catch(err => console.log(err))
  }, [])
 
  const handleFormSubmit = () => {

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData()
    formData.append("_method", 'PUT')
    if (setting.tax) formData.append('tax', setting.tax)
    if (setting.timer) formData.append('timer', setting.timer)
    if (setting.logo) formData.append('logo', setting.logo)

    //for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/settings/${id}`, formData, config).then(res => {
      toast.success(
        <ToastContent type={setting.tax} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/settings/list')
    }).catch(err => {
      console.log(err)
    })
  }

  const customInputStyle = {
    position: "absolute",
    left: "0px",
    top: "25px"
  }
  const customLabelStyle = {
    marginBottom : "20px",
    fontSize: "15px",
    fontWeight: "600"
  }

  return setting !== null && setting !== undefined ? (
    <Card>
      <CardBody>
        <div className='app-user-list'>
          <h1>Edit general setting</h1>
          <Row>
            <Col sm='3'>
              <Label for="timer">Timer</Label>
              <Input
                invalid={errors.timer !== undefined}
                type="number"
                name="timer"
                id="timer"
                placeholder='Enter timer'
                required
                value={setting.timer || ''}
                onChange={(e) => setSetting({ ...setting, timer: e.target.value })}
              />
              {errors.timer && <FormFeedback>{errors.timer[0]}</FormFeedback>}
            </Col>
            <Col sm='3'>
              <Label for="tax">Tax</Label>
              <Input
                invalid={errors.tax !== undefined}
                type="number"
                name="tax"
                id="tax"
                placeholder='Enter tax'
                required
                value={setting.tax || ''}
                onChange={(e) => setSetting({ ...setting, tax: e.target.value })}
              />
              {errors.tax && <FormFeedback>{errors.tax[0]}</FormFeedback>}
            </Col>
            <Col sm='3'>
              <Label style={customLabelStyle} for="logo">Logo</Label>
              <FormGroup>
                <img src={`${setting.logo}`} width="100px" />
                <Label style={customInputStyle} for="logo" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input
                  invalid={errors.logo !== undefined}
                  type="file"
                  id="logo"
                  name="logo"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setSetting({ ...setting, logo: e.target.files[0] })}
                />
                {/* <CustomInput
                  invalid={errors.logo !== undefined}
                  type="file"
                  id="logo"
                  name="logo"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setSetting({ ...setting, logo: e.target.files[0] })}
                /> */}
                {errors.logo && <FormFeedback style={{ display: errors.logo ? 'block' : 'none' }}>{errors.logo[0]}</FormFeedback>}
              </FormGroup>
            </Col>
            {/* <Col sm='3'>
              <FormGroup>
                <img src={`${setting.logo}`} width="100px" />
              </FormGroup>
            </Col> */}
          </Row>
          <br />
          <Row>
            <Col sm='6' className='d-flex justify-content-start align-items-center'>
              <Button color='primary' onClick={handleFormSubmit}>Update General Settings</Button>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>General Setting not found</h4>
      <div className='alert-body'>
        General Setting with id: {id} doesn't exist. Check General Setting: <Link to='/apps/settings/list'>General Setting</Link>
      </div>
    </Alert>
  )
}
export default SettingEdit
