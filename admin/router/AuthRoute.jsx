import {Component} from 'react'

import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

@connect((state) => state, {})
class Auth extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    // console.log(this.props)
    let isLogined = this.props.user.token != ''
    const { path, component } = this.props

    const installed = true // ||  utils.checkInstalled()
    if(!installed){
      return <Redirect to="install"/>
    }

    if (!isLogined) {
      return <Redirect to="/login" />
    }

    return <Route path={path} component={component}></Route>
  }
}

export default Auth
