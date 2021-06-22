import React from 'react'
import BaseForm from '@/components/Base/Form/form'
import { Button } from 'antd'

import BlogBaseAPI from '@/api/blog/base'
import utils from '@/utils/utils'
import { uploadBlogFile } from '@/api/common'

class BlogBase extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasData: false,
      formData: {},
      showData: false,
    }

    this.handleSave = this.handleSave.bind(this)
  }

  componentDidMount() {
    BlogBaseAPI.getBase().then((resp) => {
      console.log('基本信息:', resp)
      let items = this.tabs[0].items
      if (resp.data != null) {
        items.forEach((item) => {
          item.value = resp.data[item.key]
        })
      }

      this.setState({
        hasData: resp.data != null,
        formData: resp.data || {},
        showData: true,
      })
    })
  }

  tabs = [
    {
      name: '基本信息',
      key: 'base',
      items: [
        {
          label: '网站名称',
          key: 'name',
          required: true,
        },
        {
          label: '网站地址',
          required: true,
          key: 'url',
        },
        {
          label: 'logo',
          type: 'upload',
          key: 'logo',
        },
        {
          label: '分隔符',
          key: 'split',
        },
        {
          label: '网站标题',
          required: true,
          key: 'title',
        },
        {
          label: '关键字',
          key: 'keywords',
        },
        {
          label: '网站描述',
          type: 'textarea',
          key: 'description',
        },
        {
          label: '备案号',
          key: 'icp',
        },
        {
          label: '底部文字',
          type: 'textarea',
          key: 'footer',
        },
        {
          label: 'ico图标',
          type: 'upload',
          key: 'ico',
          width: '60px',
          height: '60px',
          value: '',
          accept: 'image/x-icon',
        },
      ],
    },
    {
      name: 'SEO设置',
      key: 'seo',
      items: [
        {
          label: '百度推送key',
          key: 'baidu_push',
        },
        {
          label: '百度统计key',
          key: 'baidu_tongji',
        },
        {
          label: '谷歌推送key',
          key: 'google_push',
        },
        {
          label: '必应推送key',
          key: 'bing_push',
        },
        {
          label: '搜狗推送key',
          key: 'sogou_push',
        },
        {
          label: '神马推送key',
          key: 'shenma_push',
        },
        {
          label: '360推送key',
          key: 'so_push',
        },
      ],
    },
    {
      name: '广告设置',
      key: 'ads',
      items: [
        {
          label: '百度广告头部',
          key: 'baidu_ad_head',
        },
        {
          label: '百度广告代码',
          type:'textarea',
          key: 'baidu_ad_code',
        },
        {
          label: '谷歌广告头部',
          key: 'google_ad_head',
        },
        {
          label: '谷歌广告代码',
          type:'textarea',
          key: 'google_ad_code',
        },
      ],
    },
  ]

  async handleFileUpload(values) {
    if (values.ico && values.ico.file) {
      let file = values.ico.file.originFileObj
      let formData = new FormData()
      formData.append('upload', file)
      // 上传图片
      let icoFile = await uploadBlogFile(formData)
      values.ico = icoFile.url
    }

    if (values.logo && values.logo.file) {
      let file = values.logo.file.originFileObj
      let formData = new FormData()
      formData.append('upload', file)
      // 上传图片
      let logoFile = await uploadBlogFile(formData)
      values.logo = logoFile.url
    }
  }

  handleSave() {
    const form = this.refs.form
    let _this = this
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      await this.handleFileUpload(values)

      console.log(values)
      if (_this.state.hasData) {
        values.id = _this.state.formData.id
        BlogBaseAPI.updateBase(values).then((resp) => {
          console.log('更新结果', resp)
          utils.successToast('更新成功')
        })
      } else {
        BlogBaseAPI.addBase(values).then((resp) => {
          console.log('结果', resp)
          utils.successToast('添加成功')
        })
      }
    })
  }

  render() {
    return this.state.showData ? (
      <div>
        <BaseForm
          tabs={this.tabs}
          formData={this.state.formData}
          ref="form"
        ></BaseForm>
        <Button
          onClick={this.handleSave}
          style={{ width: '200px', margin: '0 auto', display: 'block' }}
          type="primary"
        >
          保存
        </Button>
      </div>
    ) : null
  }
}

export default BlogBase
