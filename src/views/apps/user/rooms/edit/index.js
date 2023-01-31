import { Fragment, useState, useEffect } from 'react'
import axiosInstance from '../../../../../@core/api/axiosInstance'
import { useHistory, useParams, Link } from 'react-router-dom'
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Table, Label, Input, Button } from 'reactstrap'
import { ChevronDown, Coffee } from 'react-feather'
import Avatar from '@components/avatar'
// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { toast, Slide} from 'react-toastify'

const RoomsEdit = () => {
   // ** State
   const { id } = useParams()
   const { room_id } = useParams()
   const history = useHistory()
   const [room, setroom] = useState('')
   const [errors, setErrors] = useState({})

   const ToastContent = ({ room }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Room {room} has been successfully Updated !</span>
        </div>
    </>
)

   const handleFormSubmit = () => {
       
       const formData = new FormData()
       formData.append('room_number', room)
       formData.append('hotel_id', id)
       formData.append('room_id', room_id)
       //for (const entry of formData.entries()) console.log(entry)

       const config = {
           headers: {
               'content-type': 'multipart/form-data'
           }
       }
       axiosInstance.post('/edit_room   ', formData, config).then(res => {
        toast.success(
            <ToastContent demmand={room} />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
        )
           history.push(`/apps/user/rooms/${id}`)
       }).catch(err => {
        console.log(err.response.data.errors)
        setErrors(err.response.data.errors)
    })
   }

   return (
       <Card>
           <CardBody>
               <div className='app-user-list'>
                   <h1>Update Room</h1>
                   <Row>
                       <Col sm="12">
                           <Row>
                           <Col sm='12'>
                            <Label for="room_number">Room Number</Label>
                            <Input
                                type="number"
                                name="room_number"
                                id="room_number"
                                placeholder='Enter Room Number'
                                required
                                onChange={(e) => setroom(e.target.value)}
                            />
                           
                        </Col>
                           </Row>
                           <br />
                           {/* Button Submit */}
                           <Row>
                               <Col sm='12' className='d-flex align-items-end'>
                                   <Button color='primary' onClick={handleFormSubmit}>Save Changes</Button>
                               </Col>
                           </Row>
                       </Col>
                   </Row>
                   
               </div>
           </CardBody>
       </Card>
   )
}

export default RoomsEdit