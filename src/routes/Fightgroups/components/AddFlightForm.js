/**
 * Created by ylb on 17/08/31.
 */
import React, { Component } from 'react'
import { Form, Input, Button, TimePicker } from 'antd';
import moment from 'moment';
import css from './AddFlightForm.less'
// 手动添加航班的form
const FormItem = Form.Item;
class AddFlightForm extends Component {
    constructor(props) {
        super(props);

    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.FlightDeptimePlanDate = moment(values.FlightDeptimePlanDate).format('YYYY-MM-DD HH:mm:ss');
                values.FlightArrtimePlanDate = moment(values.FlightArrtimePlanDate).format('YYYY-MM-DD HH:mm:ss');

                this.props.sumit(values);
            }
        });
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
                            rules: [{ required: true, message: "必填" }, { max: 6, message: "航班号最大6位" }],
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

                <div className={css.myFormItem}>
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
                </div>

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
                            rules: [{ required: true, message: "必填" }, { max: 3, message: "最大输入3位" }],
                        })(
                            <Input placeholder="请输入出发机场三字码"
                                className={css.smallInput} />
                            )}
                    </FormItem>
                    <FormItem className={css.inlineFormItem}>
                        <label htmlFor="" className={css.required}>机场三字码：</label>
                        {getFieldDecorator("FlightArrcode", {
                            rules: [{ required: true, message: "必填" }, { max: 3, message: "最大输入3位" }],
                        })(
                            <Input placeholder="请输入到达机场三字码"
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