import React from 'react'
import { Menu, Button, Breadcrumb } from 'antd';
import style from '@admin/assets/less/bread.less'

import { connect } from 'react-redux'

@connect((state) => state)
class Bread extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.breadBox}>
        <Breadcrumb>
          {this.props.menu
            ? this.props.menu.map((b, index) => (
                <Breadcrumb.Item key={index}>
                  <a href={b.url}>{b.text}</a>
                </Breadcrumb.Item>
              ))
            : null}
        </Breadcrumb>
      </div>
    )
  }
}

export default Bread
