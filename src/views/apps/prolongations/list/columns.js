// ** React Imports
import { useState } from 'react'

// ** Store & Actions
import { updateProlongation } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Button } from 'reactstrap'

const userData = JSON.parse(localStorage.getItem('userData'))
const roles = userData && userData.roles && userData.roles.map(role => role.name)

// Validate button component
const ValidateButton = ({prolongation_id, prolongation_status}) => {
  const [showButtonOnClick, setShowButtonOnClick] = useState(true)

  const validateProlongation = () => {
    setShowButtonOnClick(false)
    store.dispatch(updateProlongation(prolongation_id, {status: 'isValid'}))
  }

  const showButton = prolongation_status === 'processing' && showButtonOnClick
  const validateButton = <Button.Ripple color='primary' onClick={() => validateProlongation()}>Validate</Button.Ripple>

  return (
    showButton ? validateButton : 'Valid'
  )
}

const satusClomun = (prolongation) => {
  if (roles && roles.includes('super-admin')) {
    return <ValidateButton prolongation_id={prolongation.id} prolongation_status={prolongation.status} />
  } else if (roles && roles.includes('admin')) {
    return prolongation.status === 'processing' ? 'In process' : 'Valid'
  }
}

export const columns = [
  {
    name: 'ID',
    minWidth: '172px',
    selector: 'id',
    sortable: true,
    cell: row => row.id
  },
  {
    name: 'Number of days',
    minWidth: '172px',
    selector: 'number_days',
    sortable: true,
    cell: row => row.number_days
  },
  {
    name: 'Status',
    minWidth: '100px',
    cell: row => satusClomun(row) 
  }
]