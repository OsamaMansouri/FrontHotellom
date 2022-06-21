import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/shops?hotel_id=${hotel_id}`).then(response => {
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
    await axiosInstance.get(`/shops?hotel_id=${params.hotel_id}`, params).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get Shop
export const getShop = id => {
  return async dispatch => {
    await axiosInstance.get(`/shops/${id}`)
      .then(response => {
        console.log(response)
        dispatch({
          type: 'GET_SHOP',
          selectedShop: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new Shop
export const addShop = shop => {
  return (dispatch, getState) => {
    axiosInstance.post('/shops', shop)
      .then(response => {
        dispatch({
          type: 'ADD_SHOP',
          user
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}

// ** Delete Shop
export const deleteShop = id => {
  return (dispatch, getState) => {
    axiosInstance.delete(`/shops/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_SHOP'
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
        dispatch(getAllData())
      })
  }
}
