import React from 'react'
import { Menu, Icon, Button } from 'antd'
import style from '@/assets/less/topnav.less'
import logo from '@/assets/image/logo.png'
import { withRouter } from 'react-router'

@withRouter
class TopNav extends React.Component {
  constructor(props) {
    super(props)
  }

  logout = () => {
    sessionStorage.clear()
    localStorage.clear()
    this.props.history.replace('/login')
  }

  render() {
    return (
      <div className={style.topBox}>
        <img className={style.logo} src={logo} alt="雅文破冰" />

        <Button onClick={() => this.logout()}>退出</Button>
      </div>
    )
  }
}

export default TopNav
