// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedShop: null
}

const shops = (state = initialState, action) => {
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
    case 'GET_SHOP':
      return { ...state, selectedShop: action.selectedShop }
    case 'ADD_SHOP':
      return { ...state }
    case 'DELETE_SHOP':
      return { ...state }
    default:
      return { ...state }
  }
}
export default shops
