const ADD_TOKEN = 'ADD_TOKEN'

const initToken = { token: '' }

function userReducer(state = initToken, action) {
  switch (action.type) {
    case ADD_TOKEN:
      return { ...state, token: action.data.token }
    default:
      return state
  }
}

function addTokenAction(data) {
  return {
    type: ADD_TOKEN,
    data
  }
}

export function addToken(data) {
  return dispatch => {
    dispatch(addTokenAction(data))
  }
}

export default userReducer
