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
  message,
} from 'antd'
import { withRouter } from 'react-router-dom'
import { BaseTable, BaseForm } from '@/components/Base'
import BaseAPI from '../../api/batur/order'
import MemberAPI from '../../api/batur/member'
import ProjectAPI from '../../api/batur/project'
import GoodsAPI from '../../api/batur/goods'
import utils from '@/utils/utils'
import OrderForm from './orderForm'

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
  }

  formRef = React.createRef()

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
    let member = this.columns.find((col) => col.dataIndex == 'member')
    member.renderOptions = members
    // console.log('...', 1, member)

    // userItem.options = members.map((m) => ({ id: m.id, name: m.name }))
    // projectItem.options = projects.map((m) => ({ id: m.id, name: m.name }))

    this.setState({
      memberList: members,
      projectList: projects,
      goodsList: goods,
      canshow: true,
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
    // let loadData = (params) => BaseAPI.getOrderPageList(params)
    this.loadOptionData().then((resp) => {
      let columns = utils.mergeColumns([...this.columns, this.operateColumn])

      this.setState({
        // loadData,
        columns,
      })
    })
    // this.getMemberList()
    // this.getProjectList()
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
      title: '订单号',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '用户名称',
      dataIndex: 'member',
      width: 100,
      align: 'center',
      renderOptions: [],
    },
    {
      title: '消费金额',
      dataIndex: 'price',
      width: 100,
      align: 'center',
      ellipsis: true,
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

  loadData = (params) => {
    return BaseAPI.getOrderPageList(params)
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
        BaseAPI.deleteOrder1(row.record).then((resp) => {
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

  queryOp = (<div></div>)

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
    },()=> {
      this.refs.form.resetFields()
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
    const { goodsList, projectList } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
      if (
        (!values.goods || values.goods.length <= 0) &&
        (!values.projects || values.projects.length <= 0)
      ) {
        message.error('请填写商品或者项目')
        return
      }
      if (values.goods && values.goods.length > 0) {
        values.goods = values.goods.map((g) => ({
          ...g,
          name: goodsList.find((gl) => gl.id == g.goods).name,
        }))
      }
      if (values.projects && values.projects.length > 0) {
        values.projects = values.projects.map((p) => ({
          ...p,
          name: projectList.find((pl) => pl.id == p.project).name,
        }))
      }
      if (values.id) {
        BaseAPI.updateBtrOrder(values).then((resp) => {
          this.setState({
            showModal: false,
          })
          this.refs.table.refreshTable()
        })
      } else {
        BaseAPI.addBtrOrder(values).then((resp) => {
          this.setState({
            showModal: false,
          })
          this.refs.table.refreshTable()
        })
      }
    })
  }

  render() {
    // let columns = this.state.columns
    let columns = this.state.columns || this.columns || []
    let { formData, memberList, projectList, goodsList } = this.state
    columns.forEach((col) => {
      // let item = col.find((cl) => cl.renderOptions)
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
          dataSource={this.loadData}
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

        <OrderForm
          ref="form"
          memberList={memberList}
          projectList={projectList}
          goodsList={goodsList}
          readOnly={this.state.readOnly}
          showModal={this.state.showModal}
          handleSubmit={(vals) => this.handleSubmit(vals)}
          handleCancel={() => this.handleModalCancel()}
          formData={this.state.formData}
        ></OrderForm>
      </div>
    ) : null
  }
}

export default BtrOrder
