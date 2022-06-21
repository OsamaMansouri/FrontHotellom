import axiosInstance from '../../../@core/api/axiosInstance'

// ** Get notifications DB
export const getNotifications = () => {
  return dispatch => {
    return axiosInstance.get('/notifications').then(response => {
      console.log(response.data)
      dispatch({
        type: 'GET_NOTIFICATIONS',
        data: response.data
      })
    })
  }
}
