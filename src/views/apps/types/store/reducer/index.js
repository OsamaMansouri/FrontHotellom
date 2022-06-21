// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedType: null
}

const types = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      console.log('types: ', action.data)
      return { ...state, allData: action.data }
    case 'GET_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_TYPE':
      return { ...state, selectedType: action.selectedType }
    case 'ADD_TYPE':
      return { ...state }
    case 'DELETE_TYPE':
      return { ...state }
    default:
      return { ...state }
  }
}
export default types
