import React from 'react'
import {
  Tabs,
  Button,
  Form,
  Input,
  List,
  Switch,
  Upload,
  Select,
  TreeSelect,
  DatePicker,
  Modal,
  Row,
  Col,
  InputNumber,
} from 'antd'
import common from '@/assets/less/common.less'

import moment from 'moment'

export default Form.create({})(
  class extends React.Component {
    constructor(props) {
      super(props)
    }

    state = {
      projects: [],
      goods: [],
    }

    id = 10

    handleDelItem = (k, index) => {
      let _this = this
      Modal.confirm({
        title: '提示',
        content: '确定删除这项吗？',
        onOk() {
          const { form } = _this.props
          // can use data-binding to get
          const goodKeys = form.getFieldValue('goodKeys')
          const goods = form.getFieldValue('goods')
          // We need at least one passenger
          if (goodKeys.length === 1) {
            return
          }
          // can use data-binding to set
          let newGoods = goods.filter((item, pi) => pi !== index)

          form.setFieldsValue({
            goodKeys: goodKeys.filter((key) => key !== k),
            goods: newGoods,
          })
        },
        onCancel() {},
      })
    }

    handleAddProjects = () => {
      const { form } = this.props
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(this.id++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue(
        {
          keys: nextKeys,
        },
        () => {
          console.log('获取数组值', form.getFieldValue('projects'))
        }
      )
    }

    handleAddGoods = () => {
      const { form } = this.props
      // can use data-binding to get
      const goodKeys = form.getFieldValue('goodKeys')
      const nextKeys = goodKeys.concat(this.id++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue(
        {
          goodKeys: nextKeys,
        },
        () => {}
      )
    }

    remove = (k, index) => {
      let _this = this
      Modal.confirm({
        title: '提示',
        content: '确定删除这项吗？',
        onOk() {
          const { form } = _this.props
          // can use data-binding to get
          const keys = form.getFieldValue('keys')
          const projects = form.getFieldValue('projects')
          // We need at least one passenger
          if (keys.length === 1) {
            return
          }
          // can use data-binding to set
          let newProjects = projects.filter((item, pi) => pi !== index)

          form.setFieldsValue({
            keys: keys.filter((key) => key !== k),
            projects: newProjects,
          })
        },
        onCancel() {},
      })
    }

    render() {
      const { getFieldDecorator, getFieldValue, setFieldsValue } =
        this.props.form
      const { memberList, projectList, goodsList, formData } = this.props
      getFieldDecorator('keys', { initialValue: [] })
      getFieldDecorator('keys', {
        initialValue: this.state.projects,
      })
      getFieldDecorator('goodKeys', { initialValue: [] })
      getFieldDecorator('goodKeys', {
        initialValue: this.state.goods,
      })
      // getFieldDecorator('goods', { initialValue: [] })
      const keys = getFieldValue('keys')
      const goodKeys = getFieldValue('goodKeys')
      // let projects = getFieldValue('projects')
      // const goods = getFieldValue('goods')
      return (
        <Modal
          title="添加订单"
          width={'60%'}
          visible={this.props.showModal}
          readOnly={this.props.readOnly}
          onOk={() => this.props.handleSubmit(this.props.form)}
          onCancel={() => this.props.handleCancel()}
        >
          <Form layout="vertical">
            <Row>
              <Col span={10}>
                <Form.Item label="用户">
                  {getFieldDecorator(
                    'member',
                    {}
                  )(
                    <Select>
                      {memberList.map((m) => (
                        <Select.Option key={m.id} value={m.id}>
                          {m.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={10} offset={1}>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {})(<Input></Input>)}
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              消费项目
              <Button type="primary" onClick={() => this.handleAddProjects()}>
                添加项目
              </Button>
            </div>
            <List bordered>
              {keys.map((k, index) => (
                <List.Item
                  key={k}
                  actions={[
                    <Button onClick={() => this.remove(k, index)} type="danger">
                      删除
                    </Button>,
                  ]}
                >
                  <Row span={24}>
                    <Col span={7}>
                      <Form.Item label="项目">
                        {getFieldDecorator(
                          `projects[${index}].project`,
                          {}
                        )(
                          <Select>
                            {projectList.map((p) => (
                              <Select.Option key={p.id} value={p.id}>
                                {p.name}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item label="数量">
                        {getFieldDecorator(
                          `projects[${index}].count`,
                          {}
                        )(<InputNumber min={0}></InputNumber>)}
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item label="价格">
                        {getFieldDecorator(
                          `projects[${index}].price`,
                          {}
                        )(<Input></Input>)}
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={1}>
                      <Form.Item label="备注">
                        {getFieldDecorator(
                          `projects[${index}].remark`,
                          {}
                        )(<Input></Input>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </List.Item>
              ))}
            </List>

            <div
              style={{
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              消费商品
              <Button
                type="primary"
                onClick={() => this.handleAddGoods()}
              >
                添加商品
              </Button>
            </div>
            <List bordered>
              {goodKeys.map((good, index) => (
                <List.Item
                  key={good}
                  actions={[
                    <Button
                      onClick={() => this.handleDelItem(good, index)}
                      type="danger"
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <Row span={24}>
                    <Col span={7}>
                      <Form.Item label="商品">
                        {getFieldDecorator(
                          `goods[${index}].goods`,
                          {}
                        )(
                          <Select>
                            {goodsList.map((p) => (
                              <Select.Option key={p.id} value={p.id}>
                                {p.name}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item label="数量">
                        {getFieldDecorator(
                          `goods[${index}].count`,
                          {}
                        )(<InputNumber min={0}></InputNumber>)}
                      </Form.Item>
                    </Col>
                    <Col span={4} offset={1}>
                      <Form.Item label="价格">
                        {getFieldDecorator(
                          `goods[${index}].price`,
                          {}
                        )(<Input></Input>)}
                      </Form.Item>
                    </Col>
                    <Col span={6} offset={1}>
                      <Form.Item label="备注">
                        {getFieldDecorator(
                          `goods[${index}].remark`,
                          {}
                        )(<Input></Input>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </List.Item>
              ))}
            </List>
          </Form>
          {/* <div style={{ marginTop: '15px' }}>本次共消费： 100元</div> */}
        </Modal>
      )
    }
  }
)
