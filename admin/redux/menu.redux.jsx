const ADD_MENU = 'ADD_MENU'
const UPDATE_THUMB = 'UPDATE_THUMB'

const initState = [{ text: '首页', url: '/' }]

// reducer
function menuReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_THUMB:
      return [...initState, ...action.data]
    default:
      return state
  }
}

// actionCreator
function updateAction(data) {
  return { type: UPDATE_THUMB, data }
}

// dispatch
export function update(data) {
  return (dispatch) => {
    dispatch(updateAction(data))
  }
}

export default menuReducer
