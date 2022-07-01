// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'

// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button, Card, CardBody } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { Coffee } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

//Btn Style
const btnStyle = {
  marginLeft: "5px",
  padding:"0.386rem 0.9rem !important" 
}

const MySwal = withReactContent(Swal)

const ToastContent = ({ staff }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Category '{staff}' has been successfully updated !</span>
    </div>
  </>
)

const ToastEmail = ({ staff }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>The password for '{staff}' has been successfully updated !</span>
    </div>
  </>
)

const StaffEdit = () => {
  // ** States & Vars
  const
    { id } = useParams(),
    [staff, setStaff] = useState({}),
    [errors, setErrors] = useState({}),
    history = useHistory()

  // ** Function to get staff on mount
  useEffect(() => {
    axiosInstance
      .get(`/users/${id}`)
      .then(response => setStaff(response.data))
      .catch(err => console.log(err))
  }, [])

  const resetPassword = (id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "An email with the new Password will be sent to this User!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-warning ml-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        const formData = new FormData()
        formData.append("_method", 'PUT')
        formData.append('user_id', id)
        axiosInstance.post(`/users/resetPassword`, formData).then(res => {
          toast.success(
            <ToastEmail staff={staff.name} />,
            { transition: Slide, hideProgressBar: true, autoClose: 3000 }
          )
        }).catch(err => {
          console.log(err)
        })
        
      }
    })
  }
 
  const handleFormSubmit = () => {

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const formData = new FormData()
    formData.append("_method", 'PUT')
    formData.append('hotel_id', staff.hotel.id)
    formData.append('user_id', id)
    if (staff.name) formData.append('name', staff.name)
    if (staff.role) formData.append('role', staff.role)
    if (staff.email) formData.append('email', staff.email)
    if (staff.etat) formData.append('etat', staff.etat)

    for (const entry of formData.entries()) console.log(entry)

    axiosInstance.post(`/staff/update`, formData, config).then(res => {
      toast.success(
        <ToastContent staff={staff.name} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/managers/list')
    }).catch(err => {
      // console.log(err.response.data.errors)
      // setErrors(err.response.data.errors)
      console.log(err)
    })
  }

  return staff !== null && staff !== undefined ? (
    <Card>
      <CardBody>
        <div className='app-user-list'>
          <h1>Edit staff</h1>
          <Row>
              <Col sm='6'>
                  <Label for="name">Name</Label>
                  <Input
                      invalid={errors.name !== undefined}
                      type="text"
                      name="name"
                      id="name"
                      placeholder='Enter user name'
                      required
                      value={staff.name || ''}
                      onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                  />
                  {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
              </Col>
              <Col sm='6'>
                  <Label for="email">Email</Label>
                  <Input
                      invalid={errors.email !== undefined}
                      type="text"
                      name="email"
                      id="email"
                      placeholder='Enter email'
                      required
                      value={staff.email || ''}
                      onChange={(e) => setStaff({ ...staff, email: e.target.value })}
                  />
                  {errors.email && <FormFeedback> {errors.email[0]} </FormFeedback>}
              </Col>
          </Row>
          <br />
          <Row>
              <Col sm='4'>
                  <Label for="role">Role</Label>
                  <select defaultValue={'0'} name="role" className="form-control" id="role" onChange={(e) => setStaff({ ...staff, role: e.target.value })}>
                      <option value='0' disabled>Select Role</option>
                      <option value="4" selected={`${ (staff.roles === undefined || staff.roles[0].name === "receptionist") ? "selected" : ""}`}>Receptionist</option>
                      <option value="5" selected={`${ (staff.roles === undefined || staff.roles[0].name === "rooms-servant") ? "selected" : ""}`}>Rooms service</option>
                      <option value="6" selected={`${ (staff.roles === undefined || staff.roles[0].name === "housekeeping") ? "selected" : ""}`}>HK / Eng</option>
                      <option value="7" selected={`${ (staff.roles === undefined || staff.roles[0].name === "manager") ? "selected" : ""}`}>Manager</option>
                  </select>
                  {errors.role && <FormFeedback> {errors.role[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                  <Label for="etat">Status</Label>
                  <select defaultValue={'0'} name="etat" className="form-control" id="etat" onChange={(e) => setStaff({ ...staff, etat: e.target.value })}>
                      <option value='active'>Select Status</option>
                      <option value="active" selected={`${ staff.etat === "active" ? "selected" : ""}`}>active</option>
                      <option value="inactive" selected={`${ staff.etat === "inactive" ? "selected" : ""}`}>inactive</option>
                  </select>
                  {errors.etat && <FormFeedback> {errors.etat[0]} </FormFeedback>}
              </Col>
              <Col sm='4'>
                <Label for="resetPaswword">Reset password</Label><br />
                <Button.Ripple style={btnStyle} color='success' onClick={() => resetPassword(staff.id)} >
                    Reset Password
                </Button.Ripple>
              </Col>
          </Row>
          <br />
          <Row>
              <Col sm='12' className='d-flex justify-content-start align-items-center'>
                  <Button color='primary' onClick={handleFormSubmit}>Update User</Button>
              </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  ) : (
    <Alert color='danger'>
      <h4 className='alert-heading'>User not found</h4>
      <div className='alert-body'>
        User with id: {id} doesn't exist. Check list of all Users: <Link to='/apps/staff/list'>Users List</Link>
      </div>
    </Alert>
  )
}
export default StaffEdit
