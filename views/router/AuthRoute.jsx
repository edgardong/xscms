import React from 'react'

import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

@connect((state) => state, {})
class Auth extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // console.log(this.props)
    let isLogined = this.props.user.token != ''
    const { path, component } = this.props
    if (!isLogined) {
      return <Redirect to="/login" />
    }

    return <Route path={path} component={component}></Route>
  }
}

export default Auth
