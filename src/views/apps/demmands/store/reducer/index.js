// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedArticle: null
}

const articles = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      return { ...state, allData: action.data }
    case 'GET_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_ARTICLE':
      return { ...state, selectedArticle: action.selectedArticle }
    case 'ADD_ARTICLE':
      return { ...state }
    case 'DELETE_ARTICLE':
      return { ...state }
    default:
      return { ...state }
  }
}
export default articles
