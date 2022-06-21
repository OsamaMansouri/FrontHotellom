// ** Initial State
const initialState = {
  data: []
}

const staffs = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STAFFS':
      return {
        ...state,
        data: action.data
      }
    default:
      return { ...state }
  }
}
export default staffs
