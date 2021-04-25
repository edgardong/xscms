import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'
import { withRouter } from 'react-router-dom'
import { BaseTable, BaseForm } from '@/components/Base'
import BaseAPI from '../../api/batur/project'
import utils from '@/utils/utils'

@withRouter
class BtrProject extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      readOnly: false,
      formData: {},
      FormItems: this.FormItems,
      model: '',
      canshow: false,
      columns: [],
      loadData: null,
    }
  }

  componentDidMount() {
    let loadData = (params) => BaseAPI.getProjectPageList(params)
    this.setState({
      canshow: true,
      loadData,
    })
  }

  sexOptions = [
    {
      id: 1,
      name: '男',
    },
    {
      id: 2,
      name: '女',
    },
    {
      id: 3,
      name: '未知',
    },
  ]

  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 30,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '项目费用',
      dataIndex: 'price',
      width: 100,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
      align: 'center',
    },
    {
      title: '创建时间',
      width: 100,
      align: 'center',
      dataIndex: 'create_time',
    },
  ]

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
        type: 'input',
        label: '项目名称',
        key: 'name',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '项目费用',
        key: 'price',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '备注',
        key: 'remark',
        value: '',
        required: false,
        rules: [],
      },
    ],
  }

  loadData = (params) => {
    return BaseAPI.getList( params)
  }

  handleDetial(row) {
    console.log('查看的数据', row)
    this.setState({
      formData: row.record,
      showModal: true,
      readOnly: true,
    })
  }

  handleEdit(row) {
    console.log('编辑的数据', row.record)
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
        BaseAPI.deleteProject({ id: row.record.id }).then((resp) => {
          utils.successToast(resp.msg)
          this.refs.table.refreshTable()
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

  operateColumn = {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
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
  }

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

  // 减法
  accDes(arg1, arg2, n) {
    var r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return ((arg1 * m - arg2 * m) / m).toFixed(n || 2)
  }

  handleSubmit(form) {
    console.log('处理后的订单', form)
    if (form.id) {
      BaseAPI.updateProject(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    } else {
      BaseAPI.addProject(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    }
  }

  render() {
    // let columns = this.state.columns
    let columns = this.state.canshow ? this.columns : []

    columns.forEach((col) => {
      // let item = col.find((cl) => cl.renderOptions)
      // console.log(item)
      if (col.renderOptions) {
        col.render = (text, record, index) => {
          let tmp = col.renderOptions.find((op) => op.id === text)
          return tmp ? (
            tmp.color ? (
              <span style={{ color: tmp.color }}>{tmp.name}</span>
            ) : (
              <span>{tmp.name}</span>
            )
          ) : null
        }
      }
    })

    return this.state.canshow ? (
      <div>
        <BaseTable
          ref="table"
          add={() => this.handleAdd()}
          listOp={this.listOp}
          queryOp={this.queryOp}
          columns={columns}
          dataSource={this.state.loadData}
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
    ) : null
  }
}

export default BtrProject
