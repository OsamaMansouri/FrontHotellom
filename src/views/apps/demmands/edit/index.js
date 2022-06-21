// ** React Imports
import React, { useState, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
// ** Third Party Components
import { Row, Col, FormGroup, Label, Input, CustomInput, FormFeedback, Alert, Button, Card, CardBody } from 'reactstrap'
// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import { X, Coffee, Edit } from 'react-feather'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'

const ToastContent = ({ demmand }) => (
  <>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Success</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>Request '{demmand}' has been successfully updated !</span>
    </div>
  </>
)

const RequestEdit = () => {

  const { id } = useParams()
  const history = useHistory()

  const [demmand, setDemmand] = useState({})
  const [errors, setErrors] = useState({})
  const [options, setOptions] = useState([])

  // ** Function to get category on mount
  useEffect(() => {
    axiosInstance
      .get(`/demmands/${id}`)
      .then(response => {
        setDemmand(response.data)
        setOptions(response.data.options)
        console.log(response.data)
      })
      .catch(err => console.log(err))
  }, [])

  const addOption = () => { 
    const id = (Math.floor(Math.random() * Date.now())).toString()
    setOptions([...options, { id, name: '' }])
  }

  const setOptionName = (id, value) => {
    const newOptions = options.map(option => {
      if (id === option.id) {
        option.name = value
      }

      return option
    })

    setOptions(newOptions)
  }

  const deleteOption = (option_index) => {
    options.splice(option_index, 1)

    setOptions([...options])
  }

  const [checked, setChecked] = React.useState(false)

  const handleChange = () => {
      setChecked(!checked)
      setDemmand({ ...demmand, isEmpthy: !checked })
  }

  const checkboxStyle = {
      height: '25px',
      width: '50px'
  }

  const handleFormSubmit = () => {
    const formData = new FormData()
    formData.append("_method", 'PUT')

    if (demmand.id) formData.append('id', demmand.id)
    if (demmand.name) formData.append('name', demmand.name)
    if (demmand.sequence) formData.append('sequence', demmand.sequence)
    if (demmand.icon) formData.append('icon', demmand.icon)
    if (demmand.isEmpthy) formData.append('isEmpthy', checked)
    if (options?.length) {
      for (let i = 0; i < options.length; i++) {
        formData.append(`options[${i}][id]`, options[i].id)
        formData.append(`options[${i}][name]`, options[i].name)
      }
    }

    for (const entry of formData.entries()) console.log(entry)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    axiosInstance.post(`/demmands/${id}`, formData, {config}).then(res => {
      toast.success(
        <ToastContent demmand={demmand.name} />,
        { transition: Slide, hideProgressBar: true, autoClose: 3000 }
      )
      history.push('/apps/demmands/list')
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
        <h1>Edit request</h1>
        <Row>
          <Col sm='3'>
            <Label for="name">Name</Label>
            <Input
              invalid={errors?.name !== undefined}
              type="text"
              id="name"
              placeholder='Enter request name'
              required
              value={demmand?.name || ''}
              onChange={(e) => setDemmand({ ...demmand, name: e.target.value })}
            />
            {errors?.name && <FormFeedback>{errors?.name[0]}</FormFeedback>}
          </Col>
          <Col sm='3'>
            <Label for="sequence">Sequence</Label>
            <Input
              invalid={errors?.sequence !== undefined}
              type="number"
              id="sequence"
              value={demmand?.sequence || ''}
              required
              onChange={(e) => setDemmand({ ...demmand, sequence: parseInt(e.target.value) })}
            />
            {errors.sequence && <FormFeedback> {errors.sequence[0]} </FormFeedback>}
          </Col> 
          <Col sm='3'>
            <Label style={customLabelStyle} for="icon">Icon</Label>
            <FormGroup>
                <img src={`${demmand.icon}`} width="100px" />
                <Label style={customInputStyle} for="icon" >
                  <Avatar size='md' color='warning' icon={<Edit size={18} />} />
                </Label>
                <input 
                  invalid={errors.icon !== undefined}
                  type="file" 
                  id="icon"
                  name="icon"
                  style={{visibility:"hidden"}}
                  onChange={(e) => setDemmand({ ...demmand, icon: e.target.files[0] })}
                   />
                   {errors.icon && <FormFeedback style={{ display: errors.icon ? 'block' : 'none' }}>{errors.icon[0]}</FormFeedback>}
              </FormGroup>
          </Col>
          <Col sm='3'>
            <label>
                <input type="checkbox"
                    checked={demmand.isEmpthy}
                    onChange={handleChange}
                    style={checkboxStyle}
                    id="isEmpthy" /> Is Empthy
            </label>
          </Col>
        </Row>
        <Row>
          <Col sm='' className='pt-1 d-flex justify-content-end align-items-end'>
            <Button color='success' onClick={addOption}>Add Option</Button>
          </Col>
        </Row>

        <br />
        {/* Request Options */}
        {
          options?.map((option, option_index) => {
            return (
              <div key={option.id} style={{ border: '1px solid black', padding: '1rem', marginTop: '1rem' }}>
                <Row>
                  <Col sm={10}>
                    <Label for={option.id}>Name</Label>
                    <Input
                      invalid={errors?.name !== undefined}
                      type="text"
                      id={option.id}
                      placeholder='Enter option name'
                      value={option.name || ''}
                      onChange={(e) => setOptionName(option.id, e.target.value)}
                    />
                  </Col>
                  <Col sm={2}>
                    <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteOption(option_index)} outline>
                      <X size={14} className='mr-50' />
                      <span>Delete</span>
                    </Button.Ripple>              
                  </Col>
                </Row>
                <br />
              </div>
            )
          })
        }
        <br />
        {/* Button Submit */}
        <Row>
          <Col sm='12' className='d-flex justify-content-center align-items-end'>
            <Button color='primary' onClick={handleFormSubmit}>Update Request</Button>
          </Col>
        </Row>
      </div>
      </CardBody>
    </Card>
  )
}

export default RequestEdit