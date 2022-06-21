import axiosInstance from '../../../../@core/api/axiosInstance'
// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { toast, Slide } from 'react-toastify'
import { Box, Edit, DownloadCloud } from 'react-feather'
import Avatar from '@components/avatar'
/* import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download' */
import UrlImageDownloader from 'react-url-image-downloader'

// ** Third Party Components
import { Card, CardBody, Row, Col, Alert, Label, FormGroup, FormFeedback, Input, Button } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'
import CardTitle from 'reactstrap/lib/CardTitle'
import axios from 'axios'

const HotelEdit = () => {
  // ** States & Vars
  const { id } = useParams()
  const [hotel, setHotel] = useState({})
  const [errors, setErrors] = useState({})
  const history = useHistory()
  // ** Function to toggle tabs
  const toggle = tab => setActiveTab(tab)

  const ToastContent = ({ hotel }) => (
    <>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Box size={12} />} />
          <h6 className='toast-title font-weight-bold'>Success</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span>Hotel '{hotel}' has been successfully updated !</span>
      </div>
    </>
  )

  const user = JSON.parse(localStorage.getItem('userData'))
  const config = {
      headers: {
          Authorization: `Bearer ${user.accessToken}`
      }
  }

  // ** Function to get user on mount
  useEffect(() => {
    // fetch hotel
    axiosInstance.get(`/hotels/${id}`, config).then(res => {
        setHotel(res.data)
        console.log(res.data)
    }).catch(err => {
        console.log(err.response.data)
    })

  }, [])

  const customInputStyle = {
    position: "absolute",
    left: "100px",
    bottom: "-15px"
  }

  const donwloadQrcode = async (source) => {
    console.log(source)

    /* axios({
      url: source,
      mode: 'no-cors',
      method: 'GET',
      responseType: 'blob',
      'Content-Type': null
    })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "file.jpg")
      document.body.appendChild(link)
      link.click()
    }) */

    /* axios.get("http://127.0.0.1:8000/storage/hotels/hotel-109.png", {
      responseType: 'blob'
    }).then(res => {
      fileDownload(res.data, "hotelimage.png")
    }) */

    /* axios.get("http://127.0.0.1:8000/storage/hotels/hotel-109.png", {
      responseType: 'blob'
    }).then(res => {
      fileDownload(res.data, "hotelimage.png")
    }) */

    //saveAs(source, 'jhkghkg.png')

    //browser.downloads.download({url: source})

    /* const image = await fetch(source)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'image file name here'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) */
  
    const fileName = source.split('/').pop()
    const el = document.createElement("a")
    el.setAttribute("href", source)
    el.setAttribute("target", '_black')
    el.setAttribute("download", fileName)
    document.body.appendChild(el)
    el.click()
    el.remove()

    /* axios({
      url: "https://i.postimg.cc/9MFvz25j/movingtogether-primary-804744d5605a360dc6a2faca9183c51f.jpg",
      method: 'GET'
    })
      .then((response) => response.blob())
      .then((blob) => {
      const blobUrl = window.URL.createObjectURL(new Blob([blob]))
      console.log(blobUrl)
      const a = document.createElement('a')
      a.setAttribute("download", "fileName")
      a.href = blobUrl
      document.body.appendChild(a)
      a.click()
      a.remove()
    }) */

    /* const xhr = new XMLHttpRequest()
    xhr.open("GET", source, true)
    xhr.responseType = "blob"
    xhr.onload = function() {
        const urlCreator = window.URL || window.webkitURL
        const imageUrl = urlCreator.createObjectURL(this.response)
        const tag = document.createElement('a')
        tag.href = imageUrl
        tag.download = "hotel-name"
        document.body.appendChild(tag)
        tag.click()
        document.body.removeChild(tag)
    }
    xhr.send() */

    //const image = await fetch("http://127.0.0.1:8000/storage/hotels/hotel-109.png")
    //Split image name
    /* const nameSplit = originalImage.split("/")
    const  duplicateName = nameSplit.pop()
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL
    link.download = ""+duplicateName+""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) */

    /* axios({
      url: 'http://127.0.0.1:8000/storage/hotels/hotel-109.png',
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      saveAs(new Blob([response.data]))
    }) */

    /* const element = document.createElement("a")
    const file = new Blob(["https://images.ctfassets.net/hrltx12pl8hq/61DiwECVps74bWazF88Cy9/2cc9411d050b8ca50530cf97b3e51c96/Image_Cover.jpg?fit=fill&w=480&h=270"], { type: "image/*" }
    )
    element.href = URL.createObjectURL(file)
    element.download = "img.png"
    element.click() */

    /* axios({
      url: 'http://127.0.0.1:8000/storage/hotels/hotel-109.png',
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.png')
      document.body.appendChild(link)
      link.click()
    }) */

    /* console.log(e.target.href)
    fetch(e.target.href, {
      method: "GET",
      headers: {}
    })
      .then(response => {
        response.arrayBuffer().then(function(buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "image.png") //or any other extension
          document.body.appendChild(link)
          link.click()
        })
      })
      .catch(err => {
        console.log(err)
      }) */

      //Working Fine
      /* axios({
        url: "https://i.postimg.cc/9MFvz25j/movingtogether-primary-804744d5605a360dc6a2faca9183c51f.jpg",
        mode: 'no-cors',
        method: 'GET',
        responseType: 'blob'
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "file.jpg")
        document.body.appendChild(link)
        link.click()
      }) */
  }

  const handleFormSubmit = () => {

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData()
    formData.append("_method", 'PUT')
    if (hotel.name) formData.append('name', hotel.name)
    if (hotel.address) formData.append('address', hotel.address)
    if (hotel.status) formData.append('status', hotel.status)
    if (hotel.city) formData.append('city', hotel.city)
    if (hotel.country) formData.append('country', hotel.country)
    if (hotel.ice) formData.append('ice', hotel.ice)
    if (hotel.rib) formData.append('rib', hotel.rib)
    if (hotel.idf) formData.append('idf', hotel.idf)
    if (hotel.rc) formData.append('rc', hotel.rc)
    if (hotel.reason) formData.append('reason', hotel.reason)
    if (hotel.comment) formData.append('comment', hotel.comment)
    for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/hotels/${id}`, formData, config).then(res => {
      toast.success(
        <ToastContent hotel={hotel.name} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/user/list')
    }).catch(err => {
      setErrors(err.response.data.errors)
    })
  }

  return hotel !== null && hotel !== undefined ? (
    <Row className='app-user-edit'>
      <Col sm='12'>
        <Card>
          <CardBody className='pt-2'>
          <CardTitle><h1> Hotel Informations</h1></CardTitle>
            <Row>
              <Col sm='6'>
                <Label for="name">Name</Label>
                <Input
                  invalid={errors.name !== undefined}
                  type="text"
                  name="name"
                  id="name"
                  placeholder='Enter hotel name'
                  required
                  value={hotel.name || ''}
                  onChange={(e) => setHotel({ ...hotel, name: e.target.value })}
                />
                {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
              </Col>
              <Col sm='6'>
                <Label for="address">Address</Label>
                <Input
                  invalid={errors.address !== undefined}
                  type="text"
                  name="address"
                  id="address"
                  placeholder='Enter hotel address'
                  required
                  value={hotel.address || ''}
                  onChange={(e) => setHotel({ ...hotel, address: e.target.value })}
                />
                {errors.address && <FormFeedback>{errors.address[0]}</FormFeedback>}
              </Col>
            </Row>
            <br/>
            <Row>
              <Col sm='4'>
                <Label for="city">City</Label>
                <Input
                  invalid={errors.city !== undefined}
                  type="text"
                  name="city"
                  id="city"
                  placeholder='Enter city'
                  required
                  value={hotel.city || ''}
                  onChange={(e) => setHotel({ ...hotel, city: e.target.value })}
                />
                {errors.city && <FormFeedback> {errors.city[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                <Label for="country">country</Label>
                <Input
                  invalid={errors.country !== undefined}
                  type="text"
                  name="country"
                  id="country"
                  placeholder='Enter country'
                  required
                  value={hotel.country || ''}
                  onChange={(e) => setHotel({ ...hotel, country: e.target.value })}
                />
                {errors.country && <FormFeedback> {errors.country[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                <Label for="ice">ICE</Label>
                <Input
                  invalid={errors.ice !== undefined}
                  type="text"
                  name="ice"
                  id="ice"
                  placeholder='Enter ICE'
                  value={hotel.ice || ''}
                  onChange={(e) => setHotel({ ...hotel, ice: e.target.value })}
                />
                {errors.ice && <FormFeedback> {errors.ice[0]} </FormFeedback>}
              </Col>
            </Row>
            <br/>
            <Row>
              <Col sm='4'>
                <Label for="idf">IF</Label>
                <Input
                  invalid={errors.idf !== undefined}
                  type="text"
                  name="idf"
                  id="idf"
                  placeholder='Enter idf'
                  required
                  value={hotel.idf || ''}
                  onChange={(e) => setHotel({ ...hotel, idf: e.target.value })}
                />
                {errors.idf && <FormFeedback> {errors.idf[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                <Label for="rc">RC</Label>
                <Input
                  invalid={errors.rc !== undefined}
                  type="text"
                  name="rc"
                  id="rc"
                  placeholder='Enter rc'
                  required
                  value={hotel.rc || ''}
                  onChange={(e) => setHotel({ ...hotel, rc: e.target.value })}
                />
                {errors.rc && <FormFeedback> {errors.rc[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                <Label for="rib">RIB</Label>
                <Input
                  invalid={errors.rib !== undefined}
                  type="text"
                  name="rib"
                  id="rib"
                  placeholder='Enter rib'
                  value={hotel.rib || ''}
                  onChange={(e) => setHotel({ ...hotel, rib: e.target.value })}
                />
                {errors.rib && <FormFeedback> {errors.rib[0]} </FormFeedback>}
              </Col>
            </Row>
            <br/>
            <Row>
              <Col sm='6'>
                <Label for="status">Status</Label>
                {/* <Input
                  invalid={errors.status !== undefined}
                  type="text"
                  name="status"
                  id="status"
                  placeholder='Enter status'
                  required
                  value={hotel.status || ''}
                  onChange={(e) => setHotel({ ...hotel, status: e.target.value })}
                /> */}
                <select defaultValue={'0'} name="status" className="form-control" id="status" onChange={(e) => setHotel({ ...hotel, status: e.target.value })}>
                    <option value='active'>Select Status</option>
                    <option value="active" selected={`${ hotel.status === "active" ? "selected" : ""}`}>Active</option>
                    <option value="inactive" selected={`${ hotel.status === "inactive" ? "selected" : ""}`}>Inactive</option>
                    <option value="closed" selected={`${ hotel.status === "closed" ? "selected" : ""}`}>Closed</option>
                </select>
                {errors.status && <FormFeedback> {errors.status[0]} </FormFeedback>}
              </Col>
              <Col sm='6'>
                <Label for="reason">Reason</Label>
                <select defaultValue={'0'} name="reason" className="form-control" id="reason" onChange={(e) => setHotel({ ...hotel, reason: e.target.value })}>
                    <option value='Invoice Not Paid'>Select Reason</option>
                    <option value="Invoice Not Paid" selected={`${ hotel.reason === "Invoice Not Paid" ? "selected" : ""}`}>Invoice Not Paid</option>
                    <option value="Requested By The Hotel" selected={`${ hotel.reason === "Requested By The Hotel" ? "selected" : ""}`}>Requested By The Hotel</option>
                    <option value="End Of Contract" selected={`${ hotel.reason === "End Of Contract" ? "selected" : ""}`}>End Of Contract</option>
                    <option value="Collecting Agency" selected={`${ hotel.reason === "Collecting Agency" ? "selected" : ""}`}>Collecting Agency</option>
                    <option value="Change Of Ownership" selected={`${ hotel.reason === "Change Of Ownership" ? "selected" : ""}`}>Change of Ownership</option>
                    <option value="Operations" selected={`${ hotel.reason === "Operations" ? "selected" : ""}`}>Operations ( modifications,price,photos,stock availability..)</option>
                </select>
                {errors.status && <FormFeedback> {errors.reason[0]} </FormFeedback>}
              </Col>
              {/* <Col sm='6'>
                <Label for="reason">Reason</Label>
                <Input
                  invalid={errors.reason !== undefined}
                  type="text"
                  name="reason"
                  id="reason"
                  placeholder='Enter reason'
                  required
                  value={hotel.reason || ''}
                  onChange={(e) => setHotel({ ...hotel, reason: e.target.value })}
                />
                {errors.reason && <FormFeedback> {errors.reason[0]} </FormFeedback>}
              </Col> */}
              <Col sm='6'>
                <div>
                  {/* <img src={`http://127.0.0.1:8000/storage/hotels/hotel-${hotel.reference}.png`} width="100px" />
                  <Label style={customInputStyle} >
                    <Avatar 
                      size='md' 
                      color='success' 
                      style={{width:"40px", height:"40px", alignItems:"center", justifyContent:"center"}} 
                      icon={<DownloadCloud size={28} />} 
                      onClick={(e) => donwloadQrcode(`http://127.0.0.1:8000/storage/hotels/hotel-${hotel.reference}.png`)}
                      />
                  </Label> */}
                  {/* <a href={`http://127.0.0.1:8000/storage/hotels/hotel-${hotel.reference}.png`} target="_blank" rel="noopener noreferrer" download>
                    <Button>
                        <i className="fas fa-download"/>
                        Download File
                    </Button>
                  </a> */}
                  {/* <a href={`http://127.0.0.1:8000/storage/hotels/hotel-${hotel.reference}.png?force=true`}>Download</a> */}
                </div>
                 {/*  <UrlImageDownloader style={{width: "100px"}} imageUrl={`http://127.0.0.1:8000/storage/hotels/hotel-${hotel.reference}.png`} /> */}
              </Col>
            </Row>
            <br/>
            <Row>
              <Col sm='12'>
                <Label for="comment">Comment</Label>
                <Input
                  invalid={errors.comment !== undefined}
                  type="textarea"
                  name="comment"
                  id="comment"
                  placeholder='Enter Comment'
                  value={hotel.comment || ''}
                  onChange={(e) => setHotel({ ...hotel, comment: e.target.value })}
                />
                {errors.comment && <FormFeedback> {errors.comment[0]} </FormFeedback>}
              </Col>
            </Row>
            <br />
            <Row>
              <Col sm='12'>
                <Label for="lastu">Last Update</Label>
                <br />
                <Label for="lastu">{hotel.last_update}</Label>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col sm='6' className='d-flex justify-content-start align-items-center'>
                <Button color='primary' onClick={handleFormSubmit}>Update Info</Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Hotel not found</h4>
      <div className='alert-body'>
        Hotel with id: {id} doesn't exist. Check list of all Hotels: <Link to='/apps/user/list'>Hotels List</Link>
      </div>
    </Alert>
  )
}
export default HotelEdit
