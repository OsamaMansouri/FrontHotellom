// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button, CardBody, Card } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { Coffee } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'

const ToastContent = ({ ShopName }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Point of sale '{ShopName}' has been successfully updated !</span>
    </div>
  </>
)

const PdfSize = () => (
  <>
      <div className='toastify-header'>
          <div className='title-wrapper'>
              <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
              <h6 className='toast-title font-weight-bold'>Warning</h6>
          </div>
      </div>
      <div className='toastify-body'>
          <span>PDF Size Must Be 6 Mb Max !</span>
      </div>
  </>
)

const PdfExt = () => (
  <>
      <div className='toastify-header'>
          <div className='title-wrapper'>
              <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
              <h6 className='toast-title font-weight-bold'>Warning</h6>
          </div>
      </div>
      <div className='toastify-body'>
          <span>Please Select A PDF File !</span>
      </div>
  </>
)

const ShopEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [shop, setShop] = useState({}),
    [errors, setErrors] = useState({}),
    [types, setTypes] = useState([]),
    history = useHistory()

  // ** Function to get shop on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'))

    const config = {
      headers: {
          Authorization: `Bearer ${user.accessToken}`
      }
    }

    axiosInstance.get(`/shops/${id}`)
    .then(response => setShop(response.data))
    .catch(error => console.log(error))

    // fetch types
    axiosInstance.get(`/types`, config)
    .then(res => { setTypes(res.data.data) })
    .catch(err => {  console.log(err.response.data) })

  }, [])
 
  const handleFormSubmit = () => {

    const formData = new FormData()
    formData.append("_method", 'PUT')
    //formData.append('hotel_id', shop.hotel_id)
    if (shop.name) formData.append('name', shop.name)
    if (shop.type_id) formData.append('type_id', shop.type_id)
    if (shop.pdf_file) formData.append('pdf_file', shop.pdf_file)
    if (shop.color && shop.color !== '0') formData.append('color', shop.color) 
    formData.append('menu', 'menu')
    if (shop.sequence) formData.append('sequence', shop.sequence)
    if (shop.size) formData.append('size', shop.size)
    if (shop.startTime) formData.append('startTime', shop.startTime)
    if (shop.endTime) formData.append('endTime', shop.endTime)
    if (shop.description) formData.append('description', shop.description)

    const pdf_ext = shop.pdf_file === undefined ? shop.pdf_file.name.split('.').pop() : ''
    if (shop.pdf_file === undefined) {
      if (shop.pdf_file.size > 6000000) {
          toast.warning(
              <PdfSize />,
              { transition: Slide, hideProgressBar: true, autoClose: 5000 }
          )
      } else if (pdf_ext !== 'pdf' && pdf_ext !== 'PDF') {
          toast.warning(
              <PdfExt />,
              { transition: Slide, hideProgressBar: true, autoClose: 5000 }
          )
      }
    } else {
      axiosInstance.post(`/shops/${id}`, formData)
      .then(response => {
        toast.success(
          <ToastContent ShopName={shop.name} />,
          { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
        history.push('/apps/shops/list')
      })
      .catch(error => {  console.log(error) })
    }

  }

  return shop !== null && shop !== undefined ? (
    <Card>
      <CardBody>
        <div className='app-user-list'>
          <h1>Edit point of sale</h1>
          <Row>
              <Col sm='6'>
                  <Label for="name">Name</Label>
                  <Input
                      invalid={errors.name !== undefined}
                      type="text"
                      name="name"
                      id="name"
                      placeholder='Enter shop name'
                      required
                      value={shop.name || ''}
                      onChange={(e) => setShop({ ...shop, name: e.target.value })}
                  />
                  {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
              </Col>
              <Col sm='6'>
                <Label for="type_id">Type</Label>
                <Input
                  invalid={errors.type_id !== undefined}
                  type="select"
                  id="type_id"
                  value={shop.type_id}
                  required
                  onChange={(e) => setShop({ ...shop, type_id: parseInt(e.target.value) })}
                >
                  <option value='0' disabled>Select Type</option>
                  {
                    types.map(shop => <option key={shop.id} value={shop.id}>{shop.name}</option>)
                  }
                </Input>
                {errors.type_id && <FormFeedback> {errors.type_id[0]} </FormFeedback>}
              </Col> 
          </Row>
          <br />
          <Row>
              <Col sm='4'>
                  <Label for="sequence">Sequence</Label>
                  <Input
                      invalid={errors.sequence !== undefined}
                      type="number"
                      name="sequence"
                      id="sequence"
                      placeholder='Enter sequence number'
                      required
                      value={shop.sequence || ''}
                      onChange={(e) => setShop({ ...shop, sequence: e.target.value })}
                  />
                  {errors.sequence && <FormFeedback> {errors.sequence[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                  <FormGroup>
                      <Label for="startTime">Start time</Label>
                      <Input
                          invalid={errors.startTime !== undefined}
                          type="time"
                          name="startTime"
                          id="startTime"
                          placeholder="Select start time"
                          required
                          value={shop.startTime || ''}
                          onChange={(e) => setShop({ ...shop, startTime: e.target.value })}
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
                          required
                          value={shop.endTime || ''}
                          onChange={(e) => setShop({ ...shop, endTime: e.target.value })}
                      />
                      {errors.endTime && <FormFeedback>{errors.endTime[0]}</FormFeedback>}
                  </FormGroup>
              </Col>
          </Row>
          <br />
          <Row>
              <Col sm='4'>
                  <Label for="size">Size</Label>
                  <select name="size" className="form-control" id="size" onChange={(e) => setShop({ ...shop, size: e.target.value })}>
                      <option value="medium" disabled>Select Size</option>
                      <option value="big" selected={`${shop.size === "big" ? "selected" : ""}`}>Big</option>
                      <option value="medium" selected={`${shop.size === "medium" ? "selected" : ""}`}>Medium</option>
                      <option value="small" selected={`${shop.size === "small" ? "selected" : ""}`}>Small</option>
                  </select>
                  {errors.size && <FormFeedback>{errors.size[0]}</FormFeedback>}
              </Col>
              <Col sm='4'>
                  <Label for="color">Color</Label>
                  <select name="color" className="form-control" id="color" onChange={(e) => setShop({ ...shop, color: e.target.value })}>
                      <option value="0">Select Color</option>
                      <option value="Gold" selected={`${shop.color === "Gold" ? "selected" : ""}`}>Gold</option>
                      <option value="Purple" selected={`${shop.color === "Purple" ? "selected" : ""}`}>Purple</option>
                  </select>
                  {errors.color && <FormFeedback> {errors.color[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                  <FormGroup>
                      <Label for="pdf_file">PDF</Label>
                      <CustomInput
                          invalid={errors.pdf_file !== undefined}
                          type="file"
                          id="pdf_file"
                          name="pdf_file"
                          onChange={(e) => setShop({ ...shop, pdf_file: e.target.files[0] })}
                      />
                      {errors.pdf_file && <FormFeedback style={{ display: errors.pdf_file ? 'block' : 'none' }}>{errors.pdf_file[0]}</FormFeedback>}
                  </FormGroup> 
              </Col>
          </Row>
          <br />
          <Row>
              <Col sm='12'>
                  <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                          invalid={errors.description !== undefined}
                          type="textarea"
                          name="description"
                          id="description"
                          placeholder="Enter shop description"
                          required
                          value={shop.description || ''}
                          onChange={(e) => setShop({ ...shop, description: e.target.value })}
                      />
                      {errors.description && <FormFeedback>{errors.description[0]}</FormFeedback>}
                  </FormGroup>
              </Col>
          </Row>
          <br />
          <Row>
              <Col sm='6' className='d-flex justify-content-start align-items-center'>
                  <Button color='primary' onClick={handleFormSubmit}>Update point of sale</Button>
              </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Point of sale not found</h4>
      <div className='alert-body'>
        Point of sale with id: {id} doesn't exist. Check list of all Shops: <Link to='/apps/shops/list'>Point of sale List</Link>
      </div>
    </Alert>
  )
}

export default ShopEdit
