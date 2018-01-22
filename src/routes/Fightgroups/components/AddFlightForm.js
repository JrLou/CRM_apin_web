/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Form, Input, Button, TimePicker, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import css from './AddFlightForm.less'
// 手动添加航班的form
const FormItem = Form.Item;
import { searchPort } from '../../../services/api'
@connect(state => ({
  view: state.push,
}))
class AddFlightForm extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.FlightDeptimePlanDate = moment(values.FlightDeptimePlanDate).format('HH:mm') + ':00';
        values.FlightArrtimePlanDate = moment(values.FlightArrtimePlanDate).format('HH:mm') + ':00';
        this.props.sumit(values);
      }
    });
  }
  _searchPort(isDep, e) {
    // 三字码正确的情况下再掉接口
    let reg = /^[a-zA-Z]{3}$/;
    if (reg.test(e.target.value)) {
      searchPort({ code: e.target.value }).then((response) => {
        if (response.code == 200) {
          let airport = response.data[0] && response.data[0].airport_name;
          if (airport) {
            let key = isDep ? 'FlightDepAirport' : 'FlightArrAirport';
            this.props.form.setFieldsValue({ [key]: airport });
          } else {
            message.warning('未查询到机场信息，请重新输入三字码')
            let key = isDep ? 'FlightDepcode' : 'FlightArrcode';
            this.props.form.setFieldsValue({ [key]: '' });
          }
        } else {
          let key = isDep ? 'FlightDepcode' : 'FlightArrcode';
          this.props.form.setFieldsValue({ [key]: '' });
        }
      }).catch(() => {
        let key = isDep ? 'FlightDepcode' : 'FlightArrcode';
        this.props.form.setFieldsValue({ [key]: '' });
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        className="ManualAddFlightForm"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <div className={css.myFormItem}>
          <FormItem>
            <label htmlFor="" className={css.required}>航班号：</label>
            {getFieldDecorator("FlightNo", {
              rules: [{ required: true, message: "必填" }, {
                pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                message: '请输入正确的航班号',
              }],
              initialValue: this.props.inputFlightNo
            })(
              <Input
                placeholder="请输入航班号"
                className={css.longInput} />
              )}
          </FormItem>
        </div>
        <div className={css.myFormItem}>
          <FormItem>
            <label htmlFor="" className={css.required}>航空公司：</label>
            {getFieldDecorator("FlightCompany", {
              rules: [{ required: true, message: "必填" }, { max: 20, message: "最大输入20位" }],
            })(
              <Input placeholder="请输入航空公司全名"
                className={css.longInput} />
              )}
          </FormItem>
        </div>

        {/* <div className={css.myFormItem}>
                    <FormItem className={css.inlineFormItem} style={{ marginRight: '30px' }}>
                        <label htmlFor="" className={css.required}>起飞机场：</label>
                        {getFieldDecorator("FlightDepAirport", {
                            rules: [{ required: true, message: "必填" }, { max: 20, message: "最大输入20位" }],
                        })(
                            <Input placeholder="请输入起飞机场名"
                                className={css.smallInput} />
                            )}
                    </FormItem>
                    <FormItem className={css.inlineFormItem}>
                        <label htmlFor="" className={css.required}>到达机场：</label>
                        {getFieldDecorator("FlightArrAirport", {
                            rules: [{ required: true, message: "必填" }, { max: 20, message: "最大输入20位" }],
                        })(
                            <Input placeholder="请输入到达机场名"
                                className={css.smallInput} />
                            )}
                    </FormItem>
                </div> */}
        {getFieldDecorator('FlightDepAirport', {
          initialValue: ''
        })(
          <Input type='hidden' />
          )}
        {getFieldDecorator('FlightArrAirport', {
          initialValue: ''
        })(
          <Input type='hidden' />
          )}
        <div className={css.myFormItem}>
          <FormItem className={css.inlineFormItem} style={{ marginRight: '30px' }}>
            <label htmlFor="" className={css.required}>起飞时间：</label>
            {getFieldDecorator("FlightDeptimePlanDate", {
              rules: [{ required: true, message: "必填" }],
            })(
              <TimePicker
                size="large"
                placeholder="请输入起飞时间"
                format="HH:mm"
                className={css.smallInput}
              />
              )}
          </FormItem>
          <FormItem className={css.inlineFormItem}>
            <label htmlFor="" className={css.required}>到达时间：</label>
            {getFieldDecorator("FlightArrtimePlanDate", {
              rules: [{ required: true, message: "必填" }],
            })(
              <TimePicker
                className={css.smallInput}
                size="large"
                placeholder="请输入到达时间"
                format="HH:mm"
              />
              )}
          </FormItem>
        </div>

        <div className={css.myFormItem}>
          <FormItem className={css.inlineFormItem} style={{ marginRight: '30px' }}>
            <label htmlFor="" className={css.required}>起飞城市：</label>
            {getFieldDecorator("FlightDep", {
              rules: [{ required: true, message: "必填" }, { max: 20, message: "最大输入20位" }],
            })(
              <Input placeholder="请输入出发城市"
                className={css.smallInput} />
              )}
          </FormItem>
          <FormItem className={css.inlineFormItem}>
            <label htmlFor="" className={css.required}>到达城市：</label>
            {getFieldDecorator("FlightArr", {
              rules: [{ required: true, message: "必填" }, { max: 20, message: "最大输入20位" }],
            })(
              <Input placeholder="请输入到达城市"
                className={css.smallInput} />
              )}
          </FormItem>
        </div>

        <div className={css.myFormItem}>
          <FormItem className={css.inlineFormItem} style={{ marginRight: '30px' }}>
            <label htmlFor="" className={css.required}>机场三字码：</label>
            {getFieldDecorator("FlightDepcode", {
              rules: [{ required: true, message: "必填" }, { pattern: /^[a-zA-Z]{3}$/, message: "请输入正确的三字码" }],
            })(
              <Input
                placeholder="请输入出发机场三字码"
                onBlur={this._searchPort.bind(this, true)}
                className={css.smallInput} />
              )}
          </FormItem>
          <FormItem className={css.inlineFormItem}>
            <label htmlFor="" className={css.required}>机场三字码：</label>
            {getFieldDecorator("FlightArrcode", {
              rules: [{ required: true, message: "必填" }, { pattern: /^[a-zA-Z]{3}$/, message: "请输入正确的三字码" }],
            })(
              <Input
                onBlur={this._searchPort.bind(this, false)}
                placeholder="请输入到达机场三字码"
                className={css.smallInput} />
              )}
          </FormItem>
        </div>
        <div className={css.btnBox}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px", width: '140px', marginRight: '15px', height: "34px" }}
          >提交录入</Button>
        </div>


      </Form>
    )
  }
}
const WrappedAddFlightForm = Form.create()(AddFlightForm);

export default WrappedAddFlightForm
