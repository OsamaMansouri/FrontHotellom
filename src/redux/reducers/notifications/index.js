// ** Initial State
const initialState = {
  data: null
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS':
      const notifs = action.data.map(item => {
        const notif = JSON.parse(item.data)
        return {
          title: notif[0]
        }
      })
      return { ...state, data: notifs }
    default:
      return state
  }
}

export default notificationReducer
