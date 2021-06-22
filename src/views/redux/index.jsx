import { combineReducers } from 'redux'

import menu from './menu.redux'
import user from './user.redux'

export default combineReducers({ menu, user })
