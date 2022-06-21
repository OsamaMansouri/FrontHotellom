import classnames from 'classnames'
import Avatar from '@components/avatar'
import axiosInstance from '../../../@core/api/axiosInstance'
import { useState, useEffect, Fragment } from 'react'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

const StatsCard = ({ cols }) => {
  const [avgComDay, setAvgComDay] = useState(0)
  const [avgComMonth, setAvgComMonth] = useState(0)
  const [avgComWeek, setAvgComWeek] = useState(0)

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
          .get(`/avgCommandeDayByActiveClient?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].avgCommandeByDay === null) {
              setAvgComDay(0)
            } else {
              setAvgComDay(res.data[0].avgCommandeByDay.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
        // fetch somme des commandes par semaine
        axiosInstance
          .get(`/avgCommandeByWeek?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].avgCommandes === null) {
              setAvgComWeek(0)
            } else {
              setAvgComWeek(res.data[0].avgCommandes.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
        // fetch somme des commandes par mois
        axiosInstance
          .get(`/avgCommandeByMonth?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].avgCommandes === null) {
              setAvgComMonth(0)
            } else {
              setAvgComMonth(res.data[0].avgCommandes.toFixed(2))
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])
  const data = [
    {
      title: `${avgComDay} MAD`,
      subtitle: 'Par Jour',
      color: 'light-success',
      icon: <DollarSign size={24} />
    },
    {
      title: `${avgComWeek} MAD`,
      subtitle: 'Par Semaine',
      color: 'light-success',
      icon: <DollarSign size={24} />
    },
    {
      title: `${avgComMonth} MAD`,
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
        <CardTitle tag='h4'>Average commandes</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
