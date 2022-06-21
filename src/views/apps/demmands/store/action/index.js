import axiosInstance from '../../../../../@core/api/axiosInstance'

// ** Get all Data
export const getAllData = (hotel_id) => {
  return async dispatch => {
    await axiosInstance.get(`/commandsList?hotel_id=${hotel_id}`).then(response => {
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
    await axiosInstance.get(`/commands?hotel_id=${params.hotel_id}`, { params }).then(response => {
      dispatch({
        type: 'GET_DATA',
        data: response.data,
        params
      })
    })
  }
}

// ** Get Article
export const getArticle = id => {
  return async dispatch => {
    await axiosInstance
      .get('/articles/', { id })
      .then(response => {
        dispatch({
          type: 'GET_ARTICLE',
          selectedArticle: response.data
        })
      })
      .catch(err => console.log(err))
  }
}

// ** Add new article
export const addArticle = article => {
  return (dispatch, getState) => {
    axiosInstance
      .post('/articles/', article)
      .then(response => {
        dispatch({
          type: 'ADD_ARTICLE',
          article
        })
      })
      .then(() => {
        dispatch(getData(getState().articles.params))
        dispatch(getAllData())
      })
      .catch(err => console.log(err))
  }
}

// ** Delete article
export const deleteArticle = id => {
  return (dispatch, getState) => {
    axiosInstance
      .delete(`/articles/${id}`)
      .then(response => {
        dispatch({
          type: 'DELETE_ARTICLE'
        })
      })
      .then(() => {
        dispatch(getData(getState().articles.params))
        dispatch(getAllData())
      })
  }
}
