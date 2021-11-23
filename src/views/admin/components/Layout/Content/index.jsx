import React from 'react'
import { Menu, Button } from 'antd';
import style from '@admin/assets/less/content.less'
import RootRoutes from '@admin/router/routes'

import { Route, Switch, Redirect } from 'react-router-dom'

export default class Content extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let match = this.props.match
    return (
      <div className={style.content}>
        <Switch>
          {RootRoutes.map((route, index) => (
            <Route
              key={index}
              exact
              path={`${match.path}${route.path}`}
              component={route.component}
            />
          ))}
          <Redirect to="/main/system/notFound" />
        </Switch>
      </div>
    )
  }
}
