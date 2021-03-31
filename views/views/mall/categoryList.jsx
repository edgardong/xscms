import React from 'react'
import { Menu, Icon, Button, Table, Modal, Input, Upload, Switch } from 'antd'
import { BaseForm, BaseTable } from '@/components/Base'
import { getCategory, delCategory, addCategory, putCategory } from '@/api/mall'
import { uploadFile } from '@/api/common'
import cate from '@/assets/less/mall/categoryList.less'
import utils from '@/utils/utils'

export default class Category extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      showModal: false,
      FormItems: this.FormItems,
      readonly: false,
      formData:{}
    }
  }

  loadData(params) {
    return getCategory(params)
  }

  handleAdd() {
    console.log('add', this)
    this.state.FormItems.items.forEach(item => {
      item.value = item.type == 'switch' ? false : ''
    })
    this.setState({
      FormItems: this.state.FormItems,
      showModal: true
    })
  }

  handleView(row, readonly) {
    this.state.FormItems.items.forEach(item => {
      if (item.type == 'upload') {
        // console.log('item', item)
        // console.log('item.key', item.key)
        // console.log('item.key', eval(`row.record.${item.key}`))
        // console.log('****************************')
      }
      item.value =
        item.type == 'switch'
          ? row.record[item.key] == 1
          : item.key.indexOf('.') > -1
          ? eval(`row.record.${item.key}`)
          : row.record[item.key]
    })
    // this.setState({
    //   FormItems: this.state.FormItems
    // })
    let data = row.record
    // console.log('.....****.....', data)
    // this.refs.form.setFieldsValue(data)
    // console.log(this.state.FormItems)
    this.setState({
      FormItems: this.state.FormItems,
      showModal: true,
      readonly
    })
  }

  handleModalOk() {
    this.setState({
      showModal: false
    })
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  /**
   * 删除某一刚数据
   * @param {*} row
   */
  handleDelete(row) {
    utils.deleteConfirm().then(() => {
      delCategory(row.record.id).then(resp => {
        console.log('删除分类了', resp)
        this.refs.table.refreshTable()
      })
    })
    // Modal.confirm({
    //   title: '警告',
    //   content: '确定要删除这条数据？',
    //   okText: '确认',
    //   cancelText: '取消',
    //   onOk() {
    //     return
    //   },
    //   onCancel() {}
    // })
  }

  componentDidMount() {}

  handleUpdateForm(form) {
    let _this = this
    if (form.id) {
      putCategory(form).then(resp => {
        console.log('更新了一条数据', resp)
        _this.refs.table.refreshTable()
      })
    } else {
      addCategory(form).then(resp => {
        console.log('添加了一条数据', resp)
        _this.refs.table.refreshTable()
      })
    }
  }

  columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 100,
      align: 'center'
    },
    {
      title: '分类图片',
      width: 100,
      align: 'center',
      dataIndex: 'img.url',
      render: (img, record, index) => {
        return <img className={cate['list-image']} src={img} />
      }
    },
    {
      title: '描述',
      width: 200,
      dataIndex: 'description',
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
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      width: 300,
      render: (text, record, index) => {
        let row = { text, record, index }
        return (
          <Button.Group size="small">
            <Button onClick={e => this.handleView(row, true)}>查看</Button>
            <Button
              ghost
              onClick={e => this.handleView(row, false)}
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
        label: '分类名称',
        key: 'name',
        value: '',
        required: true,
        rules: []
      },
      {
        type: 'textarea',
        label: '分类描述',
        key: 'description',
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
        label: '分类照片',
        key: 'img.url',
        value: '',
        required: false,
        rules: []
      }
    ]
  }

  listOp = [
    // <Button icon="bars" size="small">
    //   多选
    // </Button>
  ]

  queryOp = (<div>查询区域</div>)

  render() {
    return (
      <div>
        <BaseTable
          ref="table"
          add={() => this.handleAdd()}
          listOp={this.listOp}
          queryOp={this.queryOp}
          dataSource={this.loadData}
          columns={this.columns}
        />

        <BaseForm
          formData = {this.state.formData}
          readonly={this.state.readonly}
          handleCancel={() => this.handleModalCancel()}
          showModal={this.state.showModal}
          {...this.FormItems}
        />
      </div>
    )
  }
}
