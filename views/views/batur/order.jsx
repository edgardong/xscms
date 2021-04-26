import React, { Fragment } from 'react'
import {
  Menu,
  Icon,
  Button,
  Table,
  Modal,
  Form,
  Select,
  Input,
  Row,
  Col,
  List,
  InputNumber,
} from 'antd'
import { withRouter } from 'react-router-dom'
import { BaseTable, BaseForm } from '@/components/Base'
import BaseAPI from '../../api/batur/order'
import MemberAPI from '../../api/batur/member'
import ProjectAPI from '../../api/batur/project'
import GoodsAPI from '../../api/batur/goods'
import utils from '@/utils/utils'

@withRouter
class BtrOrder extends React.Component {
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
      memberList: [],
      projectList: [],
    }

    this.loadOptionData()
  }

  loadOptionData = async () => {
    let members = (await MemberAPI.getMemberList()).data
    let projects = (await ProjectAPI.getProjectList()).data
    let goods = (await GoodsAPI.getGoodsList()).data

    // let userItem = this.FormItems.items.find(
    //   (it) => it.type == 'select' && it.key == 'member'
    // )
    // let projectItem = this.FormItems.items.find(
    //   (it) => it.type == 'select' && it.key == 'project'
    // )

    // userItem.options = members.map((m) => ({ id: m.id, name: m.name }))
    // projectItem.options = projects.map((m) => ({ id: m.id, name: m.name }))

    this.setState({
      memberList: members,
      projectList: projects,
      goodsList: goods,
    })
  }

  /**
   * 获取会员列表
   */
  getMemberList = () => {
    MemberAPI.getMemberList().then((resp) => {
      // console.log('member', resp)
      this.setState({
        memberList: resp.data,
      })
    })
  }

  /**
   * 获取项目列表
   */
  getProjectList = () => {
    ProjectAPI.getProjectList().then((resp) => {
      // console.log('project', resp)
      this.setState({
        projectList: resp.data,
      })
    })
  }

  componentDidMount() {
    let loadData = (params) => BaseAPI.getOrderPageList(params)
    let columns = utils.mergeColumns([...this.columns, this.operateColumn])
    // this.getMemberList()
    // this.getProjectList()

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
      title: '用户名称',
      dataIndex: 'user',
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

  // FormItems = {
  //   items: [
  //     {
  //       hidden: true,
  //       type: 'text',
  //       label: '主键',
  //       key: 'id',
  //       value: '',
  //       required: false,
  //       rules: [],
  //     },
  //     {
  //       type: 'select',
  //       label: '项目名称',
  //       key: 'project',
  //       value: '',
  //       required: true,
  //       rules: [],
  //       options: [],
  //     },
  //     {
  //       type: 'select',
  //       label: '用户名称',
  //       key: 'member',
  //       value: '',
  //       required: true,
  //       rules: [],
  //       options: [],
  //     },
  //     {
  //       type: 'input',
  //       label: '备注',
  //       key: 'remark',
  //       value: '',
  //       required: false,
  //       rules: [],
  //     },
  //     {
  //       type: 'list',
  //       title: '商品列表',
  //       key: 'goods',
  //       required: false,
  //       items: [
  //         {
  //           hidden: true,
  //           type: 'text',
  //           label: '主键',
  //           key: 'id',
  //           value: '',
  //           required: false,
  //           rules: [],
  //         },
  //         {
  //           type: 'select',
  //           label: '商品名称',
  //           key: 'goods_id',
  //           value: '',
  //           required: true,
  //           rules: [],
  //           options: [],
  //         },
  //         {
  //           type: 'input',
  //           label: '商品费用',
  //           key: 'price',
  //           value: '',
  //           required: true,
  //           rules: [],
  //         },
  //         {
  //           type: 'input',
  //           label: '备注',
  //           key: 'remark',
  //           value: '',
  //           required: true,
  //           rules: [],
  //         },
  //       ],
  //     },
  //   ],
  // }

  loadData = (params) => {
    return BaseAPI.getList(params)
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
        BaseAPI.deleteOrder({ id: row.record.id }).then((resp) => {
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

  handleAddGoods() {
    let { formData } = this.state
    if (!formData.goods) {
      formData.goods = [{}]
    } else {
      formData.goods.push({})
    }
    this.setState({
      formData,
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
    console.log('处理后的订单', form)
    if (form.id) {
      BaseAPI.updateOrder(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    } else {
      BaseAPI.addOrder(form).then((resp) => {
        this.setState({
          showModal: false,
        })
        this.refs.table.refreshTable()
      })
    }
  }

  render() {
    // let columns = this.state.columns
    let columns = this.state.columns || this.columns || []
    let { formData, memberList, projectList, goodsList } = this.state
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

        {/* <BaseForm
          formData={this.state.formData}
          handleSubmit={(vals) => this.handleSubmit(vals)}
          handleCancel={() => this.handleModalCancel()}
          readonly={this.state.readOnly}
          showModal={this.state.showModal}
          {...this.FormItems}
        >
        </BaseForm> */}

        <Modal
          title="添加订单"
          width={'60%'}
          visible={this.state.showModal}
          readOnly={this.state.readOnly}
          onOk={(vals) => this.handleSubmit(vals)}
          onCancel={() => this.handleModalCancel()}
        >
          <Form layout="vertical">
            <Row>
              <Col span={10}>
                <Form.Item label="用户">
                  <Select value={formData.member}>
                    {memberList.map((m) => (
                      <Select.Option key={m.id} value={m.id}>
                        {m.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10} offset={1}>
                <Form.Item label="项目">
                  <Select value={formData.project}>
                    {projectList.map((p) => (
                      <Select.Option key={p.id} value={p.id}>
                        {p.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={10}>
                <Form.Item label="价格">
                  <Input value={formData.price}></Input>
                </Form.Item>
              </Col>
              <Col span={10} offset={1}>
                <Form.Item label="备注">
                  <Input value={formData.remark}></Input>
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              消费商品
              <Button type="primary" onClick={() => this.handleAddGoods()}>
                添加商品
              </Button>
            </div>
            <List bordered>
              {formData.goods && formData.goods.length > 0
                ? formData.goods.map((good) => (
                    <List.Item actions={[<Button type="danger">删除</Button>]}>
                      <Row key={good.id} span={24}>
                        <Col span={7}>
                          <Form.Item label="商品">
                            <Select value={good.goods_id}>
                              {goodsList.map((p) => (
                                <Select.Option key={p.id} value={p.id}>
                                  {p.name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={4} offset={1}>
                          <Form.Item label="数量">
                            <InputNumber min={0} value={good.count}></InputNumber>
                          </Form.Item>
                        </Col>
                        <Col span={4} offset={1}>
                          <Form.Item label="价格">
                            <Input value={good.price}></Input>
                          </Form.Item>
                        </Col>
                        <Col span={6} offset={1}>
                          <Form.Item label="备注">
                            <Input value={good.remark}></Input>
                          </Form.Item>
                        </Col>
                      </Row>
                    </List.Item>
                  ))
                : null}
            </List>
          </Form>
          <div style={{marginTop:'15px'}}>本次共消费： 100元</div>
        </Modal>
      </div>
    ) : null
  }
}

export default BtrOrder
