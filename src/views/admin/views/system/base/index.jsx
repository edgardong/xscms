import React from 'react'
import { Menu, Icon, Button, Table } from 'antd'
import { withRouter } from 'react-router-dom'
import { BaseTable, BaseForm } from '@/components/Base'
import baseApi from '@/api/system/base'
import utils from '@/utils/utils'

@withRouter
class SystemBase extends React.Component {
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

  //组件更新时被调用
  componentWillReceiveProps(nextProps) {
    let model = nextProps.match.params.module
    // console.log(key)
    // console.log('哈哈', model, this.state.model)

    if (model !== this.state.model) {
      let loadData = (params) => baseApi.getList(model, params)
      this.setState({
        model,
        loadData,
      })
      this.getEntityColums(model, true)
    }
  }

  componentDidMount() {
    // this.getMenuTree()
    // console.log(this.props.match.params.module)
    let model = this.props.match.params.module
    if (model !== this.state.model) {
      this.setState({
        model,
      })
      this.getEntityColums(model)
    }
  }

  getEntityColums(model, force) {
    baseApi.getColumns(model).then((resp) => {
      // console.log('获取的列....', resp)
      this.FormItems.items = resp.edit
      let columns = utils.mergeColumns([...resp.list, this.operateColumn])
      // console.log('要获取哪个？', model)
      let loadData = (params) => baseApi.getList(model, params)
      this.setState({
        canshow: true,
        columns,
        loadData,
      })
      // console.log('???', force)
      if (force) {
        this.refs.table.refreshTable()
      }
    })
  }

  FormItems = {
    items: [],
  }

  loadData = (params) => {
    return baseApi.getList(this.state.model, params)
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
        baseApi.delete(this.state.model, { id: row.record.id }).then((resp) => {
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

  columns = []

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
    // 针对咸鱼订单的处理
    if (this.state.model === 'xyorder') {
      form.profix = this.accDes(form.price, form.my_price)
    }
    console.log('处理后的订单', form)
    if (form.id) {
      baseApi.update(this.state.model, form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    } else {
      baseApi.add(this.state.model, form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    }
  }

  render() {
    let columns = this.state.columns
    columns.forEach((col) => {
      // let item = col.find((cl) => cl.renderOptions)
      // console.log(item)
      if (col.renderOptions) {
        col.render = (text, record, index) => {
          let tmp = col.renderOptions.find((op) => op.id === text)
          return <span style={{ color: tmp.color }}>{tmp.name}</span>
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

export default SystemBase
