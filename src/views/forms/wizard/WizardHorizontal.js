import { useRef, useState } from 'react'
import Wizard from '@components/wizard'
import { ArrowRight } from 'react-feather'
import Address from './steps-with-validation/Address'
import SocialLinks from './steps-with-validation/SocialLinks'
import PersonalInfo from './steps-with-validation/PersonalInfo'
import AccountDetails from './steps-with-validation/AccountDetails'

const WizardHorizontal = () => {
  const [stepper, setStepper] = useState(null)
  const [accountData, setAccountData] = useState()
  const [hotelData, setHotelData] = useState()
  const [rooms, setRooms] = useState()
  const ref = useRef(null)

  const steps = [
    {
      id: 'user-details',
      title: 'User Details',
      subtitle: 'Add User Details.',
      content: <AccountDetails stepper={stepper} setAccountData={setAccountData} type='wizard-horizontal' />
    },
    {
      id: 'hotel-info',
      title: 'Hotel Info',
      subtitle: 'Add Hotel Info',
      content: <PersonalInfo stepper={stepper} accountData={accountData} setHotelData={setHotelData} setRooms={setRooms} type='wizard-horizontal' />
    }/* ,
    {
      id: 'room-service-info',
      title: 'Receptionite Info',
      subtitle: 'Add receptionit and room service Details',
      content: <Address stepper={stepper} accountData={accountData} hotelData = {hotelData} rooms = {rooms} type='wizard-horizontal' />
    } */
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default WizardHorizontal
