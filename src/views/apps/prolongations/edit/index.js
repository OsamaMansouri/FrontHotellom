// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../../@core/api/axiosInstance'
import { Coffee } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'

const ToastContent = ({ message }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{message}</span>
    </div>
  </>
)

const ProlongationEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [prolongation, setProlongation] = useState({}),
    [errors, setErrors] = useState({}),
    history = useHistory()

  // ** Function to get prolongation on mount
  useEffect(() => {
    axiosInstance.get(`/prolongations/${id}`)
      .then(response => setProlongation(response.data))
      .catch(err => console.log(err))
  }, [])

  const handleFormSubmit = () => {

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData()
    formData.append('hotel_id', prolongation.hotel_id)
    if (prolongation.number_days) formData.append('number_days', prolongation.number_days)

    console.log(prolongation)
    axiosInstance.put(`/prolongations/${id}`, 'hello=world', config).then(res => {
      toast.success(
        <ToastContent message='Prolongation has been successfully updated !' />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/prolongations/list')
    }).catch(err => {
      console.log(err)
    })
  }

  return prolongation !== null && prolongation !== undefined ? (
    <div className='app-user-list'>
      <h1>Edit prolongation</h1>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <Label for="number_days">Start date</Label>
            <Input
              invalid={errors.number_days !== undefined}
              type="number"
              name="number_days"
              id="number_days"
              placeholder="Select number of days"
              value={prolongation.number_days || ''}
              onChange={(e) => setProlongation({ ...prolongation, number_days: e.target.value })}
            />
            {errors.number_days && <FormFeedback>{errors.number_days[0]}</FormFeedback>}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='6' className='d-flex justify-content-start align-items-center'>
          <Button color='primary' onClick={handleFormSubmit}>Update Prolongation</Button>
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>Prolongation not found</h4>
      <div className='alert-body'>
        Prolongation with id: {id} doesn't exist. Check list of all Prolongations: <Link to='/apps/prolongations/list'>Prolongations List</Link>
      </div>
    </Alert>
  )
}
export default ProlongationEdit
