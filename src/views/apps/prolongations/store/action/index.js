import axiosInstance from '../../../../../@core/api/axiosInstance'

const token = `Bearer ${JSON.parse(localStorage.getItem('accessToken'))}`
const headers = {
  Authorization: token
}

// ** Get all Data
export const getAllData = () => {
  return async dispatch => {

    await axiosInstance.get(`/prolongations`, { headers }).then(response => {
      console.log(response.data.data)
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
    await axiosInstance.get(`/prolongations`, { params, headers }).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.total,
        params
      })
    })
  }
}

// ** Get Prolongation
export const getProlongation = id => {
  return async dispatch => {
    await axiosInstance
      .get(`/prolongations/${id}`)
      .then(response => {
        console.log(response)
        dispatch({
          type: 'GET_PROLONGATION',
          selectedProlongation: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new Prolongation
export const addProlongation = prolongation => {
  return (dispatch, getState) => {
    axiosInstance
      .post('/apps/users/add-user', prolongation)
      .then(response => {
        dispatch({
          type: 'ADD_PROLONGATION',
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

// ** Add new Prolongation
export const updateProlongation = (id, prolongation) => {
  return (dispatch, getState) => {
    axiosInstance
      .put(`/prolongations/${id}`, prolongation)
      .then(response => {
        dispatch({
          type: 'UPDATE_PROLONAGATION',
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

// ** Delete prolongation
export const deleteProlongation = id => {
  return (dispatch, getState) => {
    axiosInstance
      .delete(`/prolongations/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_PROLONGATION'
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
        dispatch(getAllData())
      })
  }
}
