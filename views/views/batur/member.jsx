import React from 'react'
import {
  Menu,
  Icon,
  Button,
  Table,
  Form,
  Input,
  DatePicker,
  Drawer,
  List,
  Collapse,
} from 'antd'
import { withRouter } from 'react-router-dom'
import { BaseTable, BaseForm } from '@/components/Base'
import BaseAPI from '../../api/batur/member'
import OrderAPI from '../../api/batur/order'
import utils from '@/utils/utils'

@withRouter
class BtrMember extends React.Component {
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
      visible: false,
      orderDetail: [],
      params: {},
    }
  }

  componentDidMount() {
    let loadData = () => BaseAPI.getMemberPageList(this.state.params)
    let columns = utils.mergeColumns([...this.columns, this.operateColumn])
    this.setState({
      canshow: true,
      loadData,
      columns,
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
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   width: 30,
    //   align: 'center',
    //   ellipsis: true,
    // },
    {
      title: '会员名',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 130,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 100,
      align: 'center',
      ellipsis: true,
      renderOptions: this.sexOptions,
    },
    {
      title: '会员等级',
      dataIndex: 'level',
      width: 60,
      align: 'center',
    },
    {
      title: '会员余额',
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
      title: '加入时间',
      width: 120,
      align: 'center',
      dataIndex: 'in_time',
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
        label: '名称',
        key: 'name',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '年龄',
        key: 'age',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'select',
        label: '性别',
        key: 'sex',
        value: '',
        required: true,
        rules: [],
        options: this.sexOptions,
      },
      {
        type: 'input',
        label: '手机号',
        key: 'mobile',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '用户余额',
        key: 'price',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'datetime',
        label: '加入时间',
        key: 'in_time',
        value: '',
        required: true,
        rules: [],
      },
      {
        type: 'input',
        label: '用户等级',
        value: '',
        key: 'level',
        required: false,
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
    return BaseAPI.getMemberPageList(params)
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
        BaseAPI.deleteMember({ id: row.record.id }).then((resp) => {
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

  handleQuery() {
    this.refs.table.refreshTable()
  }

  handelQueryChange = (key, val) => {
    this.setState({
      params: {
        ...this.state.params,
        [key]: val.target.value,
      },
    })
  }

  handleReset = () => {
    this.setState({
      params: {},
    })
  }

  queryOp = (
    <div>
      <Form layout="inline">
        <Form.Item label="姓名">
          <Input
            allowClear
            onChange={(val) => this.handelQueryChange('name', val)}
          ></Input>
        </Form.Item>
        <Form.Item label="手机号">
          <Input
            allowClear
            onChange={(val) => this.handelQueryChange('mobile', val)}
          ></Input>
        </Form.Item>
        {/* <Form.Item label="加入时间">
          <DatePicker.RangePicker
            onChange={(val) => this.handelQueryChange('inTime', val)}
            allowClear
          ></DatePicker.RangePicker>
        </Form.Item> */}
        <Form.Item label="">
          <Button onClick={() => this.handleReset()}>重置</Button>
        </Form.Item>
        <Form.Item label="">
          <Button onClick={() => this.handleQuery()} type="primary">
            查询
          </Button>
        </Form.Item>
      </Form>
    </div>
  )

  operateColumn = {
    title: '操作',
    key: 'action',
    width: 260,
    fixed: 'right',
    render: (text, record, index) => {
      let row = { text, record, index }
      return (
        <Button.Group size="small">
          <Button onClick={(e) => this.handleDetial(row)}>查看</Button>
          <Button onClick={(e) => this.handleEdit(row)} type="primary">
            编辑
          </Button>
          <Button
            ghost
            onClick={(e) => this.handleViewOrder(row)}
            type="primary"
          >
            消费详情
          </Button>
          <Button ghost onClick={(e) => this.handleDelete(row)} type="danger">
            删除
          </Button>
        </Button.Group>
      )
    },
  }

  /**
   * 查看消费订单
   * @param {*} row 会员信息
   */
  handleViewOrder(row) {
    OrderAPI.getMemberOrders({ id: row.record.id }).then((resp) => {
      this.setState({
        orderDetail: resp.data,
      })
      this.showDrawer()
    })
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
    // 针对咸鱼订单的处理
    if (this.state.model === 'xyorder') {
      form.profix = this.accDes(form.price, form.my_price)
    }
    console.log('处理后的订单', form)
    if (form.id) {
      BaseAPI.updateMember(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    } else {
      BaseAPI.addMember(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    }
  }

  showDrawer = (row) => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    // let columns = this.state.columns
    let columns = this.state.canshow ? this.state.columns : []
    let orderDetail = this.state.orderDetail
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

        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          title="消费详情"
        >
          <Collapse defaultActiveKey={['0']}>
            {orderDetail && orderDetail.length > 0
              ? orderDetail.map((od) => (
                  <Collapse.Panel
                    key={od.id}
                    header={`${od.create_time} 消费 ${od.price} 元`}
                  >
                    <List
                      dataSource={JSON.parse(od.snapshot).projects}
                      renderItem={(item, index) => (
                        <List.Item key={index}>{`${item.name || ''} ${
                          item.price
                        } 元`}</List.Item>
                      )}
                    ></List>

                    <List
                      dataSource={JSON.parse(od.snapshot).goods}
                      renderItem={(item, index) => (
                        <List.Item key={index}>{`${item.name || ''} ${
                          item.price
                        } 元`}</List.Item>
                      )}
                    ></List>
                  </Collapse.Panel>
                ))
              : null}
          </Collapse>
        </Drawer>
      </div>
    ) : null
  }
}

export default BtrMember
