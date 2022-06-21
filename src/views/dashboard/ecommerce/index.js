import axiosInstance from '../../../@core/api/axiosInstance'
import classnames from 'classnames'
import Avatar from '@components/avatar'
import { useState, useEffect, useContext } from 'react'
import { Input, Table, Card, CardHeader, Label, CardTitle, CardBody, CardText, Row, Col, Media,
  UncontrolledButtonDropdown, Button } from 'reactstrap'
import { User, TrendingUp, Box, DollarSign, MessageSquare, ShoppingBag, Heart, Truck, Eye, Award, Star } from 'react-feather'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
// ** Charts
import { Bar } from 'react-chartjs-2'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import medal from '@src/assets/images/illustration/badge.svg'
import StatsVertical from '@components/widgets/stats/StatsVertical'
import Earnings from '@src/views/ui-elements/cards/analytics/Earnings'

const EcommerceDashboard = () => {
  //const { colors } = useContext(ThemeColors), trackBgColor = '#e9ecef'
  const [statistiques, setStatistiques] = useState({activeClients:0, commandsDay:0, commandsWeek:0, commandsMonth:0, salesDay:0, salesWeek:0, salesMonth:0, avgDay:0, avgWeek:0, avgMonth:0, conversionMonth:0, conversionWeek:0})
  const [articles, setArticles] = useState([])
  const [clients, setClients] = useState([])
  const [hotels, setHotels] = useState([])
  const [hotel, setHotel] = useState([])
  const user = JSON.parse(localStorage.getItem('userData'))
  const { colors } = useContext(ThemeColors),
    [skin, setSkin] = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    successColorShade = '#836AF9'

  const [dataCh, setDataCh] = useState([])
  const [labelsCh, setLabelsCh] = useState([])
  const [orders, setOrders] = useState(0)
  const [activeClient, setActiveClient] = useState(0)
  const [conversion, setConversion] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [average, setAverage] = useState(0)
  const [profit, setProfit] = useState(0)
  const [chartReference, setChartReference] = useState({})
  const [clientName, setClientName] = useState('')

  const config = {
    headers: {
      Authorization: `Bearer ${user.accessToken}`
    }
  }

  useEffect(() => {

      const user = JSON.parse(localStorage.getItem('userData'))

      // Function to get Statistiques on mount
      axiosInstance
        .get(`/getStatistiques?hotel_id=${user.hotel_id}`, config)
        .then(res => { 

                      setStatistiques(res.data)
                      setOrders(res.data.commandsDay)
                      setRevenue(res.data.commandsDay)
                      setConversion('----')
                      setActiveClient(res.data.activeClients)
                      setAverage(res.data.avgDay)
                      setProfit(res.data.commandsProfitDay)
                      console.log(res.data)
                    })
        .catch(err => { console.log(err.response.data) })

      // Fetch top articles
      axiosInstance
        .get(`/topArticles?hotel_id=${user.hotel_id}`, config)
        .then(res => { setArticles(res.data) })
        .catch(err => { console.log(err.response.data) })

      // Fetch Hotels
      axiosInstance
        .get(`/hotels?web=1`, config)
        .then(res => { setHotels(res.data) })
        .catch(err => { console.log(err.data) })

      // Fetch top articles
      axiosInstance
      .get(`/topClients?hotel_id=${user.hotel_id}`, config)
      .then(res => { 
        setClients(res.data)
        setClientName(res.data[0].name)
       })
      .catch(err => { console.log(err.response.data) })

      // Function to get Statistiques on mount For Chart
      axiosInstance
      .get(`/salesChart?hotel_id=${user.hotel_id}`, config)
      .then(res => { 
                    const dat = []
                    const lab = []
                    for (let i = 0; i < res.data.length; i++) {
                      dat.push(res.data[i].total)
                      lab.push(res.data[i].mois)
                    }
                    setDataCh(dat)
                    setLabelsCh(lab)
                  })
      .catch(err => { console.log(err.response.data) })

  }, [])

  const dataTopRight = [
    {
      title: activeClient,
      subtitle: 'Active Clients',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: orders,
      subtitle: 'Orders',
      color: 'light-danger',
      icon: <ShoppingBag size={24} />
    },
    {
      title: `${conversion} %`,
      subtitle: 'Conversion',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: `${revenue} MAD`,
      subtitle: 'Revenue',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]

  const renderDataTopRight = () => {
    return dataTopRight.map((item, index) => {
      const cols =  {xl: '3', sm: '6'} 
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== dataTopRight.length - 1
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

  const options = {
    elements: {
      rectangle: {
        borderWidth: 2,
        borderSkipped: 'bottom'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 500,
    legend: {
      display: false
    },
    tooltips: {
      // Updated default tooltip UI
      shadowOffsetX: 1,
      shadowOffsetY: 1,
      shadowBlur: 8,
      shadowColor: tooltipShadow,
      backgroundColor: '#fff',
      titleFontColor: '#000',
      bodyFontColor: '#000'
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: true,
            color: gridLineColor,
            zeroLineColor: gridLineColor
          },
          scaleLabel: {
            display: false
          },
          ticks: {
            fontColor: labelColor
          }
        }
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            color: gridLineColor,
            zeroLineColor: gridLineColor
          },
          ticks: {
            stepSize: 100,
            min: 0,
            fontColor: labelColor
          }
        }
      ]
    }
  },
  datac = {
    labels: labelsCh,
    datasets: [
      {
        data: dataCh,
        backgroundColor: successColorShade,
        borderColor: 'transparent',
        barThickness: 15
      }
    ]
  }

  // ** Active Clients Card
  const activeClientsData = [
    {
      title: `${statistiques.activeClients}`,
      subtitle: 'Per Day',
      color: 'light-success',
      icon: <User size={24} />
    }
  ]
  const renderActiveClientsData = () => {
    return activeClientsData.map((item, index) => {
      const cols = { xl: '12', sm: '12' }
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== activeClientsData.length - 1
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

  // ** Top Articles Data
  const renderTopArticlesData = () => {
    /* let cmp = 0 */
    return articles.map(col => {
      /* cmp++ */
      return (
        <tr key={col.id}>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='font-weight-bolder'>{col.name}</div>
              </div>
            </div>
          </td>
          <td>
          <div className='d-flex flex-column'>
              <span className='font-weight-bolder mb-25'>{col.nbr_command}</span>
            </div>
          </td>
          <td>
            <div className='d-flex align-items-center'>
              <span className='font-weight-bolder mr-1'>{col.sum_qtt * col.price} MAD</span>
            </div>
          </td>
        </tr>
      )
    })
  }

  // ** Top Clients Data
  const renderClientsData = () => {
    /* let cmp = 0 */
    return clients.map(col => {
      /* cmp++ */
      return (
        <tr key={col.name}>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='font-weight-bolder'>{col.name}</div>
              </div>
            </div>
          </td>
          <td>
          <div className='d-flex flex-column'>
              <span className='font-weight-bolder mb-25'>{col.nbr_commandes_client}</span>
            </div>
          </td>
          <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='font-weight-bolder mb-25'>{col.total} MAD</span>
            </div>
          </td>
        </tr>
      )
    })
  }

  const handelChartData = (data) => {
    //console.log(data.target.value)
    const fil = data.target.value
    if (fil === 'week') {
      // Function to get Statistiques of last 7 days
      axiosInstance
      .get(`/salesChartLastWeek`, config)
      .then(res => { 
                  const dat = []
                  const lab = []
                  for (let i = 0; i < res.data.length; i++) {
                    dat.push(res.data[i].total)
                    lab.push(res.data[i].day)
                  }
                  setDataCh(dat)
                  setLabelsCh(lab)
                  chartReference.props.data.datasets[0].data = dat
                  chartReference.props.data.labels = lab
                })
      .catch(err => { console.log(err.response.data) })
    } else if (fil === 'month') {
      const user = JSON.parse(localStorage.getItem('userData'))
      // Function to get Statistiques on mount For Chart
      axiosInstance
      .get(`/salesChart?hotel_id=${user.hotel_id}`, config)
      .then(res => { 
                  const dat = []
                  const lab = []
                  for (let i = 0; i < res.data.length; i++) {
                    dat.push(res.data[i].total)
                    lab.push(res.data[i].mois)
                  }
                  setDataCh(dat)
                  setLabelsCh(lab)
                  chartReference.props.data.datasets[0].data = dat
                  chartReference.props.data.labels = lab
                })
      .catch(err => { console.log(err.response.data) })
    }
    /* if (fil === 'day') {
      setOrders(statistiques.commandsDay)
      setConversion('----')
      setActiveClient(statistiques.activeClients)
      setRevenue(statistiques.salesDay)
    } else if (fil === 'week') {
      setOrders(statistiques.commandsWeek)
      setConversion(statistiques.conversionWeek)
      setActiveClient(statistiques.activeClientsWeek)
      setRevenue(statistiques.salesWeek)
    } else if (fil === 'month') {
      setOrders(statistiques.commandsMonth)
      setConversion(statistiques.conversionMonth)
      setActiveClient(statistiques.activeClientsMonth)
      setRevenue(statistiques.salesMonth)
    } else if (fil === 'year') {
      setOrders(statistiques.commandsYear)
      setConversion(statistiques.conversionYear)
      setActiveClient(statistiques.activeClientsYear)
      setRevenue(statistiques.salesYear)
    } */
  }

  // ** Statistics Chart
  const renderChart = () => {
    return (
      <Card>
        <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
          <CardTitle tag='h4'><Avatar color='light-info' icon={<TrendingUp size={24} />} /> Sales Chart</CardTitle>
          <UncontrolledButtonDropdown>
              <Input
              type="select"
              defaultValue="0"
              required
              className='budget-dropdown' 
              outline 
              color='primary'
              onChange={handelChartData}
              >
                  <option value='month'>Monthly</option>
                  <option value='week'>Last 7 days</option>
              </Input>
          </UncontrolledButtonDropdown>
          {/* <div className='d-flex align-items-center'></div> */}
        </CardHeader>
        <CardBody>
          <div /* style={{ height: '400px' }} */>
            <Bar ref={(reference) => setChartReference(reference) } data={datac} options={options} height={320}  />
          </div>
        </CardBody>
      </Card>
    )
  }

  const handelStatisticsData = (data) => {
    //console.log(data.target.value)
    const fil = data.target.value
    if (fil === 'day') {
      setOrders(statistiques.commandsDay)
      setConversion('----')
      setActiveClient(statistiques.activeClients)
      setRevenue(statistiques.salesDay)
    } else if (fil === 'week') {
      setOrders(statistiques.commandsWeek)
      setConversion(statistiques.conversionWeek)
      setActiveClient(statistiques.activeClientsWeek)
      setRevenue(statistiques.salesWeek)
    } else if (fil === 'month') {
      setOrders(statistiques.commandsMonth)
      setConversion(statistiques.conversionMonth)
      setActiveClient(statistiques.activeClientsMonth)
      setRevenue(statistiques.salesMonth)
    } else if (fil === 'year') {
      setOrders(statistiques.commandsYear)
      setConversion(statistiques.conversionYear)
      setActiveClient(statistiques.activeClientsYear)
      setRevenue(statistiques.salesYear)
    }
  }

  const handelAverageData = (data) => {
    //console.log(data.target.value)
    const fil = data.target.value
    if (fil === 'day') {
      setAverage(statistiques.avgDay)
    } else if (fil === 'week') {
      setAverage(statistiques.avgWeek)
    } else if (fil === 'month') {
      setAverage(statistiques.avgMonth)
    } else if (fil === 'year') {
      setAverage(statistiques.avgYear)
    }
  }

  const handelProfitData = (data) => {
    //console.log(data.target.value)
    const fil = data.target.value
    if (fil === 'day') {
      setProfit(statistiques.commandsProfitDay)
    } else if (fil === 'week') {
      setProfit(statistiques.commandsProfitWeek)
    } else if (fil === 'month') {
      setProfit(statistiques.commandsProfitMonth)
    } else if (fil === 'year') {
      setProfit(statistiques.commandsProfitYear)
    }
  }

  // Handel Hotel Change List To Get Statitstiques By Hotel For Super-Admin User
  const handelOnChange = (hotel) => {
    //console.log(hotel.target.value)
    // Function to get Statistiques on mount
    axiosInstance
    .get(`/getStatistiques?hotel_id=${hotel.target.value}`, config)
    .then(res => { 
      setStatistiques(res.data)
      setOrders(res.data.commandsDay)
      setRevenue(res.data.commandsDay)
      setConversion('----')
      setActiveClient(res.data.activeClients)
      setAverage(res.data.avgDay)
      setProfit(res.data.commandsProfitDay)
     })
    .catch(err => { console.log(err.response.data) })

    // Fetch top articles
    axiosInstance
      .get(`/topArticles?hotel_id=${hotel.target.value}`, config)
      .then(res => { setArticles(res.data) })
      .catch(err => { console.log(err.response.data) })

    // Fetch top articles
    axiosInstance
    .get(`/topClients?hotel_id=${hotel.target.value}`, config)
    .then(res => { setClients(res.data) })
    .catch(err => { console.log(err.response.data) })

    // Function to get Statistiques on mount For Chart
    axiosInstance
      .get(`/salesChart?hotel_id=${hotel.target.value}`, config)
      .then(res => { 
                    const dat = []
                    const lab = []
                    for (let i = 0; i < res.data.length; i++) {
                      dat.push(res.data[i].total)
                      lab.push(res.data[i].mois)
                    }
                    setDataCh(dat)
                    setLabelsCh(lab)
                    //renderChart()
                    //const lineChart = chartReference.chartInstance
                    chartReference.props.data.datasets[0].data = dat
                    chartReference.props.data.labels = lab
                    /* lineChart.update()
                    console.log(chartReference.props.data.labels) */
                  })
      .catch(err => { console.log(err.response.data) })

  }

  // ** Top Articles Data
  const renderHotels = () => {
    return (
        <Col xl='6' md='6' xs='12'>
          <Card className='card-statistics'>
            <CardBody className='statistics-body'>
              <Row>
                <Col xl='12' md='12' xs='12'>
                    <Label for="hotel_id">Filter By Hotel</Label>
                    <Input
                        type="select"
                        id="hotel_id"
                        defaultValue="0"
                        required
                        value={hotel.id}
                        onChange={handelOnChange}
                    >
                        <option value='0' selected>Select Hotel</option>
                        {
                            hotels.map(hotel => <option key={hotel.id} value={hotel.id}>{hotel.name}</option>)
                        }
                    </Input>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
    )
  }

  return (
    <div id='dashboard-ecommerce'>

      <Row className='match-height'>
        { user.roles[0].name === "super-admin" ? (renderHotels()) : ('')}
      </Row>

      <Row className='match-height'>
        
        <Col xl='3' md='3' xs='12'>
          <Card className='card-congratulations-medal'>
            <CardBody>
              <h3 className='mb-75 mt-2 pt-50'>
                <a href='javascripts:void()'>
                   Top Guest 🎉
                </a>
              </h3>
              <h3 className='mb-75 mt-2 pt-50'>
                <a href='javascripts:void()'>
                   {clientName}
                </a>
              </h3>
              {/* <h5>Cong 🎉 !</h5> */}
              <CardText className='font-small-3'>Room </CardText>
              {/* <Button.Ripple color='primary'>View Sales</Button.Ripple> */}
              <img className='congratulation-medal' src={medal} alt='Medal Pic' />
           </CardBody>
          </Card>
          {/* <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>Active Clients</CardTitle>
              <CardText className='card-text font-small-2 mr-25 mb-0'></CardText>
            </CardHeader>
            <CardBody className='statistics-body'>
              <Row>{renderActiveClientsData()}</Row>
            </CardBody>
          </Card> */}
        </Col>
        <Col xl='9' md='9' xs='12'>
          <Card className='card-statistics'>
            <CardHeader>
              <CardTitle tag='h4'>Statistics</CardTitle>
              <UncontrolledButtonDropdown>
                  <Input
                  type="select"
                  defaultValue="0"
                  required
                  className='budget-dropdown' 
                  outline 
                  color='primary'
                  onChange={handelStatisticsData}
                  >
                      <option value='day' selected>Daily</option>
                      <option value='week'>Weekly</option>
                      <option value='month'>Monthly</option>
                      <option value='year'>Yearly</option>
                  </Input>
              </UncontrolledButtonDropdown>
            </CardHeader>
            <CardBody className='statistics-body'>
              <Row>{renderDataTopRight()}</Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className='match-height'>
        <Col lg='6' md='12' xs='12'>
            <Row>
              <Col xl='6' md='6' sm='12'>
                <Card className='text-center'>
                  <CardHeader>
                    <CardTitle tag='h4'></CardTitle>
                    <UncontrolledButtonDropdown>
                        <Input
                        type="select"
                        defaultValue="0"
                        required
                        className='budget-dropdown' 
                        outline 
                        color='primary'
                        onChange={handelAverageData}
                        >
                            <option value='day' selected>Daily</option>
                            <option value='week'>Weekly</option>
                            <option value='month'>Monthly</option>
                            <option value='year'>Yearly</option>
                        </Input>
                    </UncontrolledButtonDropdown>
                  </CardHeader>
                  <CardBody className='text-center'>
                    <div className={`avatar p-50 m-0 mb-1 bg-light-success`}>
                      <div className='avatar-content'>{<DollarSign size={21} />}</div>
                    </div>
                    <h2 className='font-weight-bolder'>{average} MAD</h2>
                    <p className='card-text line-ellipsis'>Average Orders</p>
                  </CardBody>
                </Card>
                {/* <StatsVertical icon={<DollarSign size={21} />} color='success' stats='36.9k' statTitle='Average Orders' /> */}
              </Col>
              <Col xl='6' md='6' sm='12'>
                {/* <StatsVertical icon={<TrendingUp size={21} />} color='info' stats='12k' statTitle='Profit' /> */}
                <Card className='text-center'>
                  <CardHeader>
                    <CardTitle tag='h4'></CardTitle>
                    <UncontrolledButtonDropdown>
                        <Input
                        type="select"
                        defaultValue="0"
                        required
                        className='budget-dropdown' 
                        outline 
                        color='primary'
                        onChange={handelProfitData}
                        >
                            <option value='day' selected>Daily</option>
                            <option value='week'>Weekly</option>
                            <option value='month'>Monthly</option>
                            <option value='year'>Yearly</option>
                        </Input>
                    </UncontrolledButtonDropdown>
                  </CardHeader>
                  <CardBody className='text-center'>
                    <div className={`avatar p-50 m-0 mb-1 bg-light-primary`}>
                      <div className='avatar-content'>{<TrendingUp size={21} />}</div>
                    </div>
                    <h2 className='font-weight-bolder'>{profit} MAD</h2>
                    <p className='card-text line-ellipsis'>Profit</p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg='12' md='6' xs='12'>
                <Earnings success={colors.success.main} />
              </Col>
            </Row>
        </Col>
        <Col xl='6' sm='12'>
          {renderChart()}
        </Col>
      </Row>

      <Row className='match-height'>
        <Col lg='6' xs='12'>
          <Card className='card-company-table'>
            <CardHeader>
              <CardTitle tag='h4'><Avatar color='light-warning' icon={<Star size={24} />} /> Top Articles</CardTitle>
            </CardHeader>
            <Table responsive>
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>{renderTopArticlesData()}</tbody>
            </Table>
          </Card>
        </Col>
        <Col lg='6' md='12' xs='12'>
          <Card className='card-company-table'>
            <CardHeader>
              <CardTitle tag='h4'><Avatar color='light-warning' icon={<Award size={24} />} /> Top Ordering Guests</CardTitle>
            </CardHeader>
            <Table responsive>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>{renderClientsData()}</tbody>
            </Table>
          </Card>
        </Col>
      </Row>
      
    </div>
  )
}

export default EcommerceDashboard
