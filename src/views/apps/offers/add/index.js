// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import React, { Component, useState, useEffect, Fragment } from 'react'
import { X, Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Card, CardBody, Input, Row, Col, Label, FormGroup, Button,
        FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter, CardImg } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { isBase64, image64toCanvasRef  } from '../../utils/checkImage'

const ToastContent = ({ offer }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Offer '{offer}' has been successfully added !</span>
        </div>
    </>
)

const ToastDiscount = () => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='warning' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold' color='warning'>warning</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Offer discount must be lower than 100 !</span>
        </div>
    </>
)

const OfferAdd = () => {
    // ** State
    const [offer, setOffer] = useState({description :''})
    const [types, setTypes] = useState([])
    const [errors, setErrors] = useState({})
    const [imgSrc, setImgSrc] = useState(null)
    const [previewImg, setPreviewImg] = useState("")
    const [imgSrcFinal, setImgSrcFinal] = useState(null)
    const [scrollInnerModal, setScrollInnerModal] = useState(false)
    const [crop, setCrop] = useState({
                                aspect: 1 / 1,
                                width: 200,
                                height: 200,
                                unit: 'px'
                            })
    const imagePreviewCanvasRef = React.createRef()
    const history = useHistory()
    const close = (
        <button type='button' className='ml-1 close'>
          <span>×</span>
        </button>
    )
    const [prixRed, setPrixRed] = useState(1)

    const imageMaxSize = 10000000 // bytes
    const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
    const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })
 
    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            const user = JSON.parse(localStorage.getItem('userData'))
            console.log(user)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            // fetch categories
            axiosInstance.get(`/types?hotel_id=${user.hotel_id}`, config).then(res => {
                setTypes(res.data.data)
            }).catch(err => {
                console.log(err.response.data)
            })

        }
    }, [])
    const userData = JSON.parse(localStorage.getItem('userData'))
    const hotel_id = userData.hotel_id

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
                    setPreviewImg(r.target.result)
                    
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
        const formData = new FormData()
        if (imgSrcFinal !== null) {
            if (isBase64(imgSrcFinal)) {
                formData.append('image', imgSrcFinal)
            } else {
                formData.append('image', imgSrc)
            }
        }
        
        if (offer.titre) formData.append('titre', offer.titre)
        if (offer.description) formData.append('description', offer.description)
        if (offer.prix) formData.append('prix', offer.prix)
        if (offer.startTime) formData.append('startTime', offer.startTime)
        if (offer.discount) formData.append('discount', offer.discount)
        if (offer.startDate) formData.append('startDate', offer.startDate)
        if (offer.endDate) formData.append('endDate', offer.endDate)
        //if (offer.Frequency) formData.append('Frequency', offer.Frequency)
        if (offer.type_id && offer.type_id !== '0') formData.append('type_id', offer.type_id)
        //formData.append('hotel_id', hotel_id)
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axiosInstance.post('/offers', formData, config).then(res => {
            toast.success(
                <ToastContent offer={offer.titre} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/offers/list')
        }).catch(err => {
            console.log(err.response.data.errors)
            setErrors(err.response.data.errors)
        })
        setScrollInnerModal(!scrollInnerModal)
    }

    const offerPreview = () => {
        const pr = offer.prix - ((offer.prix * offer.discount) / 100)
        setPrixRed(pr.toFixed(2))
        if (offer.discount > 100) {
            toast.success(
                <ToastDiscount />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
        } else {
            setScrollInnerModal(!scrollInnerModal)
        }
    }

    const modalStyle = {
        alignItems : 'center',
        textAlign : '-webkit-center',
        backgroundColor : '#36013f'
    }

    const toastStyle = {
        backgroundColor: '#00000057',
        fontSize: '12px',
        fontWeight: 'bold',
        color : '#ffffffc7'
    }

    const prixBarre = {
        color: 'rgb(54, 1, 63)',
        textDecoration: 'line-through',
        fontWeight: '600'
    }

    const prixSolde = {
        color: '#d3ac67'
    }

    const offerTitle = {
        textAlign: 'left',
        color: 'rgb(54, 1, 63)',
        fontWeight: '600'
    }

    const offerDesc = {
        textAlign: 'left'
    }

    const imgStyle = {
        height: '250px',
        width: '70%',
        margin: 'auto',
        objectFit: 'contain'
    }

    return (
        <Card>
            <CardBody>
            <div className='app-user-list'>
                <h1>Add new promotion</h1>  
                <Row>
                    <Col sm='8'>           
                        <Row>
                            <Col sm='12'>
                                <Label for="titre">Title</Label>
                                <Input
                                    invalid={errors.titre !== undefined}
                                    type="text"
                                    id="titre"
                                    placeholder='Enter promotion Title'
                                    required
                                    onChange={(e) => setOffer({ ...offer, titre: e.target.value })}
                                />
                                {errors.titre && <FormFeedback>{errors.titre[0]}</FormFeedback>}
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm='6'>
                                <Label for="type_id">Type</Label>
                                <Input
                                    invalid={errors.type_id !== undefined}
                                    type="select"
                                    id="type_id"
                                    defaultValue="0"
                                    required
                                    onChange={(e) => setOffer({ ...offer, type_id: parseInt(e.target.value) })}
                                >
                                    <option value='0' disabled>Select Type</option>
                                    {
                                        types.map(type => <option key={type.id} value={type.id}>{type.name}</option>)
                                    }
                                </Input>
                                {errors.type_id && <FormFeedback> {errors.type_id[0]} </FormFeedback>}
                            </Col>
                            <Col sm='6'>
                                <FormGroup>
                                    <Label for="startTime">Start time</Label>
                                    <Input
                                        invalid={errors.startTime !== undefined}
                                        type="time"
                                        name="startTime"
                                        id="startTime"
                                        placeholder="Select start time"
                                        onChange={(e) => setOffer({ ...offer, startTime: e.target.value })}
                                    />
                                    {errors.startTime && <FormFeedback>{errors.startTime[0]}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            {/* <Col sm='6'>
                                <Label for="Frequency">Frequency</Label>
                                <Input
                                    invalid={errors.Frequency !== undefined}
                                    type="number"
                                    id="Frequency"
                                    placeholder='Enter frequency'
                                    onChange={(e) => setOffer({ ...offer, Frequency: parseInt(e.target.value) })}
                                />
                                {errors.Frequency && <FormFeedback>{errors.Frequency[0]}</FormFeedback>}
                            </Col> */}
                        </Row>
                        <br />
                        <Row>
                            <Col sm='6'>
                                <FormGroup>
                                    <Label for="startDate">Start Date</Label>
                                    <Input
                                        invalid={errors.startDate !== undefined}
                                        type="date"
                                        id="startDate"
                                        required
                                        placeholder="Enter the promotion start date"
                                        onChange={(e) => setOffer({ ...offer, startDate: e.target.value })}
                                    />
                                    {errors.startDate && <FormFeedback>{errors.startDate[0]}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col sm='6'>
                                <FormGroup>
                                    <Label for="endDate">End Date</Label>
                                    <Input
                                        invalid={errors.endDate !== undefined}
                                        type="date"
                                        id="endDate"
                                        required
                                        placeholder="Enter the promotion endDate"
                                        onChange={(e) => setOffer({ ...offer, endDate: e.target.value })}
                                    />
                                    {errors.endDate && <FormFeedback>{errors.endDate[0]}</FormFeedback>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm='6'>
                                <FormGroup>
                                    <Label for="prix">Price</Label>
                                    <Input
                                        invalid={errors.prix !== undefined}
                                        type="number"
                                        id="prix"
                                        required
                                        placeholder="Enter the promotion prix"
                                        onChange={(e) => setOffer({ ...offer, prix: e.target.value })}
                                    />
                                    {errors.prix && <FormFeedback>{errors.prix[0]}</FormFeedback>}
                                </FormGroup>
                            </Col>
                            <Col sm='6'>
                                <FormGroup>
                                    <Label for="discount">Discount</Label>
                                    <Input
                                        invalid={errors.discount !== undefined}
                                        type="number"
                                        id="discount"
                                        required
                                        placeholder="Enter the promotion discount"
                                        onChange={(e) => setOffer({ ...offer, discount: e.target.value })}
                                    />
                                    {errors.discount && <FormFeedback>{errors.discount[0]}</FormFeedback>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm='12'>
                                <Label for="description">Description</Label>
                                <Input
                                    invalid={errors.description !== undefined}
                                    type="textarea"
                                    id="description"
                                    placeholder='Enter promotion description'
                                    required
                                    onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                                />
                                {errors.description && <FormFeedback>{errors.description[0]}</FormFeedback>}
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col sm='12' className='d-flex justify-content-center align-items-end'>
                                <Button color='primary' onClick={offerPreview}>Preview</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='4'>
                        <Card className='card-statistics' /* style={ { height: 220 } } */>
                            <CardBody className='statistics-body d-flex align-item-end'>
                                <Row style={{borderStyle: "dashed", padding: "15px", height:"400px", borderColor:"background: linear-gradient(118deg, #36013f, rgba(54, 1, 63, 0.7))"}} >
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
            </div>
            </CardBody>
            <div>
                <Modal
                scrollable 
                isOpen={scrollInnerModal} 
                toggle={() => setScrollInnerModal(!scrollInnerModal)}
                className={`modal-dialog-centered modal-md`}
                >
                <ModalHeader /* toggle={() => setScrollInnerModal(!scrollInnerModal)} */></ModalHeader>
                <ModalBody style={modalStyle} >
                    <Card>
                        {/* <CardImg top style={imgStyle} src={themeConfig.app.appLogoImage} alt='Card cap' /> */}
                        <CardImg top style={imgStyle} src={previewImg} alt='Card cap' />
                        <CardBody>
                            <Row>
                                <Col sm='8'>
                                    <div><h5 style={offerTitle} >{offer.titre}</h5></div>
                                    <div style={offerDesc}>{offer.description.substring(0, 60)} ...</div>
                                    <div></div>
                                </Col>
                                <Col sm='4'>
                                    <div><h3 style={prixBarre} >{offer.prix} MAD</h3></div>
                                    <div><h3 style={prixSolde} >{prixRed} MAD</h3></div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' outline onClick={() => setScrollInnerModal(!scrollInnerModal)}>Fermer</Button>
                    <Button color='primary' onClick={handleFormSubmit}>Create Promotion</Button>
                </ModalFooter>
                </Modal>
            </div>
        </Card>
    )
}

export default OfferAdd