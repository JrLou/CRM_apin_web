import React, {Component} from 'react'
import {
    Checkbox, message, Col, Form, Input, Select, Button, Row,
} from 'antd'

const CheckboxGroup = Checkbox.Group;
// import HttpTool from '../../../http/HttpTool.js';
// import APILXF from '../../../http/APILXF.js';
import Algorithm from './FlightstockAlgorithm.js';

const FormItem = Form.Item;
const Option = Select.Option;

class HorizontalLoginForm extends Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        // this.props.form.validateFields();
    }

    constructor(props) {
        super(props);
        this.state = {
            formLayout: 'horizontal', //from布局控件
            fcategory: '',
        };
    }

    manual(data) {
        data.flights = Algorithm.toogleToWeekStr(data.flights);
        data.stopFlag = 0;
        data = JSON.stringify(data);
        // let datas =this.state.flightdata;
        HttpTool.post(APILXF.api_addFlight,
            (code, msg, json, option) => {
                if (code == 200) {
                    message.success(msg);
                    this.props.open(true);
                    // datas.visible=false;
                    // this.setState({
                    //     flightdata: data,
                    // });
                } else {
                    message.warning(msg);
                }
            },
            (code, msg, option) => {
                message.warning(msg);
            }, data
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // values.fcategory=this.state.fcategory,
                this.manual(values);
                // console.log('Received values of form: ', values);
            }
        });
    }


    valHeadquarters(checkedValue) {
        console.log(checkedValue);
    }

    handleChange(value) {
        this.setState({
            fcategory: value,
        });
    }

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const {formLayout} = this.state;
        const requiredText = '请填写此字段';
        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: {span: 6},
            wrapperCol: {span: 17},
        } : null;
        const optionsWithDisabled = [
            {value: 1, label: '星期一'},
            {value: 2, label: '星期二'},
            {value: 3, label: '星期三'},
            {value: 4, label: '星期四'},
            {value: 5, label: '星期五'},
            {value: 6, label: '星期六'},
            {value: 0, label: '星期天'},
        ];
        return (

            <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                <FormItem
                    label="航班号"
                    {...formItemLayout}
                    style={{marginBottom: "20px"}}
                >
                    {getFieldDecorator('flightNo', {
                        rules: [{
                            required: true,
                            message: requiredText
                        }, {max: 6, message: "航班号最长六位"},{pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/, message: "只能输入字母和数字"}],
                        // initialValue: this.state.account.csCharger
                    })
                    (< Input placeholder="请填写航班号" style={{width: '300px'}}/>)}
                </FormItem>
                <FormItem
                    label="航空公司"
                    {...formItemLayout}
                    style={{marginBottom: "20px"}}
                >
                    {getFieldDecorator('flightCompany', {
                        rules: [{
                            required: true,
                            message: requiredText
                        }],
                        // initialValue: this.state.account.csCharger
                    })
                    (< Input placeholder="请填写" style={{width: '300px'}}/>)}
                </FormItem>
                <FormItem
                    label="航班属性"
                    {...formItemLayout}
                    style={{marginBottom: "20px"}}
                >
                    {getFieldDecorator('fcategory', {
                        rules: [{
                            required: true,
                            message: requiredText
                        }],
                        // initialValue: this.state.account.csCharger
                    })
                    (<Select style={{width: 120}} onChange={this.handleChange.bind(this)}>
                        <Option value='0'>国内-国内</Option>
                        <Option value='1'>国内-国际</Option>
                        <Option value='2'>国内-地区</Option>
                        <Option value='3'>地区-国际</Option>
                        <Option value='4'>国际-国际</Option>
                    </Select>)}
                </FormItem>
                <span style={{marginLeft: '140px'}}>起飞</span>
                <span style={{marginLeft: '125px'}}>到达</span>
                <Row>
                    <Col span={12} style={{width: '70%',paddingLeft:'35px'}}>
                        <FormItem
                            label="时间"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightDeptimePlanDate', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }, {pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, message: "请输入6位的时间格式"}],
                            })
                            (<Input placeholder="如（12:30）" style={{width: '100%'}}/>)}

                        </FormItem>
                    </Col>
                    <Col span={12} style={{marginLeft: '-100px'}}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightArrtimePlanDate', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }, {pattern: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/, message: "请输入6位的时间格式"}],
                            })
                            (<Input placeholder="如（12:30）" style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>

                    <Col span={12} style={{width: '70%',paddingLeft:'35px'}}>

                        <FormItem
                            label="城市名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightDep', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }],
                            })
                            (<Input placeholder="请输入城市" style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                    <Col span={12} style={{marginLeft: '-100px'}}>

                        <FormItem
                            // label="城市名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightArr', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }],
                            })
                            (<Input  placeholder="请输入城市"  style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                    <Col span={12} style={{width: '70%',paddingLeft:'35px'}}>
                        <FormItem
                            label="机场三字码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightDepcode', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }, {max: 3, message: '只能输入三位'}],
                            })
                            (<Input placeholder="请输入机场三字码" style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                    <Col span={12} style={{marginLeft: '-100px'}}>
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator('flightArrcode', {
                                rules: [{
                                    required: true,
                                    message: requiredText
                                }, {max: 3, message: '只能输入三位'}],
                            })
                            (<Input placeholder="请输入机场三字码" style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                </Row>

                <FormItem
                    label="周期选择"
                    {...formItemLayout}
                >
                    {getFieldDecorator('flights', {
                        rules: [{
                            required: true,
                            message: requiredText
                        }],
                    })
                    (<CheckboxGroup options={optionsWithDisabled}
                                    onChange={this.valHeadquarters.bind(this)}/>)}
                </FormItem>
                <FormItem>
                    <Button style={{marginLeft: '41%'}} type="primary" htmlType="submit">提交录入</Button>
                </FormItem>
            </Form>

        )
            ;
    }
}

const WrappedAddForms = Form.create()(HorizontalLoginForm);
module.exports = WrappedAddForms;