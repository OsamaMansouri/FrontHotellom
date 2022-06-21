import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/settings?hotel_id=${hotel_id}`).then(response => {
      dispatch({
        type: 'GET_ALL_DATA',
        data: response.data.data
      })
    })
  }
}

// ** Get data on page or row change
export const getData = params => {
  return async dispatch => {
    await axiosInstance.get(`/settings?hotel_id=${params.hotel_id}`, params).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get Setting
export const getSetting = id => {
  return async dispatch => {
    await axiosInstance.get(`/settings/${id}`)
      .then(response => {
        dispatch({
          type: 'GET_SETTING',
          selectedSetting: response.data
        })
      })
      .catch(err => console.log(err))
  }
}
