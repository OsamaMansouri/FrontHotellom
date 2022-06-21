import Avatar from '@components/avatar'
import { Table, Card, CardTitle, CardHeader } from 'reactstrap'
import axiosInstance from '../../../@core/api/axiosInstance'
import { useState, useEffect, Fragment } from 'react'
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const TopClientsTable = () => {

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
          .get(`/topClients?hotel_id=${user.hotel.id}`, config)
          .then(res => {
            setArticles(res.data)
            console.log(res.data)
          })
          .catch(err => {
            console.log(err.response.data)
          })
  }, [])

  const renderData = () => {
    /* let cmp = 0 */
    return articles.map(col => {
      /* cmp++ */
      return (
        <tr key={col.name}>
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

  return (
    <Card className='card-company-table'>
      <CardHeader>
        <CardTitle tag='h4'>Top Ordering Guests</CardTitle>
      </CardHeader>
      <Table responsive>
        <thead>
          <tr>
            {/* <th></th> */}
            <th>Client</th>
            <th>Commandes</th>
            <th>Revenu</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default TopClientsTable
