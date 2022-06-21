import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/types?hotel_id=${hotel_id}`).then(response => {
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
    await axiosInstance.get(`/types?hotel_id=${params.hotel_id}`, params).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get Type
export const getType = id => {
  return async dispatch => {
    await axiosInstance.get(`/types/${id}`)
      .then(response => {
        console.log(response)
        dispatch({
          type: 'GET_TYPE',
          selectedType: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new Type
export const addType = type => {
  return (dispatch, getState) => {
    axiosInstance.post('/types', type)
      .then(response => {
        dispatch({
          type: 'ADD_TYPE',
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

// ** Delete Type
export const deleteType = id => {
  return (dispatch, getState) => {
    axiosInstance.delete(`/types/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_TYPE'
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
        dispatch(getAllData())
      })
  }
}
