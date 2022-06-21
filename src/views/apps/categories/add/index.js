// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import React, { Component, useEffect, useState, Fragment } from 'react'
import { Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback, Card, CardBody, CardTitle } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { isBase64, image64toCanvasRef  } from '../../utils/checkImage'

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

const CategorieAdd = () => {
    // ** State
    const [userData, setUserData] = useState(null)
    const [category, setCategory] = useState({})
    const [errors, setErrors] = useState({})
    const history = useHistory()
    const [imgSrc, setImgSrc] = useState(null)
    const [imgSrcFinal, setImgSrcFinal] = useState(null)
    const [crop, setCrop] = useState({
                                aspect: 1 / 1,
                                width: 200,
                                height: 200,
                                unit: 'px'
                            })
    const imagePreviewCanvasRef = React.createRef()

    const imageMaxSize = 10000000 // bytes
    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
        }
    }, [])

    const verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert(`This file is not allowed. ${currentFileSize} bytes is too large`)
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert(`This file is not allowed. ${currentFileType} Only images are allowed.`)
                return false
            }
            return true
        }
    }

    const handleOnImageLoaded = (image) => {}

    const handleOnDrop = (acceptedFiles, rejectedFiles) => {

        if (rejectedFiles && rejectedFiles.length > 0) {
            verifyFile(rejectedFiles)
        }

        if (acceptedFiles && acceptedFiles.length > 0) {
            
            const isVerified = verifyFile(acceptedFiles)
            if (isVerified) {
                const currentFile = acceptedFiles[0]
                const reader = new FileReader()
                reader.onload = r => {
                    //console.log(r.target.result)
                    setImgSrc(r.target.result)
                    
                }
                reader.readAsDataURL(acceptedFiles[0])
                  
            }
        }
    }

    const handleOnCropChange = crop => { 
        setCrop(crop)
    }

    const handleOnCropComplet = (crop) => {

        const canvasRef = imagePreviewCanvasRef.current
        const img = new Image()
        img.src = canvasRef.toDataURL()
        image64toCanvasRef(canvasRef, imgSrc, crop)
        setImgSrcFinal(img.src)
    }

    const handleFormSubmit = () => {

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        const formData = new FormData()
        if (imgSrcFinal !== null) {
            if (isBase64(imgSrcFinal)) {
                formData.append('icon', imgSrcFinal)
            } else {
                formData.append('icon', imgSrc)
            }
        }
        formData.append('hotel_id', userData.hotel_id)
        if (category.name) formData.append('name', category.name)
        if (category.Sequence) formData.append('Sequence', category.Sequence)
        if (category.startTime) formData.append('startTime', category.startTime)
        if (category.endTime) formData.append('endTime', category.endTime)
        /* if (category.icon) formData.append('icon', category.icon) */

        axiosInstance.post('/categories', formData, config).then(res => {
            toast.success(
                <ToastContent category={category.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/categories/list')
        }).catch(err => {
            setErrors(err.response.data.errors)
        })
    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new category</h1>
                    <Row>
                        <Col sm="8">
                            <Row>
                                <Col sm='8'>
                                    <Label for="name">Name</Label>
                                    <Input
                                        invalid={errors.name !== undefined}
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder='Enter category name'
                                        required
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
                                        onChange={(e) => setCategory({ ...category, Sequence: e.target.value })}
                                    />
                                    {errors.Sequence && <FormFeedback> {errors.Sequence[0]} </FormFeedback>}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col sm='6'>
                                    <FormGroup>
                                        <Label for="startTime">Start time</Label>
                                        <Input
                                            invalid={errors.startTime !== undefined}
                                            type="time"
                                            name="startTime"
                                            id="startTime"
                                            placeholder="Select start time"
                                            onChange={(e) => setCategory({ ...category, startTime: e.target.value })}
                                        />
                                        {errors.startTime && <FormFeedback>{errors.startTime[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col sm='6'>
                                    <FormGroup>
                                        <Label for="endTime">End time</Label>
                                        <Input
                                            invalid={errors.endTime !== undefined}
                                            type="time"
                                            name="endTime"
                                            id="endTime"
                                            placeholder="Select end time"
                                            onChange={(e) => setCategory({ ...category, endTime: e.target.value })}
                                        />
                                        {errors.endTime && <FormFeedback>{errors.endTime[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col sm='6' className='d-flex justify-content-start align-items-center'>
                                    <Button color='primary' onClick={handleFormSubmit}>Create Category</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="4">
                            <Card className='card-statistics' /* style={ { height: 220 } } */>
                                <CardBody className='statistics-body d-flex align-item-end'>
                                    <Row style={{borderStyle: "dashed", padding: "15px", borderColor:"background: linear-gradient(118deg, #36013f, rgba(54, 1, 63, 0.7))"}} >
                                        {/* <input accept="image/*" type='file' id="imgInp" /> */}
                                        <Dropzone 
                                        onDrop={handleOnDrop} multiple={false} maxSize={imageMaxSize} accept={acceptedFileTypes}>
                                            {({getRootProps, getInputProps}) => (
                                                <section>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <p>Drag 'n' drop some files here, or click to select files    {/* <em>(Only *.jpeg and *.png images will be accepted)</em> */}</p>
                                                </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                        <br/>
                                        { imgSrc !== null ? <div>
                                                <ReactCrop 
                                                    src={imgSrc} 
                                                    crop={crop} 
                                                    onChange={handleOnCropChange} 
                                                    onComplete={handleOnCropComplet}
                                                    onImageLoaded={handleOnImageLoaded}
                                                />
                                                {/* <br/>
                                                <p>Preview Canvas Crop </p> */}
                                                {<canvas style={{display:"none"}} ref={imagePreviewCanvasRef} ></canvas>}
                                                {/* <img src="" id="blah" style={ { height: 250 } } alt="Preview Of Downloaded Image" /> */}
                                            </div> : ''
                                        }
                                        {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col sm='6'>
                            <FormGroup>
                                <Label for="icon">Icon</Label>
                                <CustomInput
                                    invalid={errors.icon !== undefined}
                                    type="file"
                                    id="icon"
                                    name="icon"
                                    onChange={(e) => setCategory({ ...category, icon: e.target.files[0] })}
                                />
                                {errors.icon && <FormFeedback style={{display: errors.icon ? 'block' : 'none'}}>{errors.icon[0]}</FormFeedback>}
                            </FormGroup>
                        </Col>
                    </Row> */}
                </div>
            </CardBody>
        </Card>
    )
}

export default CategorieAdd