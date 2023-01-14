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

const ToastContent = ({ category }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Category '{category}' has been successfully added !</span>
    </div>
  </>
)

const CategoryEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [category, setCategory] = useState({}),
    [errors, setErrors] = useState({}),
    [shops, setShops] = useState(),
    history = useHistory()

  // ** Function to get category on mount
  useEffect(() => {
    axiosInstance
      .get(`/categories/${id}`)
      .then(response => setCategory(response.data))
      .catch(err => console.log(err))

      axiosInstance
      .get(`/SpaShops`)
      .then(res => { 
        setShops(res.data)
      })
      .catch(err => { console.log(err) })
  }, [])
 
  const handleFormSubmit = () => {

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData()
    formData.append("_method", 'PUT')
    //formData.append('hotel_id', category.hotel_id)
    if (category.name) formData.append('name', category.name)
    if (category.shop_id) formData.append('shop_id', shops.id)
    if (category.Sequence) formData.append('Sequence', category.Sequence)
    if (category.startTime) formData.append('startTime', category.startTime)
    if (category.endTime) formData.append('endTime', category.endTime)
    if (category.icon) formData.append('icon', category.icon)
    //for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/categories/${id}`, formData, config).then(res => {
      toast.success(
        <ToastContent category={category.name} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/categoriesSpa/list')
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

  return category !== null && category !== undefined ? (
    <Card>
      <CardBody>
        <div className='app-user-list'>
          <h1>Edit category</h1>
          <Row>
            <Col sm='4'>
              <Label for="name">Name</Label>
              <Input
                invalid={errors.name !== undefined}
                type="text"
                name="name"
                id="name"
                placeholder='Enter category name'
                required
                value={category.name || ''}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
              />
              {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
            </Col>
            <Col sm='4'>
              <Label for="sequence">Sequence</Label>
              <Input
                invalid={errors.Sequence !== undefined}
                type="number"
                name="sequence"
                id="sequence"
                placeholder='Enter sequence number'
                required
                value={category.Sequence || ''}
                onChange={(e) => setCategory({ ...category, Sequence: e.target.value })}
              />
              {errors.Sequence && <FormFeedback> {errors.Sequence[0]} </FormFeedback>}
            </Col>
            {/* <Col sm='4'>
              <Label for="types">Select Shop Type</Label>
              <Input
                  type="select"
                  name="shop_id"
                  id="shop_id"
                  required
                  onChange={(e) => setCategory({ ...category, shop_id: e.target.value})}
                  value={category.shop_id}
              >
                  <option value='0' selected>Select type</option>
                  {
                      shops.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)
                  }
              </Input>
          </Col> */}
          </Row>
          <br />
          <Row>
            <Col sm='4'>
              <FormGroup>
                <Label for="startTime">Start time</Label>
                <Input
                  invalid={errors.startTime !== undefined}
                  type="time"
                  name="startTime"
                  id="startTime"
                  placeholder="Select start time"
                  value={category.startTime || ''}
                  onChange={(e) => setCategory({ ...category, startTime: e.target.value })}
                />
                {errors.startTime && <FormFeedback>{errors.startTime[0]}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col sm='4'>
              <FormGroup>
                <Label for="endTime">End time</Label>
                <Input
                  invalid={errors.endTime !== undefined}
                  type="time"
                  name="endTime"
                  id="endTime"
                  placeholder="Select end time"
                  value={category.endTime || ''}
                  onChange={(e) => setCategory({ ...category, endTime: e.target.value })}
                />
                {errors.endTime && <FormFeedback>{errors.endTime[0]}</FormFeedback>}
              </FormGroup>
            </Col>
            <Col sm='4'>
              <Label style={customLabelStyle} for="icon">Icon</Label>
              <FormGroup>
                <img src={`${category.icon}`} width="100px" />
                <Label style={customInputStyle} for="icon" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input 
                  invalid={errors.icon !== undefined}
                  type="file" 
                  id="icon"
                  name="icon"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setCategory({ ...category, icon: e.target.files[0] })}
                   />
                   {errors.icon && <FormFeedback style={{ display: errors.icon ? 'block' : 'none' }}>{errors.icon[0]}</FormFeedback>}
              </FormGroup>
            </Col>
          </Row>
          <br />
          <Row>
            {/* <Col sm='6'>
              <FormGroup>
                <Label for="icon">Icon</Label>
                <CustomInput
                  invalid={errors.icon !== undefined}
                  type="file"
                  id="icon"
                  name="icon"
                  onChange={(e) => setCategory({ ...category, icon: e.target.files[0] })}
                />
                {errors.icon && <FormFeedback style={{ display: errors.icon ? 'block' : 'none' }}>{errors.icon[0]}</FormFeedback>}
              </FormGroup>
            </Col> */}
            
            <Col sm='6' className='d-flex justify-content-start align-items-center'>
              <Button color='primary' onClick={handleFormSubmit}>Update Category</Button>
            </Col>
          </Row>
          <br />
        </div>
      </CardBody>
    </Card>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Category not found</h4>
      <div className='alert-body'>
        Category with id: {id} doesn't exist. Check list of all Categories: <Link to='/apps/categories/list'>Category List</Link>
      </div>
    </Alert>
  )
}
export default CategoryEdit
