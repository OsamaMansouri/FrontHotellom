import axiosInstance from '../../../../../@core/api/axiosInstance'

const token = `Bearer ${localStorage.getItem('accessToken')}`
const headers = {
  Authorization: token
}

// ** Get Staffs
export const getStaffs = () => {
  return async dispatch => {
    await axiosInstance.get('/users/managers', { headers })
      .then(response => {
        dispatch({
          type: 'GET_STAFFS',
          data: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Get User
export const getUser = id => {
  return async dispatch => {
    await axiosInstance.get(`/users/manager/${id}`)
      .then(response => {
        console.log(response)
        dispatch({
          type: 'GET_STAFF',
          selectedType: response.data
        })
      })
      .catch(err => console.log(err))
  }
}