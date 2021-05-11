import React from 'react'
import { Table, Button, AutoComplete } from 'antd'

export default class WecTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      pageParams: {
        page: 1,
        size: 10,
      },
      listOp: [], //
      loading: false,
      totalHeight: 0,
      pagination: {
        showSizeChanger: true,
        current: 0,
        total: 0,
        pageSize: 0,
      },
    }
  }

  componentDidMount() {
    this.calHeight()
    this.refreshTable()

    window.onresize = () => {
      this.calHeight()
    }
  }

  refreshTable() {
    this.loadPageData(this.state.pageParams)
  }

  loadPageData(pageParams) {
    this.setState({
      loading: true,
    })
    // console.log('...loadPageData', pageParams)
    this.props.dataSource(pageParams).then((resp) => {
      // console.log('..........', resp)
      this.setState({
        list: resp.data.data,
        loading: false,
        pagination: {
          showSizeChanger: true,
          current: Number(resp.data.current_page),
          total: Number(resp.data.total),
          pageSize: Number(resp.data.per_page),
        },
      })
    })
  }

  pagination = {
    // locale: {
    //   items_per_page: '条/页'
    //   // Options.jsx
    //   // items_per_page: '条/页',
    //   // jump_to: '跳至',
    //   // jump_to_confirm: '确定',
    //   // page: '页',

    //   // // Pagination.jsx
    //   // prev_page: '上一页',
    //   // next_page: '下一页',
    //   // prev_5: '向前 5 页',
    //   // next_5: '向后 5 页',
    //   // prev_3: '向前 3 页',
    //   // next_3: '向后 3 页',
    // },
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showTotal: (total) => `共 ${total} 条`,
    onChange: (page, size) => {
      // console.log('onChange', page, size)
      this.setState({
        pageParams: {
          page,
          size,
        },
      })
      this.loadPageData({ page, size })
    },
    onShowSizeChange: (page, size) => {
      // console.log('onShowSizeChange', page, size)
      this.setState({
        pageParams: {
          page,
          size,
        },
      })
      this.loadPageData({ page, size })
    },
  }

  calHeight() {
    let queryOpHeight =
      (this.refs.queryOp && this.refs.queryOp.getBoundingClientRect().height) ||
      0
    let listOpHeight =
      (this.refs.listOp && this.refs.listOp.getBoundingClientRect().height) || 0
    let windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    //64 顶部导航  42 面包屑 30 容器边距 57 分页器高度 40 表格整体高度会比设置高度高40
    let tableHeight =
      windowHeight - 64 - 42 - 30 - 57 - 40 - queryOpHeight - listOpHeight

    this.setState({
      totalHeight: tableHeight,
    })
  }

  getListOp() {
    return (
      <Button.Group>
        <Button
          onClick={this.props.add}
          icon="plus"
          size="small"
          type="primary"
        >
          添加
        </Button>
        <Button onClick={this.props.view} icon="edit" size="small">
          单选
        </Button>
        <Button onClick={this.props.mutiChoose} icon="bars" size="small">
          多选
        </Button>
        {this.props.listOp}
      </Button.Group>
    )
  }

  render() {
    let scrollX = this.props.columns.reduce(
      (tol, cur) => ~~tol + ~~cur.width,
      300
    )
    return (
      <div>
        {this.props.queryOp ? (
          <div className="wec-list__query" ref="queryOp">
            {this.props.queryOp}
          </div>
        ) : null}

        {this.state.listOp ? (
          <div className="wec-list__op" ref="listOp">
            {this.getListOp()}
          </div>
        ) : null}

        <div className="wec-list__content">
          <Table
            rowKey={(record) => record.id}
            size="small"
            scroll={{ x: scrollX, y: this.state.totalHeight || 350 }}
            bordered
            expandable={{ ...this.props.expandable }}
            loading={this.state.loading}
            pagination={Object.assign(this.pagination, this.state.pagination)}
            dataSource={this.state.list}
            columns={this.props.columns}
          />
        </div>
      </div>
    )
  }
}
