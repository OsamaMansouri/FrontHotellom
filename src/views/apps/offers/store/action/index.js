import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/offers`).then(response => {
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
    await axiosInstance.get(`/offers`, { params }).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get Offer
export const getOffer = id => {
  return async dispatch => {
    await axiosInstance
      .get('/offers/', { id })
      .then(response => {
        dispatch({
          type: 'GET_OFFER',
          selectedOffer: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new Offer
export const addOffer = offer => {
  return (dispatch, getState) => {
    axiosInstance
      .post('/offers/', offer)
      .then(response => {
        dispatch({
          type: 'ADD_OFFER',
          offer
        })
      })
      .then(() => {
        dispatch(getData(getState().offers.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}

// ** Delete article
export const deleteOffer = id => {
  return (dispatch, getState) => {
    axiosInstance
      .delete(`/offers/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_OFFER'
        })
      })
      .then(() => {
        dispatch(getData(getState().articles.params))
        dispatch(getAllData())
      })
  }
}
