import Avatar from '@components/avatar'
import { Table, Card, CardTitle, CardHeader } from 'reactstrap'
import axiosInstance from '../../../@core/api/axiosInstance'
import { useState, useEffect, Fragment } from 'react'
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const TopArticlesTable = () => {

  const [articles, setArticles] = useState([])

  // ** Function to get The Top Articles on mount
  useEffect(() => {

        const user = JSON.parse(localStorage.getItem('userData'))
  
        const config = {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }
        // fetch top articles
        axiosInstance
          .get(`/topArticles?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            setArticles(res.data)
            console.log(res.data)
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])

  const data = [
      {
        img: require('@src/assets/images/icons/toolbox.svg').default,
        name: 'Dixons',
        email: 'meguc@ruj.io',
        icon: <Monitor size={18} />,
        category: 'Technology',
        views: '23.4k',
        time: '24 hours',
        revenue: '891.2',
        sales: '68'
      },
      {
        img: require('@src/assets/images/icons/parachute.svg').default,
        name: 'Motels',
        email: 'vecav@hodzi.co.uk',
        icon: <Coffee size={18} />,
        category: 'Grocery',
        views: '78k',
        time: '2 days',
        revenue: '668.51',
        sales: '97',
        salesUp: true
      },
      {
        img: require('@src/assets/images/icons/brush.svg').default,
        name: 'Zipcar',
        email: 'davcilse@is.gov',
        icon: <Watch size={18} />,
        category: 'Fashion',
        views: '162',
        time: '5 days',
        revenue: '522.29',
        sales: '62',
        salesUp: true
      },
      {
        img: require('@src/assets/images/icons/star.svg').default,
        name: 'Owning',
        email: 'us@cuhil.gov',
        icon: <Monitor size={18} />,
        category: 'Technology',
        views: '214',
        time: '24 hour',
        revenue: '291.01',
        sales: '88',
        salesUp: true
      },
      {
        img: require('@src/assets/images/icons/book.svg').default,
        name: 'Cafés',
        email: 'pudais@jife.com',
        icon: <Coffee size={18} />,
        category: 'Grocery',
        views: '208',
        time: '1 week',
        revenue: '783.93',
        sales: '16'
      },
      {
        img: require('@src/assets/images/icons/rocket.svg').default,
        name: 'Kmart',
        email: 'bipri@cawiw.com',
        icon: <Watch size={18} />,
        category: 'Fashion',
        views: '990',
        time: '1 month',
        revenue: '780.05',
        sales: '78',
        salesUp: true
      },
      {
        img: require('@src/assets/images/icons/speaker.svg').default,
        name: 'Payers',
        email: 'luk@izug.io',
        icon: <Watch size={18} />,
        category: 'Fashion',
        views: '12.9k',
        time: '12 hours',
        revenue: '531.49',
        sales: '42',
        salesUp: true
      }
    ],
    colorsArr = {
      Technology: 'light-primary',
      Grocery: 'light-success',
      Fashion: 'light-warning'
    }

  const renderData = () => {
    /* let cmp = 0 */
    return articles.map(col => {
      /* cmp++ */
      return (
        <tr key={col.id}>
         {/*  <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='font-weight-bolder'>#{cmp}</div>
              </div>
            </div>
          </td> */}
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='font-weight-bolder'>{col.name}</div>
              </div>
            </div>
          </td>
          {/* <td>
            <div className='d-flex align-items-center'>
              <span>{col.cat}</span>
            </div>
          </td> */}
          {/* <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='font-weight-bolder mb-25'>{col.price} MAD</span>
            </div>
          </td> */}
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

  return (
    <Card className='card-company-table'>
      <CardHeader>
        <CardTitle tag='h4'>Top Articles</CardTitle>
      </CardHeader>
      <Table responsive>
        <thead>
          <tr>
            {/* <th></th> */}
            <th>Article</th>
            {/* <th>Categorie</th> */}
            {/* <th>Prix</th> */}
            <th>Commandes</th>
            <th>Revenu</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default TopArticlesTable
