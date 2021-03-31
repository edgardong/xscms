import React from 'react'
import { Menu, Icon, Button } from 'antd'
import style from '@/assets/less/topnav.less'
import logo from '@/assets/image/logo.png'

export default class TopNav extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={style.topBox}>
        <img className={style.logo} src={logo} alt="雅文破冰" />
      </div>
    )
  }
}
