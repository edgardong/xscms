import React from 'react'
import { Table, Button, Switch, Spin, Divider, Input } from 'antd'
import { getAllGoodsList, getAllCategories, getProductDetail } from '@/api/mall'
import cate from '@/assets/less/mall/categoryList.less'
import { BaseTable, BaseForm } from '@/components/Base'

export default class GoodsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: [],
      readonly: false,
      showModal: false,
      FormItems: this.FormItems,
      categorys: [],
      loading: false
    }
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  componentDidMount() {
    // this.loadData()
    getAllCategories().then(resp => {
      console.log('所有商品', resp)
      this.setState({
        categorys: resp
      })
    })
  }

  /**
   * 查看详情
   * @param {object} row 数据
   * @param {boolean} readonly 是否只读
   */
  handleViewDetail(row, readonly) {
    this.setState({
      loading: true
    })
    getProductDetail(row.record.id).then(resp => {
      let data = resp

      console.log(data)
      this.state.FormItems.tabs.forEach(tab => {
        console.log(tab)
        if (tab.render) {
          tab.value = data[tab.listKey]
        }
        tab.items &&
          tab.items.forEach(item => {
            if (item.type == 'upload') {
              // console.log('item', item)
              // console.log('item.key', item.key)
              // console.log('item.key', eval(`row.record.${item.key}`))
              // console.log('****************************')
            } else if (item.type == 'select') {
              item.options = this.state[item.optionsKey]
            }
            item.value =
              item.type == 'switch'
                ? data[item.key] == 1
                : item.key.indexOf('.') > -1
                ? eval(`data.${item.key}`)
                : data[item.key]
          })
      })
      this.setState({
        FormItems: this.state.FormItems,
        showModal: true,
        readonly,
        loading: false
      })
    })
  }

  loadData(params) {
    return getAllGoodsList(params)
  }

  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 100,
      align: 'center'
    },
    {
      title: '商品分类',
      dataIndex: 'category.name',
      width: 100,
      align: 'center'
    },
    {
      title: '商品图片',
      width: 100,
      align: 'center',
      dataIndex: 'main_img_url',
      render: (img, record, index) => {
        return <img className={cate['list-image']} src={img} />
      }
    },
    {
      title: '商品价格',
      width: 100,
      dataIndex: 'price',
      align: 'center'
    },
    {
      title: '商品库存',
      width: 100,
      dataIndex: 'stock',
      align: 'center'
    },
    {
      title: '审核可用',
      width: 80,
      dataIndex: 'is_check_show',
      align: 'center',
      render: show => {
        return (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            checked={show == 1}
          />
        )
      }
    },
    {
      title: '商品简介',
      width: 100,
      dataIndex: 'summary',
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: 130,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={e => this.handleViewDetail(row, true)}>
              查看
            </Button>
            <Button
              ghost
              onClick={e => this.handleViewDetail(row, false)}
              type="primary"
            >
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

  FormItems = {
    handleSubmit: form => {
      let _this = this
      console.log('abc', form)
      form['id'] = form.id || ''
      if (form.img.url && form.img.url.file) {
        let file = form.img.url.file.originFileObj
        let formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'category')
        // 上传图片
        uploadFile(formData).then(resp => {
          console.log('上传文件结束', resp)
          form['topic_img_id'] = resp
          _this.handleUpdateForm(form)

          _this.setState({
            showModal: false
          })
        })
      } else {
        _this.handleUpdateForm(form)
        _this.setState({
          showModal: false
        })
      }
    },
    tabs: [
      {
        name: '基本信息',
        key: 'basic',
        type: 'form',
        items: [
          {
            hidden: true,
            type: 'text',
            label: '主键',
            key: 'id',
            value: '',
            required: false,
            rules: []
          },
          {
            type: 'input',
            label: '商品名称',
            key: 'name',
            value: '',
            required: true,
            rules: []
          },
          {
            type: 'number',
            label: '商品价格',
            key: 'price',
            value: '',
            required: true,
            rules: []
          },
          {
            type: 'number',
            label: '商品库存',
            key: 'stock',
            value: '',
            required: true,
            rules: []
          },
          {
            type: 'textarea',
            label: '商品描述',
            key: 'summary',
            value: '',
            required: false,
            rules: []
          },
          {
            type: 'switch',
            label: '审核可用',
            key: 'is_check_show',
            value: false,
            required: false,
            text: ['否', '是'],
            rules: []
          },
          {
            type: 'upload',
            label: '商品主图',
            key: 'main_img_url',
            value: '',
            required: false,
            rules: []
          },
          {
            type: 'select',
            label: '商品分类',
            key: 'category.id',
            options: [],
            optionsKey: 'categorys',
            value: '',
            required: false,
            rules: []
          }
        ]
      },
      {
        name: '详细信息',
        key: 'detail',
        type: 'render',
        listKey: 'imgs',
        value: '',
        render: value => {
          return value.map((v, index) => (
            <div style={{ width: '50%', display: 'block',margin:'0 auto' }} key={index}>
              <span>{v.order}</span>
              <img
                style={{ width: '100%', display: 'inline-block' }}
                src={v.img_url.url}
              />
              <Divider />
            </div>
          ))
        }
      },
      {
        name: '拓展信息',
        key: 'attribute',
        type: 'render',
        value: '',
        listKey: 'properties',
        render: value => {
          return value.map((v, index) => (
            <div key={index} style={{ display: 'flex' }}>
              <Input
                style={{ width: '300px' }}
                disabled={this.state.readonly}
                value={v.name}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '60px',
                  textAlign: 'center'
                }}
              >
                :
              </span>
              <Input disabled={this.state.readonly} value={v.detail} />
            </div>
          ))
        }
      }
    ]
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.loading}>
          <BaseTable dataSource={this.loadData} columns={this.columns} />
          <BaseForm
            readonly={this.state.readonly}
            handleCancel={() => this.handleModalCancel()}
            showModal={this.state.showModal}
            {...this.FormItems}
          />
        </Spin>
      </div>
    )
  }
}
