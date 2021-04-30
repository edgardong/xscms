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

    render() {
      const { getFieldDecorator } = this.props.form
      const { memberList, projectList, goodsList, formData } = this.props
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
              <Button
                type="primary"
                onClick={() => this.props.handleAddProjects()}
              >
                添加项目
              </Button>
            </div>
            <List bordered>
              {formData.projects && formData.projects.length > 0
                ? formData.projects.map((good, index) => (
                    <List.Item
                      key={index}
                      actions={[<Button type="danger">删除</Button>]}
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
                  ))
                : null}
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
                onClick={() => this.props.handleAddGoods()}
              >
                添加商品
              </Button>
            </div>
            <List bordered>
              {formData.goods && formData.goods.length > 0
                ? formData.goods.map((good, index) => (
                    <List.Item
                      key={index}
                      actions={[<Button type="danger">删除</Button>]}
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
                  ))
                : null}
            </List>
          </Form>
          <div style={{ marginTop: '15px' }}>本次共消费： 100元</div>
        </Modal>
      )
    }
  }
)
