import { useState } from 'react'
import Repeater from '@components/repeater'
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { X, Plus } from 'react-feather'
//import axiosInstance from '../../api/axiosInstance'
import axios from 'axios'


const RepeatingForm = (props) => {
  const handleChange = e => {
    const room = {
      id: parseInt(e.target.id),
      number: e.target.value
    }
    const rooms = [...props.roomsData]
    const roomIndex = rooms.findIndex(item => item.id === e.target.id)
    rooms.splice(roomIndex, 1, room)
    props.setRoomsData(rooms)
  } 

  const increaseCount = (e) => {
    const newRoom = {
      id: props.roomsData[props.roomsData.length - 1].id + 1,
      number:''
    }
    console.log('new room', {newRoom})
    const rooms = [...props.roomsData, newRoom]
    props.setRoomsData(rooms)
  }

  const deleteForm = e => {
    e.preventDefault()
    e.target.closest('form').remove()
  }


  return (
    <Card>
      <CardHeader>
        <h4 className='card-title'>Manage Rooms</h4>
      </CardHeader>

      <CardBody>
          {props.roomsData.map(room => (
            <Form key={room.id}>
              <Row className='justify-content-between align-items-center'>
                <Col md={3}>
                  <FormGroup>
                    <Label for={room.id}>Room Number</Label>
                    <Input type='text' id={room.id} value={room.number} onChange={handleChange} />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <Button.Ripple color='danger' className='text-nowrap px-1' onClick={deleteForm} outline>
                    <X size={14} className='mr-50' />
                    <span>Delete</span>
                  </Button.Ripple>
                </Col>
                <Col sm={12}>
                  <hr />
                </Col>
              </Row>
            </Form>
          ))}
        <Button.Ripple className='btn-icon' color='primary' onClick={increaseCount}>
          <Plus size={14} />
          <span className='align-middle ml-25'>Add New Room</span>
        </Button.Ripple>
      </CardBody>
    </Card>
  )
}

export default RepeatingForm
