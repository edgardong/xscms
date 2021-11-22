import React from 'react'
import { Menu, Icon, Button } from 'antd'
import style from '@admin/assets/less/left.less'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

import menuApi from '@admin/api/system/menu'
import { update } from '../../../redux/menu.redux'

@connect(state => state, { update })
@withRouter
class LeftNav extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      openKeys: [],
      menuList: [],
      rootSubmenuKeys: []
    }
  }

  componentDidMount() {
    menuApi.getAll({ type: 1 }).then(resp => {
      let rootSubmenuKeys = resp.data.map(v => v.code)
      let openKeys =['blog'] // [rootSubmenuKeys[0]]
      this.setState({
        menuList: resp.data,
        rootSubmenuKeys,
        openKeys
      })
    })
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )
    if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  }

  handleClick = e => {
    // 目前仅针对二级菜单
    if (e.key === this.props.location.pathname.replace('/main/', '')) {
      return
    }
    let item2 = {
      url: '/#/main/' + e.keyPath[0],
      text: e.item.props.children
    }
    let menu = this.state.menuList.find(m => m.code === e.keyPath[1])
    let item1 = {
      url: '/#/main/' + menu.url,
      text: menu.name
    }

    this.props.update([item1, item2])
    this.props.history.push(`/main/${e.key}`)
  }

  render() {
    return (
      <div className={style.leftBox}>
        <Menu
          onClick={e => this.handleClick(e)}
          style={{ width: 200 }}
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          mode="inline"
        >
          {!this.state.menuList
            ? null
            : this.state.menuList.map(m => (
                <SubMenu
                  key={m.code}
                  title={
                    <span>
                      {m.icon ? <Icon type={m.icon}></Icon> : null}
                      <span>{m.name}</span>
                    </span>
                  }
                >
                  {m.children
                    ? m.children.map(cm => (
                        <Menu.Item key={cm.url}>{cm.name}</Menu.Item>
                      ))
                    : null}
                </SubMenu>
              ))}
        </Menu>
      </div>
    )
  }
}

export default LeftNav
