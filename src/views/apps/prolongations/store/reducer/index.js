// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedProlongation: null
}

const prolongations = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      console.log('prolongs: ', action.data)
      return { ...state, allData: action.data }
    case 'GET_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_PROLONAGATION':
      return { ...state, selectedProlongation: action.selectedProlongation }
    case 'ADD_PROLONAGATION':
      return { ...state }
    case 'UPDATE_PROLONAGATION':
      return { ...state }
    case 'DELETE_PROLONAGATION':
      return { ...state }
    default:
      return { ...state }
  }
}
export default prolongations
