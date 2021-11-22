import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'

import { BaseTable, BaseForm } from '@admin/components/Base'
import roleApi from '@admin/api/system/role'
import utils from '@admin/utils/utils'

class SystemRole extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      readOnly: false,
      formData: {},
      FormItems: this.FormItems
    }
  }

  componentDidMount() {
    // this.getMenuTree()
  }

  FormItems = {
    items: [
      {
        hidden: true,
        type: 'text',
        label: '主键',
        key: 'id',
        value: '',
        required: false,
        rules: []
      },
      {
        type: 'input',
        label: '角色名称',
        key: 'name',
        value: '',
        required: true,
        rules: []
      },
      {
        type: 'input',
        label: '角色编码',
        key: 'code',
        value: '',
        required: true
      },
      {
        type: 'select',
        label: '角色类型',
        labelInValue: false,
        // 1:路由，2:权限
        options: [
          {
            id: 1,
            name: '路由'
          },
          {
            id: 2,
            name: '权限'
          }
        ],
        key: 'type',
        value: '1',
        required: true
      },
      {
        type: 'input',
        label: '菜单排序',
        key: 'order',
        value: '',
        required: true
      }
    ]
  }

  loadData(params) {
    return roleApi.getList(params)
  }

  handleDetial(row) {
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: true
    })
  }

  handleEdit(row) {
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
        roleApi.delete({ id: row.record.id }).then(resp => {
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

  listOp = [
    // <Button icon="bars" size="small">
    //   多选
    // </Button>
  ]

  queryOp = (<div>查询区域</div>)

  columns = utils.mergeColumns([
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      width: 150
    },
    {
      title: '角色类型',
      width: 100,
      render: (row, record) => {
        return <div>{record.type == 1 ? '路由' : '权限'}</div>
      }
    },
    {
      title: '角色状态',
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
      roleApi.update(form).then(resp => {
        this.setState({
          showModal: false
        })
        this.refs.table.refreshTable()
      })
    } else {
      roleApi.add(form).then(resp => {
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

export default SystemRole
