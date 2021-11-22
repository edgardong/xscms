import React from 'react'
import { Table, Button, Switch, Spin, Divider, Input } from 'antd'

import { withRouter } from 'react-router-dom'
import { getArticleList, delArticle } from '@/api/cms/article'
import { BaseTable, BaseForm } from '@/components/Base'

@withRouter
class ArticleList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      loading: false,
    }
  }

  loadData(params) {
    return getArticleList(params)
  }

  columns = [
	  {
	    title: 'ID',
	    dataIndex: 'id',
	    width: 50,
	    align: 'center',
	    ellipsis: true,
	  },
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 200,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '阅读量',
      dataIndex: 'read_count',
      width: 40,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'publish_time',
      width: 100,
      align: 'center',
    },
    {
      title: '标签',
      width: 100,
      align: 'center',
      dataIndex: 'tags',
    },
    {
      title: '作者',
      width: 80,
      align: 'center',
      dataIndex: 'author',
    },
    {
      title: '状态',
      width: 40,
      align: 'center',
      render: (text, record, index) => {
        return record.type == 0 ? (
          <span style={{ color: '#45a776' }}>已发布</span>
        ) : (
          <span style={{ color: '#f05326' }}>草稿中</span>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: 120,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={(e) => this.handleViewDetail(row, true)}>
              查看
            </Button>
            <Button
              ghost
              onClick={(e) => this.handleViewDetail(row, false)}
              type="primary"
            >
              编辑
            </Button>
            <Button ghost onClick={(e) => this.handleDelete(row)} type="danger">
              删除
            </Button>
          </Button.Group>
        )
      },
    },
  ]

  handleDelete(row) {
    delArticle(row.record.id).then((resp) => {
      console.log('删除结果', resp)
      this.loadData()
    })
  }

  handleViewDetail(row, readonly) {
    // console.log(row)
    this.props.history.push({
      pathname: `/main/blog/article/${row.record.id}`,
      query: { readonly },
    })
  }

  handelAddArticle() {
    this.props.history.push({
      pathname: `/main/blog/article/new`,
      query: { readonly: false },
    })
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <BaseTable
            add={() => this.handelAddArticle()}
            dataSource={this.loadData}
            columns={this.columns}
          />
        </Spin>
      </div>
    )
  }
}

export default ArticleList
