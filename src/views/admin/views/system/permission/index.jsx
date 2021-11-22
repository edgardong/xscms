import React from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, Menu, Tooltip, Button, Tree, List, Checkbox } from 'antd'
import style from './style.less'

import menuApi from '@admin/api/system/menu'
import roleApi from '@admin/api/system/role'
import baseApi from '@admin/api/system/base'

const OPERATE = 'operate'

@withRouter
class SystemPermission extends React.Component {
  constructor(props) {
    super(props)

    this.hanldeTreeCheck = this.hanldeTreeCheck.bind(this)
    this.handleRoleClick = this.handleRoleClick.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)

    this.state = {
      roleList: [], // 菜单角色列表
      menuList: [],
      allMenuList: [],
      menuRoleId: '',
      operateRoleId: '',
      dataRoleId: '',
      activeKey: 'menu',
      menuPermisson: [],
      halfMenuPermisson: [],
      operates: [],
      opPermisson: [],
      dataPermission: [],
      dataOperates: [],
      opStatus: {
        checked: false,
        indeterminate: false,
      },
      dataRoleList: [], //安全角色列表
    }
  }

  componentDidMount() {
    // console.log('????',this.props.match)

    // 1. 获取所有角色列表
    this.getAllRoles()
    // 2. 获取所有菜单列表
    this.getMenuTree()
    this.getAllMenus()
    // 2. 获取所有功能实体

    this.getOperates()

    this.getDataPermissionTypes()
  }

  CODETYPES = []
  LINELENGTH = 0
  ROWLENGTH = 0

  /**
   * 重置权限矩阵的选择状态
   */
  resetMatrixCheckStatus() {
    let opStatus = {
      checked: false,
      indeterminate: false,
    }
    this.state.opPermisson.forEach((op) => {
      let opLineCount = 0
      this.state.operates.forEach((oc) => {
        if (op.content[oc.code]) {
          opLineCount += 1
        }
      })

      op.checked = opLineCount == this.ROWLENGTH
      op.indeterminate = opLineCount > 0 && opLineCount < this.ROWLENGTH
    })

    this.state.operates.forEach((oc) => {
      let ocRowCount = 0
      this.state.opPermisson.forEach((op) => {
        if (op.content[oc.code]) {
          ocRowCount += 1
        }
      })

      oc.checked = ocRowCount == this.LINELENGTH
      oc.indeterminate = ocRowCount > 0 && ocRowCount < this.LINELENGTH
    })

    opStatus.checked =
      this.state.operates.every((oc) => oc.checked) &&
      this.state.opPermisson.every((op) => op.checked)
    opStatus.indeterminate =
      (this.state.operates.some((oc) => oc.checked || oc.indeterminate) ||
        this.state.opPermisson.some((op) => op.checked || op.indeterminate)) &&
      !opStatus.checked

    this.setState({
      opStatus,
      opPermisson: this.state.opPermisson,
      operates: this.state.operates,
    })
  }

  getDataPermissionTypes() {
    roleApi.getPermissionTypes().then((resp) => {
      console.log('数据操作类型', resp)
      this.setState({
        dataOperates: resp.data,
      })
    })
  }

  /**
   * 获取操作的权限数据
   */
  getOperatePermission(role) {
    roleApi.getOpPermission(role).then((resp) => {
      this.setState({
        opPermisson: resp.data,
      })
      this.LINELENGTH = resp.data.length
      this.resetMatrixCheckStatus()
    })
  }

  getDataPermission(role) {
    roleApi.getDataPermission(role).then((resp) => {
      this.setState({
        dataPermission: resp.data,
      })
      this.resetDataMatrixCheckStatus()
    })
  }

  // 根据用户的角色获取用户的菜单
  getMenuByRoleId(roleId) {
    menuApi.getByRoleId({ roleId }).then((resp) => {
      // let menuPermisson =  resp.data.filter(m => m.menu).map(m => m.menu)
      let menuPermisson = []
      resp.data.reduce((pre, cur) => {
        if (cur.menu) {
          // console.log('上一个啊', pre, cur)
          pre.push(cur.menu)
          return pre
        }
      }, menuPermisson)
      this.setState({
        menuPermisson,
      })
    })
  }

  handleTabChange(activeKey) {
    this.setState({
      activeKey,
    })
  }

  getOperates() {
    baseApi.getAll(OPERATE).then((resp) => {
      this.CODETYPES = resp.data.map((d) => d.code)
      this.ROWLENGTH = resp.data.length
      this.setState({
        operates: resp.data,
      })
    })
  }

  getMenuTree() {
    menuApi.getTree().then((resp) => {
      this.setState({
        menuList: resp.data,
      })
    })
  }

  getAllMenus() {
    menuApi.getAll().then((resp) => {
      this.setState({
        allMenuList: resp.data,
      })
    })
  }

  getAllRoles() {
    roleApi.getAll().then((resp) => {
      // type 1: 菜单（操作）角色；2:安全（数据）角色
      this.setState({
        roleList: resp.data.filter((r) => r.type == 1),
        dataRoleList: resp.data.filter((r) => r.type == 2),
      })
    })
  }

  hanldeTreeCheck(checkedKeys, e) {
    // let menuPermisson = checkedKeys.concat(e.halfCheckedKeys)
    let menuPermisson = checkedKeys
    this.setState({
      menuPermisson,
      halfMenuPermisson: e.halfCheckedKeys,
    })
  }

  handleRoleClick(menu) {
    let key = this.state.activeKey
    let role = menu.key
    this.setState({
      [`${key}RoleId`]: role,
    })

    if (key === 'menu') {
      this.getMenuByRoleId(role)
    } else if (key === OPERATE) {
      this.getOperatePermission({ role })
    } else {
      this.getDataPermission({ role })
    }
  }

  handleSave() {
    if (this.state.activeKey === 'menu') {
      let data = {
        roleId: this.state.menuRoleId,
        menu: this.state.menuPermisson,
        halfMenu: this.state.halfMenuPermisson,
      }
      menuApi.saveByRole(data).then((resp) => {
        console.log(resp)
      })
    } else if (this.state.activeKey === OPERATE) {
      roleApi
        .saveOpPermisson({
          data: this.state.opPermisson,
        })
        .then((resp) => {
          console.log('保存了', resp)
        })
    } else {
      roleApi
        .saveDataPermission({
          data: this.state.dataPermission,
        })
        .then((resp) => {
          console.log('保存好了', resp)
        })
    }
  }

  CHECKTYPE = {
    LINE: 'LINE',
    ROW: 'ROW',
    ALL: 'ALL',
  }

  setLineChecked(content, checked) {
    for (let k in content) {
      console.log(k)
      content[k] = checked
    }
  }

  /**
   * 处理全选功能
   * @param {*} type 全选类型
   * @param {*} code 全选动作
   * @param {*} id 菜单的id
   * @param {*} e
   */
  handleCheckAll(type, code, id, e) {
    let checked = e.target.checked
    // 处理整行选中
    if (type === this.CHECKTYPE.LINE) {
      let item = this.state.opPermisson.find((i) => i.menu == id)
      item.changed = true
      this.setLineChecked(item.content, checked)
    } else if (type === this.CHECKTYPE.ROW) {
      this.state.opPermisson.forEach((op) => {
        op.content[code] = checked
        op.changed = true
      })
    } else if (type === this.CHECKTYPE.ALL) {
      // 处理全部全选
      this.state.opPermisson.forEach((op) => {
        this.CODETYPES.forEach((c) => {
          op.content[c] = checked
          op.changed = true
        })
      })
    }

    this.setState({
      opPermisson: this.state.opPermisson,
    })
    this.resetMatrixCheckStatus()
  }

  handleCheckOne(id, code, e) {
    // console.log(this.state.opreateRoleId, id, code, e)
    if (!this.state[`${OPERATE}RoleId`]) {
      return
    }
    let value = e.target.checked

    // 计算行的状态变化
    let item = this.state.opPermisson.find((op) => op.menu == id)
    // debugger
    item.content[code] = value
    item.changed = true

    this.setState({
      opPermisson: this.state.opPermisson,
    })

    this.resetMatrixCheckStatus()
  }

  resetDataMatrixCheckStatus() {
    this.state.dataOperates.forEach((dop) => {
      let count = 0
      let length = this.state.dataPermission.length
      this.state.dataPermission.forEach((dp) => {
        if (dp.datas == dop.id) {
          count++
        }
      })

      dop.checked = count == length
      dop.indeterminate = count > 0 && count < length
    })

    this.setState({
      dataPermission: this.state.dataPermission,
      dataOperates: this.state.dataOperates,
    })
  }

  handleDataCheckAll(id, checked) {
    this.state.dataPermission.forEach((dp) => {
      dp.datas = checked ? id : ''
    })
    this.resetDataMatrixCheckStatus()
  }

  handleDataCheckOne(lineId, typeId, checked) {
    let item = this.state.dataPermission.find((dp) => dp.menu == lineId)
    item.datas = checked ? typeId : ''

    this.resetDataMatrixCheckStatus()
  }

  render() {
    const operations = (
      <Button onClick={this.handleSave} type="primary">
        保存
      </Button>
    )
    const TabPane = Tabs.TabPane
    return (
      <Tabs
        type="line"
        activeKey={this.state.activeKey}
        onChange={this.handleTabChange}
        className={style.tabRight}
        tabBarExtraContent={operations}
      >
        <TabPane tab="菜单权限" key="menu">
          <div className={style.contentBox}>
            <div className={style.leftBox}>
              <Menu
                mode="inline"
                style={{ width: 200 }}
                onClick={this.handleRoleClick}
              >
                <Menu.ItemGroup title="角色列表">
                  {this.state.roleList.map((ro) => (
                    <Menu.Item key={ro.id}>{ro.name}</Menu.Item>
                  ))}
                </Menu.ItemGroup>
              </Menu>
            </div>
            <div className={style.rightBox}>
              {this.state.menuList.length > 0 ? (
                <Tree
                  ref="tree"
                  checkedKeys={this.state.menuPermisson}
                  onCheck={this.hanldeTreeCheck}
                  checkable
                  defaultExpandAll={true}
                  treeData={this.state.menuList}
                ></Tree>
              ) : null}
            </div>
          </div>
        </TabPane>
        <TabPane tab="操作权限" key={OPERATE}>
          <div className={style.contentBox}>
            <div className={style.leftBox}>
              <Menu
                mode="inline"
                style={{ width: 200 }}
                onClick={this.handleRoleClick}
              >
                <Menu.ItemGroup title="角色列表">
                  {this.state.roleList.map((ro) => (
                    <Menu.Item key={ro.id}>{ro.name}</Menu.Item>
                  ))}
                </Menu.ItemGroup>
              </Menu>
            </div>
            <div className={style.rightBox}>
              {this.state.allMenuList.length > 0 ? (
                <List
                  dataSource={this.state.allMenuList}
                  header={
                    <List.Item>
                      <div>功能名称</div>

                      {this.state.operates.length > 0
                        ? this.state.operates.map((op) => (
                            <Checkbox
                              key={op.id}
                              checked={op.checked}
                              indeterminate={op.indeterminate}
                              onChange={(e) =>
                                this.handleCheckAll(
                                  this.CHECKTYPE.ROW,
                                  op.code,
                                  '',
                                  e
                                )
                              }
                            >
                              全选
                            </Checkbox>
                          ))
                        : null}

                      <Checkbox
                        {...this.state.opStatus}
                        onChange={(e) =>
                          this.handleCheckAll(this.CHECKTYPE.ALL, '', '', e)
                        }
                      >
                        全选
                      </Checkbox>
                    </List.Item>
                  }
                  renderItem={(item) => {
                    const opm =
                      this.state.opPermisson.length > 0
                        ? this.state.opPermisson.find(
                            (i) => item.id == i.menu && item.code == i.code
                          ) || {}
                        : {}
                    return (
                      <List.Item>
                        <div>{item.name}</div>
                        {this.state.operates.length > 0
                          ? this.state.operates.map((op) => (
                              <Checkbox
                                key={op.id}
                                checked={
                                  opm.content
                                    ? opm.content[op.code] || false
                                    : false
                                }
                                onChange={(e) =>
                                  this.handleCheckOne(item.id, op.code, e)
                                }
                              >
                                {op.name}
                              </Checkbox>
                            ))
                          : null}

                        {/* 全选 */}
                        <Checkbox
                          checked={opm.checked}
                          indeterminate={opm.indeterminate || false}
                          onChange={(e) =>
                            this.handleCheckAll(
                              this.CHECKTYPE.LINE,
                              '',
                              item.id,
                              e
                            )
                          }
                        >
                          全选
                        </Checkbox>
                      </List.Item>
                    )
                  }}
                />
              ) : null}
            </div>
          </div>
        </TabPane>
        <TabPane tab="数据权限" key="data">
          <div className={style.contentBox}>
            <div className={style.leftBox}>
              <Menu
                mode="inline"
                style={{ width: 200 }}
                onClick={this.handleRoleClick}
              >
                <Menu.ItemGroup title="安全角色列表">
                  {this.state.dataRoleList.map((ro) => (
                    <Menu.Item key={ro.id}>{ro.name}</Menu.Item>
                  ))}
                </Menu.ItemGroup>
              </Menu>
            </div>
            <div className={style.rightBox}>
              {this.state.allMenuList.length > 0 ? (
                <List
                  dataSource={this.state.allMenuList}
                  header={
                    <List.Item>
                      <div className={style.item}>功能名称</div>
                      {this.state.dataOperates.length > 0
                        ? this.state.dataOperates.map((op) => (
                            <div className={style.item} key={op.id}>
                              <Checkbox
                                checked={op.checked}
                                indeterminate={op.indeterminate || false}
                                onChange={(e) =>
                                  this.handleDataCheckAll(
                                    op.id,
                                    e.target.checked
                                  )
                                }
                              >
                                全选
                              </Checkbox>
                            </div>
                          ))
                        : null}
                    </List.Item>
                  }
                  renderItem={(item) => (
                    <List.Item>
                      <div className={style.item}>{item.name}</div>
                      {this.state.dataOperates.length > 0
                        ? this.state.dataOperates.map((op) => {
                            const dp = this.state.dataPermission.find(
                              (dp) => dp.menu == item.id
                            )
                            return (
                              <div className={style.item} key={op.id}>
                                <Checkbox
                                  checked={dp ? dp.datas == op.id : false}
                                  onChange={(e) =>
                                    this.handleDataCheckOne(
                                      item.id,
                                      op.id,
                                      e.target.checked
                                    )
                                  }
                                >
                                  <Tooltip title={op.comment}>
                                    {op.text}
                                  </Tooltip>
                                </Checkbox>
                              </div>
                            )
                          })
                        : null}
                    </List.Item>
                  )}
                />
              ) : null}
            </div>
          </div>
        </TabPane>
      </Tabs>
    )
  }
}

export default SystemPermission
