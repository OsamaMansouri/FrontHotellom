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
    const [data, setData] = useState([])
    const [userData, setUserData] = useState(null)
    const history = useHistory()
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            setUserData(JSON.parse(localStorage.getItem('userData')))
            const user = JSON.parse(localStorage.getItem('userData'))

            axiosInstance
            .get(`/demmands`)
            .then(res => { 
              setData(res.data)
            })
            .catch(err => { console.log(err) })
        }
      }, [])

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
        formData.append('hotel_id', userData.hotel.id)
        if (demmand.demmand_id) formData.append('demmand_id', demmand.demmand_id)
        //for (const entry of formData.entries()) console.log(entry)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axiosInstance.post('/request_hotel', formData, config).then(res => {
            toast.success(
                <ToastContent demmand={demmand.name} />,
                { transition: Slide, hideProgressBar: true, autoClose: 3000 }
            )
            history.push('/apps/requesthotel/list')
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
                            <Col sm='12'>
                                    <Label for="types">Select your Request</Label>
                                    <Input
                                        type="select"
                                        name="demmand_id"
                                        id="demmand_id"
                                        required
                                        onChange={(e) => setDemmand({ ...demmand, demmand_id: e.target.value})}
                                        value={demmand.demmand_id}
                                    >
                                        <option value='0' selected>Select type</option>
                                        {
                                            data.map(data => <option key={data.id} value={data.id}>{data.name}</option>)
                                        }
                                       {console.log(demmand.demmand_id)}
                                    </Input>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col sm='' className='pt-1 d-flex justify-content-end align-items-end'>
                                    <Button color='success' onClick={addOption}>Add Option</Button>
                                </Col>
                            </Row> */}
                            <br/>
                            {/* Request Options */}
                            {
                                // options.map((option, option_index) => {
                                //     return (
                                //         <div key={option.uid} style={{ border: '1px solid black', padding: '1rem', marginTop: '1rem' }}>
                                //             <Row>
                                //                 <Col sm={10}>
                                //                     <Label for={option.uid}>Name</Label>
                                //                     <Input
                                //                         invalid={errors.title !== undefined}
                                //                         type="text"
                                //                         id={option.uid}
                                //                         placeholder='Enter option name'
                                //                         onChange={(e) => setOptionName(option.uid, e.target.value)}
                                //                     />
                                //                     {/* {errors.name && <FormFeedback>{errors.name[0]}</FormFeedback>} */}
                                //                 </Col>
                                //                 <Col sm={2}>
                                //                     <Button.Ripple color='danger' className='text-nowrap px-1' onClick={() => deleteOption(option_index)} outline>
                                //                         <X size={14} className='mr-50' />
                                //                         <span>Delete</span>
                                //                     </Button.Ripple>              
                                //                 </Col>
                                //             </Row>
                                //             <br/>
                                //         </div>
                                //     )
                                // })
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