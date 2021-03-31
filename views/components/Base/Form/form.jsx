import React from 'react'
import {
  Tabs,
  Button,
  Form,
  Input,
  Switch,
  Upload,
  Select,
  TreeSelect,
  DatePicker,
  Row,
  Col,
} from 'antd'
import common from '@/assets/less/common.less'

import moment from 'moment'

export default Form.create({})(
  class extends React.Component {
    constructor(props) {
      super(props)
    }

    setFieldsValue(data) {
      this.props.from.setFieldsValue(data)
    }

    getItemValue(key, item) {
      if (item.type == 'select' && item.mode == 'multiple') {
        return this.props.formData[key]
          ? JSON.parse(this.props.formData[key])
          : []
      }
      if (item.type == 'datetime') {
        // console.log(this.props.formData[key])
        // if(this.props.formData[key]) {
        //   console.log(moment(this.props.formData[key], 'YYYY-MM-DD HH:mm:ss'))
        // }
        return this.props.formData[key]
          ? moment(this.props.formData[key], 'YYYY-MM-DD HH:mm:ss')
          : null
      }
      return this.props.formData[key]
    }
    /**
     * 获取对应的控件
     * @param {*} item 控件的值
     */
    getItem(item) {
      switch (item.type) {
        case 'select':
          return (
            <Select
              placeholder={`请输入${item.label}`}
              disabled={this.props.readonly}
              mode={item.mode}
              labelInValue={item.labelInValue}
              onChange={item.onChange}
            >
              {item.options.map((opt) => (
                <Select.Option key={opt.id} value={opt.id}>
                  {opt.name}
                </Select.Option>
              ))}
            </Select>
          )
        case 'datetime':
          return (
            <DatePicker
              showTime
              disabled={this.props.readonly}
              placeholder={`请选择${item.label}`}
              onChange={(val) => {
                // console.log(item, val)
                item.value = val.format('YYYY-MM-DD HH:mm:ss')
              }}
              onOk={(val) => {
                // console.log(item, val)
                item.value = val.format('YYYY-MM-DD HH:mm:ss')
              }}
            />
          )
        case 'treeselect':
          // console.log('????', item.treeData)
          return (
            <TreeSelect
              allowClear={true}
              treeDataSimpleMode={
                item.simpleMode !== undefined ? item.simpleMode : true
              }
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder={`请输入${item.label}`}
              treeData={item.treeData}
              disabled={this.props.readonly}
              treeDefaultExpandAll
              onChange={(val) => (item.value = val)}
            />
          )
        case 'input':
          return (
            <Input
              disabled={this.props.readonly}
              placeholder={`请输入${item.label}`}
              type="input"
            />
          )
          break
        case 'switch':
          return (
            <Switch
              disabled={this.props.readonly}
              checkedChildren={item.text[1]}
              unCheckedChildren={item.text[0]}
            />
          )
          break
        case 'textarea':
          return (
            <Input.TextArea
              rows={4}
              disabled={this.props.readonly}
              placeholder={`请输入${item.label}`}
            />
          )
          break
        case 'upload':
          return (
            <Upload disabled={this.props.readonly} accept={item.accept || '*'}>
              {item.value ? (
                <img
                  style={{
                    width: item.width || '140px',
                    height: item.height ||'60px',
                    cursor: 'pointer',
                    border: '1px solid #ebebeb',
                  }}
                  src={item.value}
                />
              ) : (
                <Button>添加照片</Button>
              )}
            </Upload>
          )
          break
        default:
          return (
            <Input
              disabled={this.props.readonly}
              placeholder={`请输入${item.label}`}
              type="input"
            />
          )
          break
      }
    }

    getColumnItems(getFieldDecorator, items, formItemLayout) {
      return (
        <Row gutter={24}>
          {items.map((item, index) =>
            item.hidden ? null : (
              <Col span={24 / formItemLayout.columns} key={index}>
                <Form.Item
                  className={item.hidden ? common.hidden : ''}
                  key={item.key}
                  {...formItemLayout}
                  label={item.label}
                >
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        message: item.required ? `请输入${item.label}` : '',
                      },
                    ].concat(item.rules || []),
                    valuePropName: item.type == 'switch' ? 'checked' : 'value',
                    initialValue: this.getItemValue(item.key, item),
                  })(this.getItem(item))}
                </Form.Item>
              </Col>
            )
          )}
        </Row>
      )
    }

    /**
     * 获取表单
     */
    getFormItems(formItemLayout = {}) {
      const { getFieldDecorator } = this.props.form

      formItemLayout = {
        columns: 1,
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
        ...formItemLayout,
      }

      return this.props.tabs ? (
        <Tabs defaultActiveKey={this.props.tabs[0].key}>
          {this.props.tabs.map((tab) => (
            <Tabs.TabPane tab={tab.name} key={tab.key}>
              {tab.render != null
                ? tab.render(tab.value)
                : this.getColumnItems(
                    getFieldDecorator,
                    tab.items,
                    formItemLayout
                  )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        this.getColumnItems(getFieldDecorator, this.props.items, formItemLayout)
      )
    }

    render() {
      return <Form autoComplete="off">{this.getFormItems()}</Form>
    }
  }
)
