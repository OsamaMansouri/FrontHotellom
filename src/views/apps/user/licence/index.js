
import axiosInstance from '../../../../@core/api/axiosInstance'
import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Input, Row, Col, Label, FormGroup, Card, CardHeader, CardTitle, Table, Button, CustomInput, FormFeedback } from 'reactstrap'
import { isUserLoggedIn } from '@utils'

const LicenceList = () => {
    // ** State
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const [license, setLicense] = useState({})
    const [errors, setErrors] = useState({})
    const history = useHistory()

    //** ComponentDidMount
    useEffect(() => {
        if (isUserLoggedIn() !== null) {
            const user = JSON.parse(localStorage.getItem('userData'))

            const config = {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }

            // fetch categories
            axiosInstance.get(`/getLicenseByHotel?hotel_id=${id}`, config).then(res => {
                setLicense(res.data)
            }).catch(err => {
                console.log(err.response.data)
            })
        }
    }, [])

    // ** License Data
    const renderLicenseData = () => {
        
        return (
            <tr key={license.id}>
            <td>
                <div className='d-flex align-items-center'>
                    <div>
                        <div className='font-weight-bolder'>{license.startDate}</div>
                    </div>
                </div>
            </td>
            <td>
                <div className='d-flex flex-column'>
                    <span className='font-weight-bolder mb-25'>{license.endDate}</span>
                </div>
            </td>
            </tr>
        )
    }

    return (
        <div className='app-user-list'>
            <Row>
                <Col lg='12' md='12' xs='12'>
                    <Card className='card-company-table'>
                        <CardHeader>
                            <CardTitle tag='h4'>License</CardTitle>
                        </CardHeader>
                        <Table responsive>
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderLicenseData()}
                        </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
            <Row>
                
            </Row>
            <Row>
                
            </Row>
        </div>
    )
}

export default LicenceList