import React from 'react'
import { Table, Button, Switch } from 'antd'
import { getAllOrder } from '@/api/mall'
import cate from '@/assets/less/mall/categoryList.less'
import { BaseTable } from '@/components/Base'

export default class OrderList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  loadData(params) {
    return getAllOrder(params)
  }

  componentDidMount() {}

  columns = [
    {
      title: '订单编号',
      dataIndex: 'order_no',
      width: 160,
      align: 'center'
    },
    {
      title: '订单信息',
      width: 100,
      dataIndex: 'snap_name',
      align: 'center'
    },
    // {
    //   title: '订单图片',
    //   width: 100,
    //   align: 'center',
    //   dataIndex: 'snap_img',
    //   render: (img, record, index) => {
    //     return <img className={cate['list-image']} src={img} />
    //   }
    // },
    {
      title: '订单总额',
      width: 80,
      dataIndex: 'total_price',
      align: 'center'
    },
    {
      title: '订单状态',
      width: 80,
      dataIndex: 'status',
      align: 'center',
      render: (status, record, index) => {
        return <span>{status == 1 ? '未支付' : '已支付'}</span>
      }
    },
    {
      title: '下单时间',
      width: 140,
      dataIndex: 'create_time',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: 150,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={e => this.handleDetial(row)}>查看</Button>
            <Button ghost onClick={e => this.handleEdit(row)} type="primary">
              编辑
            </Button>
            <Button ghost onClick={e => this.handleDelete(row)} type="danger">
              删除
            </Button>
          </Button.Group>
        )
      }
    }
  ]

  render() {
    return (
      <div>
        {/* 表格区域 */}
        <div className="wec-list__content">
          <BaseTable dataSource={this.loadData} columns={this.columns} />
        </div>
      </div>
    )
  }
}
