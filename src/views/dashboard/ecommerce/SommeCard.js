import classnames from 'classnames'
import Avatar from '@components/avatar'
import axiosInstance from '../../../@core/api/axiosInstance'
import { useState, useEffect, Fragment } from 'react'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

const StatsCard = ({ cols }) => {
  const [sumComDay, setSumComDay] = useState(0)
  const [sumComMonth, setSumComMonth] = useState(0)
  const [sumComWeek, setSumComWeek] = useState(0)

  // ** Function to get Statistiques on mount
  useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userData'))
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
        // fetch somme des commandes par active client day
        axiosInstance
          .get(`/sumCommandeDayByActiveClient?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].sumCommandeByDay === null) {
              setSumComDay(0)
            } else {
              setSumComDay(res.data[0].sumCommandeByDay.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
        // fetch somme des commandes par semaine
        axiosInstance
          .get(`/sumCommandeByWeek?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].sumCommandes === null) {
              setSumComWeek(0)
            } else {
              setSumComWeek(res.data[0].sumCommandes.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
        // fetch somme des commandes par mois
        axiosInstance
          .get(`/sumCommandeByMonth?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].sumCommandes === null) {
              setSumComMonth(0)
            } else {
              setSumComMonth(res.data[0].sumCommandes.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])
  const data = [
    {
      title: `${sumComDay} MAD`,
      subtitle: 'Par Jour',
      color: 'light-success',
      icon: <DollarSign size={24} />
    },
    {
      title: `${sumComWeek} MAD`,
      subtitle: 'Par Semaine',
      color: 'light-success',
      icon: <DollarSign size={24} />
    },
    {
      title: `${sumComMonth} MAD`,
      subtitle: 'Par Mois',
      color: 'light-success',
      icon: <DollarSign size={24} />
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
        <CardTitle tag='h4'>Sales</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
