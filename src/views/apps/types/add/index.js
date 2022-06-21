// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useState, useEffect } from 'react'
import { Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback, Card, CardBody } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'

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

const ImageSize = () => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Warning</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>File Size Must Be 3 Mb Max !</span>
        </div>
    </>
)

const ImageTest = () => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Warning</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>You Must Select Both Images !</span>
        </div>
    </>
)

const TypeAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [type, setType] = useState({})
    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
    }, [])

    const handleFormSubmit = () => {

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const formData = new FormData()
        formData.append('hotel_id', userData.hotel.id)
        if (type.name) formData.append('name', type.name)
        if (type.gold_img) formData.append('gold_img', type.gold_img)
        if (type.purple_img) formData.append('purple_img', type.purple_img)
        
        if (type.gold_img === undefined || type.purple_img === undefined) {
            toast.warning(
                <ImageTest />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
        } else if (type.gold_img.size > 300000 || type.purple_img.size > 300000) {
            console.log("File Size Must Be 3 Mb Max")
            toast.warning(
                <ImageSize />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
        } else {
            axiosInstance.post('/types', formData, config).then(res => {
                toast.success(
                    <ToastContent type={type.name} />,
                    { transition: Slide, hideProgressBar: true, autoClose: 3000 }
                )
                history.push('/apps/types/list')
            }).catch(err => {
                console.log(err.response.data.errors)
                setErrors(err.response.data.errors)
                console.log(errors)
            })
        }
        
    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new type</h1>
                    <Row>
                        <Col sm='6'>
                            <Label for="name">Name</Label>
                            <Input
                                invalid={errors.name !== undefined}
                                type="text"
                                name="name"
                                id="name"
                                placeholder='Enter type name'
                                required
                                onChange={(e) => setType({ ...type, name: e.target.value })}
                            />
                            {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
                        </Col>
                        <Col sm='6'>
                            <FormGroup>
                                <Label for="gold_img">Gold Image</Label>
                                <CustomInput
                                    invalid={errors.gold_img !== undefined}
                                    type="file"
                                    id="gold_img"
                                    name="gold_img"
                                    onChange={(e) => setType({ ...type, gold_img: e.target.files[0] })}
                                />
                                {errors.gold_img && <FormFeedback style={{display: errors.gold_img ? 'block' : 'none'}}>{errors.gold_img[0]}</FormFeedback>}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm='6'>
                            <FormGroup>
                                <Label for="purple_img">Purple Image</Label>
                                <CustomInput
                                    invalid={errors.purple_img !== undefined}
                                    type="file"
                                    id="purple_img"
                                    name="purple_img"
                                    onChange={(e) => setType({ ...type, purple_img: e.target.files[0] })}
                                />
                                {errors.purple_img && <FormFeedback style={{display: errors.purple_img ? 'block' : 'none'}}>{errors.purple_img[0]}</FormFeedback>}
                            </FormGroup>
                        </Col>
                        <Col sm='6' className='d-flex justify-content-start align-items-center'>
                            <Button color='primary' onClick={handleFormSubmit}>Create Type</Button>
                        </Col>
                    </Row>
                </div>
            </CardBody>
        </Card>
    )
}

export default TypeAdd