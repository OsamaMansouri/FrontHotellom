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

const ToastContent = ({ type }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Type '{type}' has been successfully added !</span>
    </div>
  </>
)

const TypeEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [type, setType] = useState({}),
    [errors, setErrors] = useState({}),
    history = useHistory()

  // ** Function to get type on mount
  useEffect(() => {
    axiosInstance
      .get(`/types/${id}`)
      .then(response => setType(response.data))
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
    if (type.name) formData.append('name', type.name)
    if (type.gold_img) formData.append('gold_img', type.gold_img)
    if (type.purple_img) formData.append('purple_img', type.purple_img)

    for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/types/${id}`, formData, config).then(res => {
      toast.success(
        <ToastContent type={type.name} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/types/list')
    }).catch(err => {
      // console.log(err.response.data.errors)
      setErrors(err.response.data.errors)
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
  
  const btnStyleDisable = {
    disab: "none"
  }

  return type !== null && type !== undefined ? (
    <Card>
      <CardBody>
        <div className='app-user-list'>
          <h1>Edit type</h1>
          <Row>
            <Col sm='4'>
              <Label for="name">Name</Label>
              <Input
                invalid={errors.name !== undefined}
                type="text"
                name="name"
                id="name"
                disabled={type.name === "Room Service" ? 'disabled' : ''}
                placeholder='Enter type name'
                required
                value={type.name || ''}
                onChange={(e) => setType({ ...type, name: e.target.value })}
              />
              {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
            </Col>
            <Col sm='4'>
              <Label style={customLabelStyle} for="gold_img">Gold Image</Label>
              <FormGroup>
                <img src={`${type.gold_img}`} width="100px" />
                <Label style={customInputStyle} for="gold_img" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input
                  invalid={errors.purple_img !== undefined}
                  type="file"
                  id="gold_img"
                  name="gold_img"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setType({ ...type, gold_img: e.target.files[0] })}
                />
                {/* <CustomInput
                  invalid={errors.purple_img !== undefined}
                  type="file"
                  id="gold_img"
                  name="gold_img"
                  onChange={(e) => setType({ ...type, gold_img: e.target.files[0] })}
                /> */}
                {errors.gold_img && <FormFeedback style={{ display: errors.gold_img ? 'block' : 'none' }}>{errors.gold_img[0]}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col sm='4'>
                <Label style={customLabelStyle} for="purple_img">Purple Image</Label>
              <FormGroup>
                <img src={`${type.purple_img}`} width="100px" />
                <Label style={customInputStyle} for="purple_img" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input
                  invalid={errors.purple_img !== undefined}
                  type="file"
                  id="purple_img"
                  name="purple_img"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setType({ ...type, purple_img: e.target.files[0] })}
                />
                {errors.purple_img && <FormFeedback style={{ display: errors.purple_img ? 'block' : 'none' }}>{errors.purple_img[0]}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm='6' className='d-flex justify-content-start align-items-center'>
              <Button color='primary' onClick={handleFormSubmit}>Update Type</Button>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Type not found</h4>
      <div className='alert-body'>
        Type with id: {id} doesn't exist. Check list of all Types: <Link to='/apps/types/list'>Types List</Link>
      </div>
    </Alert>
  )
}
export default TypeEdit
