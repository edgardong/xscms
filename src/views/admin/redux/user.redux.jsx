const ADD_TOKEN = 'ADD_TOKEN'
const REMOVE_TOKEN = 'REMOVE_TOKEN'

const initToken = { token: '' }

function userReducer(state = initToken, action) {
  console.log('userReducer',action)
  switch (action.type) {
    case ADD_TOKEN:
      return { ...state, token: action.data.token }
    case REMOVE_TOKEN:
      return { ...state, token: '' }
    default:
      return state
  }
}

/**
 * 添加token数据
 * @param {*} data 
 * @returns 
 */
function addTokenAction(data) {
  return {
    type: ADD_TOKEN,
    data
  }
}

/**
 * 删除token数据
 * @param {*} data 
 * @returns 
 */
function removeTokenAction(data) {
  return {
    type: REMOVE_TOKEN,
    data
  }
}

export function addToken(data) {
  return dispatch => {
    dispatch(addTokenAction(data))
  }
}

export function removeToken(){
  return dispatch=> {
    dispatch(removeTokenAction(('')))
  }
}

export default userReducer
