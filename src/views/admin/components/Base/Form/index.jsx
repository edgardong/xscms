import React from 'react'
import { Menu, Icon, Button, Modal } from 'antd'
import BaseForm from './form'

export default class FormModal extends React.Component {
  constructor(props) {
    super(props)
    // console.log('FormModal', props)

    // if(this.props.showModal){
    //   console.log('..........')
    //   this.refs.form.setFields(this.props)
    // }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   console.log('willUpdate nextProps', nextProps)
  //   if (nextProps.showModal) {
  //     console.log('我要重新更新一下了')
  //     // this.refs.form.setFieldsValue(nextProps.items)
  //     console.log(this.refs)
  //     if (this.refs.form) {
  //       this.refs.form.setFieldsValue(nextProps.items)
  //     }
  //   }
  // }

  componentDidUpdate() {
    if (this.props.showModal && this.refs.form) {
      // this.refs.form.setFieldsValue(this.props.items)
    }
  }

  /**
   * 校验数据是否正确
   */
  handleValidate() {
    const form = this.refs.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.id = this.props.formData.id || ''
      this.props.handleSubmit(values)
      form.resetFields()
    })
  }

  render() {
    return (
      <Modal
        width={1000}
        destroyOnClose={true}
        maskClosable={false}
        visible={this.props.showModal}
        onOk={() => this.handleValidate()}
        onCancel={() => this.props.handleCancel()}
      >
        <BaseForm {...this.props} ref="form" />
      </Modal>
    )
  }
}
