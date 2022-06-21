// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'
import {
  Button,
  Badge,
  Media,
  CustomInput,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getNotifications } from '../../../../redux/actions/notifications'

const NotificationDropdown = () => {
  // ** Notification Array
  // subtitle: 'BLR Server using high memory',
  // title: (
  //   <Media tag='p' heading>
  //     <span className='font-weight-bolder'>High memory</span>&nbsp;usage
  //   </Media>
  // )
  const state = useSelector(state => state)
  const notifications = state.notifications.data
  const notificationsLength =  notifications ? notifications.length : 0
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getNotifications())
  }, [])

  // ** Function to render Notifications
  // const renderNotificationItems = (notifications = []) => {
  //   if (!notifications.length) return <p>Loading...</p>
  //   return 
  // }

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {notificationsLength > 0 &&
          <Badge pill color='danger' className='badge-up'>
            {notificationsLength}
          </Badge>
        }
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>Notifications</h4>
            {notificationsLength > 0 &&
              <Badge tag='div' color='light-primary' pill>
                {notificationsLength} New
              </Badge>
            }
          </DropdownItem>
        </li>
        {!notifications ? <p className={'text-center'}>Loading...</p> : (
          <PerfectScrollbar
            component='li'
            className='media-list scrollable-container'
            options={{
              wheelPropagation: false
            }}
          >
            {notifications.map((item, index) => {
              return (
                <a key={index} className='d-flex' href='/' onClick={e => e.preventDefault()}>
                  <Media className={classnames('d-flex', 'align-items-start')}>
                    <Fragment>
                      <span className='font-weight-bolder'>{item.title}</span>
                    </Fragment>
                  </Media>
                </a>
              )
            })}
          </PerfectScrollbar>
        )}
        {/* <li className='dropdown-menu-footer'>
          <Button.Ripple color='primary' block>
            Read all notifications
          </Button.Ripple>
        </li> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
