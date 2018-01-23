/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Form, Input, Button, TimePicker, Row, Col, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from '../Offline.less'
// 手动添加航班的form
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(state => ({
  offline: state.offline,
}))
@Form.create()
export default class AddFlightForm extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = (e) => {
    const { dispatch, offline: { currentOrder } } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.handleDate = moment(values.handleDate).format('YYYY-MM-DD');
        dispatch({
          type: 'offline/addOneChange',
          payload: { ...values, orderId: currentOrder },
        });
      }
    });
    // this.props.hideModal()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout2 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={20}>
          <Col span={10}>
            <FormItem label="类型" {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [],
                initialValue: 1
              })(
                <Select placeholder="请选择">
                  <Option value={1}>改签</Option>
                  <Option value={2}>退票</Option>
                </Select>
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={10}>
            <FormItem label="发生费用"  {...formItemLayout}>
              {getFieldDecorator('fee', {
                rules: [{ required: true, message: "必填" }, { pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: ''
              })(
                <Input />
                )}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="退改利润"  {...formItemLayout}>
              {getFieldDecorator('profit', {
                rules: [{ required: true, message: "必填" }, { pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: ''
              })(
                <Input />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={20}>
            <FormItem label="退改详情"  {...formItemLayout2}>
              {getFieldDecorator('detail', {
                rules: [{ required: true, message: "必填" }, { max: 200, message: "输入位数过长" }],
                initialValue: ''
              })(
                <TextArea />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={10}>
            <FormItem label="操作日期"  {...formItemLayout}>
              {getFieldDecorator('handleDate', {
                rules: [{ required: true, message: "必填" }],
                initialValue: moment(new Date())
              })(
                <DatePicker />
                )}
            </FormItem>
          </Col>
        </Row>
        <div className={styles.btnBox}>
          <Button
            type="primary"
            htmlType="submit"
          >确认</Button>
          <Button
            onClick={this.props.hideModal}
          >取消</Button>
        </div>
      </Form>
    )
  }
}
