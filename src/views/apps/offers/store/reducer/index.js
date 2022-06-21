// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedOffer: null
}

const offers = (state = initialState, action) => {
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
    case 'GET_OFFER':
      return { ...state, selectedOffer: action.selectedOffer }
    case 'ADD_OFFER':
      return { ...state }
    case 'DELETE_OFFER':
      return { ...state }
    default:
      return { ...state }
  }
}
export default offers
