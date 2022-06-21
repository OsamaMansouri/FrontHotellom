// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useState, useEffect } from 'react'
import { Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, Form, FormFeedback, Card, CardBody } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'

const ToastContent = ({ ShopName }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Point of sale '{ShopName}' has been successfully added !</span>
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

const ValidePdf = () => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Warning</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>PDF Is Required !</span>
        </div>
    </>
)

const ShopAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [shop, setShop] = useState({})
    const [types, setTypes] = useState([])
    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            const user = JSON.parse(localStorage.getItem('userData'))
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            // fetch types
            axiosInstance.get(`/types`, config).then(res => {
                setTypes(res.data.data)
            }).catch(err => {
                console.log(err.response.data)
            })
        }
    }, [])

    const handleFormSubmit = () => {
        const formData = new FormData()
        //formData.append('hotel_id', userData.hotel.id)
        if (shop.name) formData.append('name', shop.name)
        if (shop.type_id && shop.type_id !== '0') formData.append('type_id', shop.type_id)
        if (shop.pdf_file) formData.append('pdf_file', shop.pdf_file)
        if (shop.color && shop.color !== '0') formData.append('color', shop.color) 
        formData.append('menu', 'menu')
        if (shop.sequence) formData.append('sequence', shop.sequence)
        if (shop.size) formData.append('size', shop.size)
        if (shop.startTime) formData.append('startTime', shop.startTime)
        if (shop.endTime) formData.append('endTime', shop.endTime)
        if (shop.description) formData.append('description', shop.description)
        
        const pdf_ext = shop.pdf_file !== undefined ? shop.pdf_file.name.split('.').pop() : ''
        if (shop.pdf_file === undefined) {
            toast.warning(
                <ValidePdf />,
                { transition: Slide, hideProgressBar: true, autoClose: 5000 }
            )
        } else if (shop.pdf_file.size > 6000000) {
            toast.warning(
                <PdfSize />,
                { transition: Slide, hideProgressBar: true, autoClose: 5000 }
            )
        } else if (pdf_ext !== 'pdf' && pdf_ext !== 'PDF') {
            toast.warning(
                <PdfExt />,
                { transition: Slide, hideProgressBar: true, autoClose: 5000 }
            )
        } else {
            axiosInstance.post('/shops', formData).then(response => {
                toast.success(
                    <ToastContent ShopName={shop.name} />,
                    { transition: Slide, hideProgressBar: true, autoClose: 3000 }
                )
                history.push('/apps/shops/list')
            }).catch(error => {
                setErrors(error.response.data.errors)
            })
        }
        

    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new point of sale</h1>
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
                                defaultValue="0"
                                required
                                onChange={(e) => setShop({ ...shop, type_id: parseInt(e.target.value) })}
                            >
                                <option value='0' disabled>Select Type</option>
                                {
                                    types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)
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
                            <select defaultValue={'medium'} name="size" className="form-control" id="size" onChange={(e) => setShop({ ...shop, size: e.target.value })}>
                                <option value="medium" disabled>Select Size</option>
                                <option value="big">Big</option>
                                <option value="medium">Medium</option>
                                <option value="small">Small</option>
                            </select>
                            {errors.size && <FormFeedback>{errors.size[0]}</FormFeedback>}
                        </Col>
                        <Col sm='4'>
                            <Label for="color">Color</Label>
                            <select defaultValue={'0'} name="color" className="form-control" id="color" onChange={(e) => setShop({ ...shop, color: e.target.value })}>
                                <option value="0" disabled>Select Color</option>
                                <option value="Gold">Gold</option>
                                <option value="Purple">Purple</option>
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
                                    onChange={(e) => setShop({ ...shop, description: e.target.value })}
                                />
                                {errors.description && <FormFeedback>{errors.description[0]}</FormFeedback>}
                            </FormGroup>
                        </Col>
                    </Row>
                    {/* <Row>
                     <Col sm='6'>
                            <CardBody>
                                <Form>
                                    <div className='demo-inline-spacing'>
                                        <FormGroup check inline>
                                            <Input type='checkbox' style={{transform:'scale(2)', marginRight:'1.3125rem'}} defaultChecked id='basic-cb-checked' />
                                            <Label for='basic-cb-checked' check>
                                                Is Room Service
                                            </Label>
                                        </FormGroup>
                                    </div>
                                </Form>  
                            </CardBody> 
                        </Col>
                    </Row> */}
                    <br />
                    <Row>
                        <Col sm='6' className='d-flex justify-content-start align-items-center'>
                            <Button color='primary' onClick={handleFormSubmit}>Create point of sale</Button>
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </Card>
    )
}

export default ShopAdd