// ** Initial State
const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedSetting: null
}

const settings = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      console.log('settings: ', action.data)
      return { ...state, allData: action.data }
    case 'GET_DATA':
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params
      }
    case 'GET_SETTING':
      return { ...state, selectedSetting: action.selectedSetting }
    default:
      return { ...state }
  }
}
export default types
