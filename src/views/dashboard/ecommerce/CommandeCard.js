import classnames from 'classnames'
import Avatar from '@components/avatar'
import axiosInstance from '../../../@core/api/axiosInstance'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { useState, useEffect, Fragment } from 'react'

const StatsCard = ({ cols }) => {
  const [nbrComDay, setNbrComDay] = useState(0)
  const [nbrComMonth, setNbrComMonth] = useState(0)
  const [nbrComWeek, setNbrComWeek] = useState(0)

  // ** Function to get Statistiques on mount
  useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userData'))
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
        // fetch nombre de commande par active client
        axiosInstance
          .get(`/nbrCommandeDayByActiveClient?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].nbrCommandeByDay === null) {
              setNbrComDay(0)
            } else {
              setNbrComDay(res.data[0].nbrCommandeByDay)
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
          // fetch nombre de commande par semaine
          axiosInstance
          .get(`/nbrCommandeByWeek?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].nbrCommande === null) {
              setNbrComWeek(0)
            } else {
              setNbrComWeek(res.data[0].nbrCommande)
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
          // fetch nombre de commande par mois
          axiosInstance
          .get(`/nbrCommandeByMonth?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            if (res.data[0].nbrCommande === null) {
              setNbrComMonth(0)
            } else {
              setNbrComMonth(res.data[0].nbrCommande)
            }
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])
  const data = [
    {
      title: `${nbrComDay}`,
      subtitle: 'Par Jour',
      color: 'light-primary',
      icon: <Box size={24} />
    },
    {
      title: `${nbrComWeek}`,
      subtitle: 'Par Semaine',
      color: 'light-primary',
      icon: <Box size={24} />
    },
    {
      title: `${nbrComMonth}`,
      subtitle: 'Par Mois',
      color: 'light-primary',
      icon: <Box size={24} />
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
        <CardTitle tag='h4'>Commandes</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
