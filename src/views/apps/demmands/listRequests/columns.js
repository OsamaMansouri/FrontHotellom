// ** Third Party Components
import { Badge } from 'reactstrap'


export const columns = [
  {
    name: 'Client',
    // minWidth: '297px',
    selector: 'name',
    sortable: true,
    cell: row => (
      <span className='font-weight-bold' >{`${row.user.firstname} ${row.user.lastname}`}</span>
    ) 
  },
  {
    name: 'Room',
    // minWidth: '297px',
    selector: 'room_number',
    sortable: true,
    cell: row => row.room_id
  },
  {
    name: 'Status',
    selector: 'status',
    sortable: true,
    cell: row => (
      <Badge color={`light-${row.status === "In preparation" ? "warning" : "success"}`}>{row.status}</Badge>
    )
  },
  {
    name: 'Payment',
    selector: 'payment',
    sortable: true,
    cell: row => row.payment
  },
  {
    name: 'Total',
    selector: 'total',
    sortable: true,
    cell: row => `${row.total} MAD`
  }

]
