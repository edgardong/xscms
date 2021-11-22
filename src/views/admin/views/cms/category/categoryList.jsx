import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'

import { BaseTable, BaseForm } from '@admin/components/Base'
import apis from '@admin/api/cms/category'
import utils from '@admin/utils/utils'

class Category extends React.Component {
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
    apis.getAll().then((resp) => {
      treeData = resp.data.map((v) => ({
        title: v.name,
        id: v.id,
        parent: v.parent,
        value: v.id,
      }))
      let item = this.FormItems.items.find(
        (i) => i.type === 'treeselect' && i.key === 'parent'
      )
      item.treeData = treeData
    })
  }

  componentDidMount() {
    // this.getMenuTree()
  }

  TypeOptions = [{
    id: 1,
    name: '栏目',
  },
  {
    id: 2,
    name: '频道',
  },
  {
    id: 3,
    name: '链接',
  },
  {
    id: 4,
    name: '单页',
  },]

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
        type: 'select',
        label: '类型',
        value: '',
        key:'type',
        required: true,
        rules: [],
        option: {
          key: 'id',
          title: 'name',
        },
        options: this.TypeOptions,
      },
      {
        type: 'treeselect',
        label: '上级分类',
        key: 'parent',
        value: '',
        required: false,
        rules: [],
        option: {
          key: 'id',
          title: 'name',
        },
        treeData: [],
      },
      {
        type: 'input',
        label: '名称',
        key: 'name',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'switch',
        label: '是否在菜单栏显示',
        key: 'show',
        text:['否','是'],
        value: '',
        required: false,
        rules: [],
      },
      {
        type: 'input',
        label: '编码',
        key: 'code',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '排序',
        key: 'order',
        value: '',
        required: true,
        rules: [],
      },
    ],
  }

  loadData(params) {
    return apis.getList(params)
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
    utils
      .deleteConfirm()
      .then(() => {
        apis.delete({ id: row.record.id }).then((resp) => {
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
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 80,
    },
    {
      title: '状态',
      width: 90,
      render: (row, record) => {
        return <div>{record.status ? '禁用' : '启用'}</div>
      },
    },
    {
      title: '类型',
      width: 90,
      render: (row, record) => {
        return <div>{this.TypeOptions.find(t=>t.id==record.type).name}</div>
      },
    },
    {
      title: '是否在菜单栏显示',
      width: 100,
      render: (row, record) => {
        return <div>{record.show ? '显示' : '不显示'}</div>
      },
    },
    {
      title: '排序',
      dataIndex: 'order',
      width: 100,
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
      apis.update(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
        this.getMenuTree()
      })
    } else {
      apis.add(form).then((resp) => {
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

export default Category
