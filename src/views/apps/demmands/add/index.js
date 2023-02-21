// ** Styles
import '@styles/react/apps/app-users.scss'
import axiosInstance from '../../../../@core/api/axiosInstance'
import React, { useState, useEffect, Fragment } from 'react'
import { X, Coffee } from 'react-feather'
import { useHistory } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Button, CustomInput, FormFeedback, Card, CardBody } from 'reactstrap'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'

const ToastContent = ({ demmand }) => (
    <>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
                <h6 className='toast-title font-weight-bold'>Success</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span>Request '{demmand}' has been successfully added !</span>
        </div>
    </>
)

const RequestAdd = () => {
    // ** State
    const [demmand, setDemmand] = useState({})
    const [options, setOptions] = useState([])
    const [errors, setErrors] = useState({})
    const history = useHistory()

    const addOption = () => {
        const uid = (Math.floor(Math.random() * Date.now())).toString()
        setOptions([...options, { uid, name: ''}])
    }

    const setOptionName = (uid, value) => {
        const newOptions = options.map(option => {
            if (uid === option.uid) {
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

    const checkboxStyle = {
        height: '25px',
        width: '50px'
    }

    const [checked, setChecked] = React.useState(false)

    const handleChange = () => {
        setChecked(!checked)
        setDemmand({ ...demmand, isEmpthy: !checked })
    }

    const handleFormSubmit = () => {
        
        const formData = new FormData()
        if (demmand.name) formData.append('name', demmand.name)
        if (demmand.sequence) formData.append('sequence', demmand.sequence)
        if (demmand.icon) formData.append('icon', demmand.icon)
        if (demmand.isEmpthy) formData.append('isEmpthy', checked)
        if (options.length) {
            for (let i = 0; i < options.length; i++) {
                formData.append(`options[${i}][name]`, options[i].name)
                //formData.append(`options[${i}][sequence]`, options[i].sequence)
            }
        }
        //for (const entry of formData.entries()) console.log(entry)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axiosInstance.post('/demmands', formData, config).then(res => {
            toast.success(
                <ToastContent demmand={demmand.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/demmands/list')
        }).catch(err => {
            //console.log(err.response.data.errors)
            setErrors(err.response.data.errors)
        })
    }

    return (
        <Card>
            <CardBody>
                <div className='app-user-list'>
                    <h1>Add new Request</h1>
                    {/* Article Infos */}
                    <Row>
                        <Col sm="12">
                            <Row>
                                <Col sm='3'>
                                    <Label for="name">Name</Label>
                                    <Input
                                        invalid={errors.name !== undefined}
                                        type="text"
                                        id="name"
                                        placeholder='Enter request name'
                                        required
                                        onChange={(e) => setDemmand({ ...demmand, name: e.target.value })}
                                    />
                                    {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>}
                                </Col>
                                <Col sm='3'>
                                    <FormGroup>
                                        <Label for="sequence">Sequence</Label>
                                        <Input
                                            invalid={errors.sequence !== undefined}
                                            type="number"
                                            id="sequence"
                                            placeholder="Enter the request sequence"
                                            onChange={(e) => setDemmand({ ...demmand, sequence: e.target.value })}
                                        />
                                        {errors.sequence && <FormFeedback>{errors.sequence[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col sm='3'>
                                    <FormGroup>
                                        <Label for="image">Icon</Label>
                                        <CustomInput
                                            invalid={errors.icon !== undefined}
                                            type="file"
                                            id="icon"
                                            onChange={(e) => setDemmand({ ...demmand, icon: e.target.files[0] })}
                                        />
                                        {errors.icon && <FormFeedback style={{ display: errors.icon ? 'block' : 'none' }}>{errors.icon[0]}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col sm='3'>
                                    <FormGroup>
                                        <br/>
                                        {/* 
                                        <CustomInput 
                                            type='checkbox'
                                            className='' 
                                            id='isEmpthy'
                                            onChange={(e) => setDemmand({ ...demmand, isEmpthy: e.target.value })} 
                                            label='Is Empthy' /> */}
                                            <label>
                                                <input type="checkbox"
                                                    checked={checked}
                                                    onChange={handleChange}
                                                    style={checkboxStyle}
                                                    id="isEmpthy" /> Is Empthy
                                            </label>
                                    </FormGroup>    
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='' className='pt-1 d-flex justify-content-end align-items-end'>
                                    <Button color='success' onClick={addOption}>Add Option</Button>
                                </Col>
                            </Row>
                            <br/>
                            {/* Request Options */}
                            {
                                options.map((option, option_index) => {
                                    return (
                                        <div key={option.uid} style={{ border: '1px solid black', padding: '1rem', marginTop: '1rem' }}>
                                            <Row>
                                                <Col sm={10}>
                                                    <Label for={option.uid}>Name</Label>
                                                    <Input
                                                        invalid={errors.title !== undefined}
                                                        type="text"
                                                        id={option.uid}
                                                        placeholder='Enter option name'
                                                        onChange={(e) => setOptionName(option.uid, e.target.value)}
                                                    />
                                                    {/* {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>} */}
                                                </Col>
                                                <Col sm={2}>
                                                    <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteOption(option_index)} outline>
                                                        <X size={14} className='mr-50' />
                                                        <span>Delete</span>
                                                    </Button.Ripple>              
                                                </Col>
                                            </Row>
                                            <br/>
                                        </div>
                                    )
                                })
                            }
                            <br />
                            {/* Button Submit */}
                            <Row>
                                <Col sm='12' className='d-flex justify-content-center align-items-end'>
                                    <Button color='primary' onClick={handleFormSubmit}>Create Request</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                </div>
            </CardBody>
        </Card>
    )
}

export default RequestAdd