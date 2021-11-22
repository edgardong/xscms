import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'
import { BaseTable, BaseForm } from '@admin/components/Base'
import userApi from '@admin/api/system/user'
import utils from '@admin/utils/utils'

export default class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      readOnly: false,
      FormItems: this.FormItems
    }

    this.getAllUserRoles()
  }

  FormItems = {
    items: [
      {
        hidden: true,
        type: 'text',
        key: 'id',
        value: '',
        required: false
      },
      {
        label: '用户名',
        key: 'username',
        value: '',
        required: true
      },
      {
        label: '用户昵称',
        key: 'nickname',
        value: '',
        required: true
      },
      {
        type: 'tel',
        label: '用户电话',
        key: 'mobile',
        value: '',
        required: true
      },
      {
        hidden: true,
        key: 'role_names',
        value: '',
        required: false
      },
      {
        type: 'select',
        label: '用户角色',
        key: 'roles',
        value: [],
        required: true,
        labelInValue: true,
        mode: 'multiple',
        options: [],
        onChange: val => {}
      }
    ]
  }

  getAllUserRoles() {
    userApi.getAllRoles({}).then(resp => {
      let item = this.FormItems.items.find(
        i => i.type === 'select' && i.key === 'roles'
      )
      item.options = resp.data
    })
  }

  loadData(params) {
    return userApi.getUserList(params)
  }

  handleDetial(row) {
    // console.log('detail', row.record)
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: true
    })
  }

  handleEdit(row) {
    // console.log('edit', row.record)
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: false
    })
  }

  /**
   * 删除用户
   * @param {Object} row 用户数据
   */
  handleDelete(row) {
    utils
      .deleteConfirm()
      .then(() => {
        userApi.deleteUser({ id: row.record.id }).then(resp => {
          utils.successToast(resp.msg)
          this.refs.table.refreshTable()
        })
      })
      .catch(() => {})
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  // 生命周期函数
  componentDidMount() {}

  listOp = [
    // <Button icon="bars" size="small">
    //   多选
    // </Button>
  ]

  queryOp = (<div>查询区域</div>)

  columns = utils.mergeColumns([
    {
      title: '用户名',
      dataIndex: 'username',
      width: 150
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: 150
    },
    {
      title: '用户角色',
      dataIndex: 'role_names',
      width: 150,
      render: (index, record) => {
        return (
          <div>
            {record.roles
              ? JSON.parse(record.roles)
                  .map(r => r.label)
                  .join(',')
              : ''}
          </div>
        )
      }
    },
    {
      title: '联系电话',
      width: 120,
      render: (index, record) => {
        return <div>{record.mobile}</div>
      }
    },
    {
      title: '用户类型',
      width: 100,
      render: (row, record) => {
        return <div>{record.usertype == 1 ? '普通用户' : ''}</div>
      }
    },
    {
      title: '用户状态',
      width: 90,
      render: (row, record) => {
        return <div>{record.status ? '禁用' : '启用'}</div>
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 200
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={e => this.handleDetial(row)}>查看</Button>
            <Button onClick={e => this.handleEdit(row)} type="primary">
              编辑
            </Button>
            <Button ghost onClick={e => this.handleDelete(row)} type="danger">
              删除
            </Button>
          </Button.Group>
        )
      }
    }
  ])

  /**
   * 添加数据
   */
  handleAdd() {
    this.setState({
      formData: {},
      showModal: true,
      readOnly: false
    })
  }

  handleSubmit(form) {
    if (form.id) {
      userApi.updateUser(form).then(resp => {
        this.setState({
          showModal: false
        })
        this.refs.table.refreshTable()
      })
    } else {
      userApi.addUser(form).then(resp => {
        this.setState({
          showModal: false
        })
        this.refs.table.refreshTable()
      })
    }
  }

  render() {
    return (
      <div>
        <BaseTable
          ref="table"
          add={() => this.handleAdd()}
          listOp={this.listOp}
          queryOp={this.queryOp}
          columns={this.columns}
          dataSource={this.loadData}
        />

        <BaseForm
          formData={this.state.formData}
          handleSubmit={vals => this.handleSubmit(vals)}
          handleCancel={() => this.handleModalCancel()}
          readonly={this.state.readOnly}
          showModal={this.state.showModal}
          {...this.FormItems}
        ></BaseForm>
      </div>
    )
  }
}
