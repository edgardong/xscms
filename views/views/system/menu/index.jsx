import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'

import { BaseTable, BaseForm } from '@/components/Base'
import menuApi from '@/api/system/menu'
import utils from '@/utils/utils'

class SystemMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      readOnly: false,
      formData: {},
      FormItems: this.FormItems,
    }
    this.getMenuTree()
  }

  getMenuTree() {
    let treeData = []
    menuApi.getAll().then((resp) => {
      treeData = resp.data.map((v) => ({
        title: v.name,
        id: v.id,
        pId: v.pid,
        value: v.id,
      }))
      let item = this.FormItems.items.find(
        (i) => i.type === 'treeselect' && i.key === 'pid'
      )
      item.treeData = treeData
    })
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
        rules: [],
      },
      {
        type: 'treeselect',
        label: '上级菜单',
        key: 'pid',
        value: '',
        required: false,
        rules: [],
        option: {
          key: 'id',
          title: 'name',
          key: 'id',
        },
        treeData: [],
      },
      {
        type: 'input',
        label: '菜单名称',
        key: 'name',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '菜单编码',
        key: 'code',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'select',
        label: '菜单类型',
        // 1:路由，2:权限
        options: [
          {
            id: 1,
            name: '路由',
          },
          {
            id: 2,
            name: '权限',
          },
        ],
        key: 'type',
        value: '1',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '菜单地址',
        key: 'url',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '菜单排序',
        key: 'order',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '菜单图标',
        key: 'icon',
        value: '',
        required: false,
        rules: [],
      },
    ],
  }

  loadData(params) {
    return menuApi.getList(params)
  }

  handleDetial(row) {
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: true,
    })
  }

  handleEdit(row) {
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: false,
    })
  }

  /**
   * 删除用户
   * @param {Object} row 用户数据
   */
  handleDelete(row) {
    let data = { id: row.record.id }
    utils
      .deleteConfirm()
      .then(() => {
        menuApi.delete(data).then((resp) => {
          utils.successToast(resp.msg)
          this.refs.table.refreshTable()
          this.getMenuTree()
        })
      })
      .catch(() => {})
  }

  handleModalCancel() {
    this.setState({
      showModal: false,
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
      title: '菜单名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
      width: 150,
    },
    {
      title: '菜单类型',
      width: 100,
      render: (row, record) => {
        return <div>{record.type == 1 ? '路由' : '权限'}</div>
      },
    },
    {
      title: '菜单状态',
      width: 90,
      render: (row, record) => {
        return <div>{record.status ? '禁用' : '启用'}</div>
      },
    },
    {
      title: '菜单排序',
      dataIndex: 'order',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 200,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={(e) => this.handleDetial(row)}>查看</Button>
            <Button onClick={(e) => this.handleEdit(row)} type="primary">
              编辑
            </Button>
            <Button ghost onClick={(e) => this.handleDelete(row)} type="danger">
              删除
            </Button>
          </Button.Group>
        )
      },
    },
  ])

  /**
   * 添加数据
   */
  handleAdd() {
    this.setState({
      formData: {},
      showModal: true,
      readOnly: false,
    })
  }

  handleSubmit(form) {
    if (form.id) {
      menuApi.update(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
        this.getMenuTree()
      })
    } else {
      menuApi.add(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
        this.getMenuTree()
      })
    }
  }
  expandedRowRender = (record, index) => {
    return record.children && record.children.length > 0 ? (
      <Table
        rowKey={(r) => r.id}
        columns={this.columns}
        showHeader={false}
        ellipsis={true}
        dataSource={record.children}
        pagination={false}
      />
    ) : null
  }

  render() {
    return (
      <div>
        <BaseTable
          ref="table"
          add={() => this.handleAdd()}
          listOp={this.listOp}
          queryOp={this.queryOp}
          expandable={{ expandedRowRender: this.expandedRowRender }}
          columns={this.columns}
          dataSource={this.loadData}
        />

        <BaseForm
          formData={this.state.formData}
          handleSubmit={(vals) => this.handleSubmit(vals)}
          handleCancel={() => this.handleModalCancel()}
          readonly={this.state.readOnly}
          showModal={this.state.showModal}
          {...this.FormItems}
        ></BaseForm>
      </div>
    )
  }
}

export default SystemMenu
