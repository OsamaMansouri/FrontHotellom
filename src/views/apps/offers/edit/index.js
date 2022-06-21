

// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import React, { Component, useState, useEffect, Fragment } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Card, CardBody, Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback } from 'reactstrap'
import { isUserLoggedIn } from '@utils'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { isBase64, image64toCanvasRef  } from '../../utils/checkImage'
import { X, Coffee, Edit } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'

const ToastContent = ({ offer }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Offer '{offer}' has been successfully updated !</span>
    </div>
  </>
)

const OfferEdit = () => {

  const { id } = useParams()
  const history = useHistory()

  const [offer, setOffer] = useState({})
  const [errors, setErrors] = useState({})
  const [types, setTypes] = useState([])
  const [imgSrc, setImgSrc] = useState()
  const [imgSrcFinal, setImgSrcFinal] = useState(null)
  const [crop, setCrop] = useState({
                              aspect: 1 / 1,
                              width: 100,
                              height: 100,
                              unit: '%'
                          })
  const imagePreviewCanvasRef = React.createRef()

  const imageMaxSize = 10000000 // bytes
  const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
  const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => { return item.trim() })

  // ** Function to get category on mount
  useEffect(() => {
    

    axiosInstance
      .get(`/offers/${id}`)
      .then(response => {
        setOffer(response.data)

        const user = JSON.parse(localStorage.getItem('userData'))

        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }

        // fetch types
        axiosInstance
          .get(`/types?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            setTypes(res.data.data)
          })
          .catch(err => {
            console.log(err.response.data)
          })
      })
      .catch(err => console.log(err))

      
      /* const timer = setTimeout(() => {
        console.log('This will run after 3 second!')
        setImgSrc(offer.image)
      }, 3000) */
  }, [])
  const userData = JSON.parse(localStorage.getItem('userData'))
  const hotel_id = userData.hotel.id
  
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
                  setImgSrc(r.target.result)
                  setImgSrcFinal(r.target.result)
                  setOffer({ ...offer, image: r.target.result })
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
    formData.append("_method", 'PUT')

    /* if (imgSrcFinal !== null) {
      if (isBase64(imgSrcFinal)) {
          formData.append('image', imgSrcFinal)
      } else {
          formData.append('image', imgSrc)
      }
    } */

    if (offer.id) formData.append('id', offer.id)
    if (offer.titre) formData.append('titre', offer.titre)
    if (offer.description) formData.append('description', offer.description)
    if (offer.image) formData.append('image', offer.image)
    if (offer.prix) formData.append('prix', offer.prix)
    if (offer.startTime) formData.append('startTime', offer.startTime)
    if (offer.discount) formData.append('discount', offer.discount)
    if (offer.startDate) formData.append('startDate', offer.startDate)
    if (offer.endDate) formData.append('endDate', offer.endDate)
    //if (offer.Frequency) formData.append('Frequency', offer.Frequency)
    if (offer.type_id && offer.type_id !== '0') formData.append('type_id', offer.type_id)
    formData.append('hotel_id', hotel_id)
    for (const entry of formData.entries()) console.log(entry)
    
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    axiosInstance.post(`/offers/${id}`, formData, {config}).then(res => {
      toast.success(
        <ToastContent offer={offer.titre} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/offers/list')
    }).catch(err => {
      console.log(err.response.data.errors)
      setErrors(err.response.data.errors)
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

  return (
    <Card>
      <CardBody>
      <div className='app-user-list'>
        <h1>Update promotion</h1>
        <Row>
          <Col sm="12">
              <Row>
                <Col sm='12'>
                    <Label for="titre">Title</Label>
                    <Input
                        type="text"
                        id="titre"
                        name="titre"
                        placeholder='Enter promotion Title'
                        required
                        value={offer?.titre || ''}
                        onChange={(e) => setOffer({ ...offer, titre: e.target.value })}
                    />
                    {errors.titre && <FormFeedback>{errors.titre[0]}</FormFeedback>}
                </Col>
              </Row>
              <br/>
              <Row>
                <Col sm='6'>
                    <Label for="type_id">Type</Label>
                    <Input
                        invalid={errors.type_id !== undefined}
                        type="select"
                        id="type_id"
                        name="type_id"
                        value={offer?.type_id || 0}
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
                            required
                            value={offer?.startTime || ''}
                            onChange={(e) => setOffer({ ...offer, startTime: e.target.value })}
                        />
                        {errors.startTime && <FormFeedback>{errors.startTime[0]}</FormFeedback>}
                    </FormGroup>
                </Col>
               {/*  <Col sm='6'>
                    <Label for="Frequency">Frequency</Label>
                    <Input
                        invalid={errors.Frequency !== undefined}
                        type="number"
                        id="Frequency"
                        placeholder='Enter frequency'
                        value={offer?.Frequency || ''}
                        onChange={(e) => setOffer({ ...offer, Frequency: parseInt(e.target.value) })}
                    />
                    {errors.Frequency && <FormFeedback>{errors.Frequency[0]}</FormFeedback>}
                </Col> */}
              </Row>
              <br/>
              <Row>
                  <Col sm='6'>
                      <FormGroup>
                          <Label for="startDate">Start Date</Label>
                          <Input
                              invalid={errors.startDate !== undefined}
                              type="date"
                              id="startDate"
                              required
                              value={offer?.startDate || ''}
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
                              value={offer?.endDate || ''}
                              placeholder="Enter the promotion endDate"
                              onChange={(e) => setOffer({ ...offer, endDate: e.target.value })}
                          />
                          {errors.endDate && <FormFeedback>{errors.endDate[0]}</FormFeedback>}
                      </FormGroup>
                  </Col>
              </Row>
              <br/>
              <Row>
                  <Col sm='4'>
                      <FormGroup>
                          <Label for="prix">Price</Label>
                          <Input
                              invalid={errors.prix !== undefined}
                              type="number"
                              id="prix"
                              required
                              value={offer?.prix || ''}
                              placeholder="Enter the promotion prix"
                              onChange={(e) => setOffer({ ...offer, prix: e.target.value })}
                          />
                          {errors.prix && <FormFeedback>{errors.prix[0]}</FormFeedback>}
                      </FormGroup>
                  </Col>
                  <Col sm='4'>
                      <FormGroup>
                          <Label for="discount">Discount</Label>
                          <Input
                              invalid={errors.discount !== undefined}
                              type="number"
                              id="discount"
                              required
                              value={offer?.discount || ''}
                              placeholder="Enter the promotion discount"
                              onChange={(e) => setOffer({ ...offer, discount: e.target.value })}
                          />
                          {errors.discount && <FormFeedback>{errors.discount[0]}</FormFeedback>}
                      </FormGroup>
                  </Col>
                  <Col sm='4'>
                      <Label style={customLabelStyle} for="image">Image</Label>
                      <FormGroup>
                        <img src={`${offer.image}`} width="100px" />
                        <Label style={customInputStyle} for="image" >
                          <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                        </Label>
                        <input 
                          invalid={errors.image !== undefined}
                          type="file" 
                          id="image"
                          name="image"
                          style={{visibility:"hidden"}}
                          onChange={(e) => setOffer({ ...offer, image: e.target.files[0] })}
                          />
                          {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
                      </FormGroup>
                  </Col>
              </Row>
              <br/>
              <Row>
                  <Col sm='12'>
                      <Label for="description">Description</Label>
                      <Input
                          invalid={errors.description !== undefined}
                          type="textarea"
                          id="description"
                          placeholder='Enter promotion description'
                          required
                          value={offer?.description || ''}
                          onChange={(e) => setOffer({ ...offer, description: e.target.value })}
                      />
                      {errors.description && <FormFeedback>{errors.description[0]}</FormFeedback>}
                  </Col>
              </Row>
              <br />
              <Row>
                <Col sm='12' className='d-flex justify-content-center align-items-end'>
                  <Button color='primary' onClick={handleFormSubmit}>Update Promotion</Button>
                </Col>
              </Row>
          </Col>
          {/* <Col sm="4">
            <Card className='card-statistics' style={ { height: 220 } }>
                <CardBody className='statistics-body d-flex align-item-end'>
                    <Row style={{borderStyle: "dashed", padding: "15px", height:"400px", borderColor:"background: linear-gradient(118deg, #36013f, rgba(54, 1, 63, 0.7))"}} >
                        <Dropzone 
                        onDrop={handleOnDrop} multiple={false} maxSize={imageMaxSize} accept={acceptedFileTypes}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files    <em>(Only *.jpeg and *.png images will be accepted)</em></p>
                                </div>
                                </section>
                            )}
                        </Dropzone>
                        <br/>
                        { imgSrc !== null ? <div>
                                <ReactCrop 
                                    src={offer.image} 
                                    crop={crop} 
                                    onChange={handleOnCropChange} 
                                    onComplete={handleOnCropComplet}
                                    onImageLoaded={handleOnImageLoaded}
                                />
                                {<canvas style={{display:"none"}} ref={imagePreviewCanvasRef} ></canvas>}
                            </div> : ''
                        }
                        {errors.image && <FormFeedback style={{ display: errors.image ? 'block' : 'none' }}>{errors.image[0]}</FormFeedback>}
                    </Row>
                </CardBody>
            </Card>
          </Col> */}
        
        </Row>
      </div>
      </CardBody>
    </Card>
  )
}

export default OfferEdit