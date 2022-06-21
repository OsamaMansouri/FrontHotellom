import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/categories?hotel_id=${hotel_id}`).then(response => {
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
    await axiosInstance.get(`/categories?hotel_id=${params.hotel_id}&page=${params.page}&web=5`, params).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data.data,
        totalPages: response.data.meta.total,
        params
      })
    })
  }
}

// ** Get Category
export const getCategory = id => {
  return async dispatch => {
    await axiosInstance.get(`/categories/${id}`)
      .then(response => {
        console.log(response)
        dispatch({
          type: 'GET_CATEGORY',
          selectedCategory: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new Category
export const addCategory = category => {
  return (dispatch, getState) => {
    axiosInstance.post('/categories', category)
      .then(response => {
        dispatch({
          type: 'ADD_CATEGORY',
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

// ** Delete category
export const deleteCategory = id => {
  return (dispatch, getState) => {
    axiosInstance.delete(`/categories/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_CATEGORY'
        })
      })
      .then(() => {
        dispatch(getData(getState().users.params))
        dispatch(getAllData())
      })
  }
}
