import React from 'react'
import { Menu, Icon, Button, Modal } from 'antd'
import style from '@/assets/less/topnav.less'
import logo from '@/assets/image/logo.png'
import { withRouter } from 'react-router'

import DropDown from '../DropDown'

@withRouter
class TopNav extends React.Component {
  constructor(props) {
    super(props)
  }

  reLogin = () => {
    this.props.history.replace('/login')
  }

  render() {
    return (
      <div className={style.topBox}>
        <img className={style.logo} src={logo} alt="雅文破冰" />
        <div className={style.rightMenu}>
          <DropDown reLogin={this.reLogin}></DropDown>
        </div>
      </div>
    )
  }
}

export default TopNav
