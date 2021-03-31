import React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import AuthRoute from './AuthRoute'
import Main from '@/views/Main'
import Login from '@/views/Login'

export default class BaseRoute extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router>
        <Switch>
          <AuthRoute exact path="/" component={Main} />
          <AuthRoute path="/main" component={Main} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    )
  }
}
