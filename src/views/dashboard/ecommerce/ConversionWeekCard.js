import classnames from 'classnames'
import Avatar from '@components/avatar'
import axiosInstance from '../../../@core/api/axiosInstance'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { useState, useEffect, Fragment } from 'react'

const StatsCard = ({ cols }) => {
  const [conversionByWeek, setConversionByWeek] = useState(0)

  // ** Function to get Statistiques on mount
  useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userData'))
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
        // fetch nombre active client
        axiosInstance
          .get(`/conversionByWeek?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data === null) {
              setConversionByWeek(0)
            } else {
              setConversionByWeek(res.data)
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])
  const data = [
    {
      title: `${conversionByWeek}`,
      subtitle: 'Par Semaine',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
          })}
        >
          <Media>
            <Avatar color={item.color} icon={item.icon} className='mr-2' />
            <Media className='my-auto' body>
              <h4 className='font-weight-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Conversion</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
