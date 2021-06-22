import React, { Component } from 'react'
import { Menu, Icon, Button, Modal } from 'antd'

export default class DropDown extends Component {
  constructor(props) {
    super(props)
  }

  logout = () => {
    let _this = this
    Modal.confirm({
      title: '提示',
      content: '确定要退出登录么？',
      onOk() {
        console.log('OK', _this.props)
        sessionStorage.clear()
        localStorage.clear()
        _this.props.reLogin()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  handleMenuClick(val) {
    if (val.key === 'logout') {
      this.logout()
    }
  }

  render() {
    return (
      <div>
        <Menu mode="inline" onClick={(val) => this.handleMenuClick(val)}>
          <Menu.SubMenu
            title={
              <span className="submenu-title-wrapper">
                你好，管理员
              </span>
            }
          >
            <Menu.Item key="userinfo">个人信息</Menu.Item>
            <Menu.Item key="modifypwd">修改密码</Menu.Item>
            <Menu.Item key="logout">退出登录</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    )
  }
}
