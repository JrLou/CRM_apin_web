//需求池页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker, AutoComplete, Radio, Icon, Tabs, Checkbox } from 'antd';
import { Link } from 'dva/router';
import styles from '../Offline.less';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
@connect(state => ({
    offline: state.offline,
}))
@Form.create()
export default class AddOrderForm extends Component {
    constructor() {
        super()
        this.state = {
            schemeInfo: [
                { supplier: '', price: '', line: "" },
                { supplier: '', price: '', line: "" },
                { supplier: '', price: '', line: "" }
            ]
        }
    }
    onBlurCheck = (inputId, dataSource, value) => {
        if (dataSource.indexOf(value) == -1) {
            this.props.form.setFieldsValue({ [inputId]: '' })
        }
    }
    createScheme = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const { offline: { usernameData } } = this.props;
        let schemes = this.state.schemeInfo.map((v, k) => {
            return (<div key={'scheme' + k}>
                <div className={styles.schemeTitle}><Icon type="file-text" /> <b>方案{k + 1}</b></div>
                <Row gutter={20}>
                    <Col span={5}>
                        <FormItem label="供应商" {...formItemLayout}>
                            {getFieldDecorator('supplier' + k, {
                                rules: [{ required: true, message: "必填" }],
                                initialValue: v.supplier
                            })(
                                <AutoComplete
                                    dataSource={usernameData}
                                    onBlur={this.onBlurCheck.bind(null, 'supplier' + k, usernameData)}
                                    onChange={this.saveScheme.bind(null, k, 'supplier')}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem label="结算价"  {...formItemLayout}>
                            {getFieldDecorator('price' + k, {
                                rules: [{ required: true, message: "必填" }],
                                initialValue: v.price
                            })(
                                <Input
                                    style={{ width: '50%', marginRight: '5px' }}
                                    onChange={this.saveScheme.bind(null, k, 'price')} />
                                )}
                            <span>元/人</span>
                        </FormItem>
                    </Col>
                    <Col span={5}>
                        <FormItem label="出行航班"  {...formItemLayout}>
                            {getFieldDecorator('line' + k, {
                                rules: [{ max: 200, message: "最多输入200字" }, { required: true, message: "必填" }],
                                initialValue: v.line
                            })(
                                <TextArea
                                    onChange={this.saveScheme.bind(null, k, 'line')} />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        {this.state.schemeInfo.length == 1 ? null : <Button type='primary' onClick={this.delOneSche.bind(null, k)}>删除</Button>}
                    </Col>
                </Row>
            </div>)
        })
        return schemes;
    }
    addScheme = () => {
        this.state.schemeInfo.push({ supplier: '', price: '', line: "" });
        let newSchemeInfo = this.state.schemeInfo;
        this.setState({
            schemeInfo: newSchemeInfo
        })
        console.log(this.state.schemeInfo);
    }
    delOneSche = (k) => {
        this.state.schemeInfo.splice(k, 1);
        let newSchemeInfo = this.state.schemeInfo;
        this.setState({
            schemeInfo: newSchemeInfo
        }, this.setValue)
        console.log(this.state.schemeInfo);
    }
    setValue = () => {
        this.state.schemeInfo.map((v, k) => {
            this.props.form.setFieldsValue(
                {
                    ['supplier' + k]: v.supplier,
                    ['price' + k]: v.price,
                    ['line' + k]: v.line,
                }
            )
        })
    }
    saveScheme = (k, inputId, e) => {
        let newSchemeInfo = this.state.schemeInfo;
        newSchemeInfo[k][inputId] = e.target ? e.target.value : e;
        this.setState({
            schemeInfo: newSchemeInfo
        })
        console.log(this.state.schemeInfo);
    }
    isShowTabs = (e) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'offline/changeIsdill',
            payload: e.target.value,
        });
    }
    createOptions = () => {
        let options = this.state.schemeInfo.map((v, k) => {
            return <Option value={k} key={k}>方案{k + 1}</Option>
        })
        return options;
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
        const { offline: { usernameData } } = this.props;
        return (
            <Form>
                <div className={styles.module}>
                    <Card bordered={false}>
                        <Tabs type="card">
                            <TabPane tab="询价" key="1">

                                <Row gutter={20}>
                                    <Col span={16}>
                                        <FormItem label="备忘录" {...formItemLayout2}>
                                            {getFieldDecorator('remark', {
                                                rules: [{ max: 200, message: "最多输入200字" }, { required: true, message: "必填" }],
                                            })(
                                                <TextArea rows={4} />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="询价日期" {...formItemLayout}>
                                            {getFieldDecorator('flightTime', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <DatePicker />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="客户名"  {...formItemLayout}>
                                            {getFieldDecorator('username', {
                                                rules: [{ max: 30, message: "输入位数过长" }],
                                            })(
                                                <AutoComplete dataSource={usernameData} onBlur={this.onBlurCheck.bind(null, 'username', usernameData)} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="是否匹配切位"  {...formItemLayout}>
                                            {getFieldDecorator('isMatch', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="出发城市" {...formItemLayout}>
                                            {getFieldDecorator('cityDep', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <AutoComplete dataSource={usernameData} onBlur={this.onBlurCheck.bind(null, 'cityDep', usernameData)} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="到达城市"  {...formItemLayout}>
                                            {getFieldDecorator('cityArr', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <AutoComplete dataSource={usernameData} onBlur={this.onBlurCheck.bind(null, 'cityArr', usernameData)} />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="去程日期" {...formItemLayout}>
                                            {getFieldDecorator('dateDep', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <DatePicker />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="回程日期"  {...formItemLayout}>
                                            {getFieldDecorator('dateArr', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <DatePicker />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="人数"  {...formItemLayout}>
                                            {getFieldDecorator('counts', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <Input style={{ width: '50%', marginRight: '5px' }} />
                                                )}
                                            <span>人</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="类型" {...formItemLayout}>
                                            {getFieldDecorator('type', {
                                                rules: [{ required: true, message: "必填" }],
                                            })(
                                                <Select placeholder="请选择">
                                                    <Option value="0">国际散客</Option>
                                                    <Option value="1">国际团客</Option>
                                                    <Option value="2">国内散客</Option>
                                                    <Option value="3">国内团客</Option>
                                                </Select>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div className={styles.schemeBox}>
                                    {this.createScheme()}
                                </div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="" {...formItemLayout}>
                                            {getFieldDecorator('isDill', {
                                                rules: [{ required: true, message: "必填" }],
                                                initialValue: '0'
                                            })(
                                                <RadioGroup onChange={this.isShowTabs}>
                                                    <Radio value="0">未成交</Radio>
                                                    <Radio value="1">已成交</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                    </Col>
                                    {this.props.form.getFieldValue('isDill') == '0' ?
                                        <Col span={8}>
                                            <FormItem label="原因" {...formItemLayout}>
                                                {getFieldDecorator('reson', {
                                                    rules: [{ required: true, message: "必填" }],
                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="0">询参考价</Option>
                                                        <Option value="1">客人预算低</Option>
                                                        <Option value="2">供应报价高</Option>
                                                        <Option value="3">行程不可靠</Option>
                                                        <Option value="4">待客人确认</Option>
                                                    </Select>
                                                    )}
                                            </FormItem>
                                        </Col>
                                        : null}
                                    {this.state.schemeInfo.length == 3 ? null : <Button type='primary' onClick={this.addScheme}>增加方案</Button>}
                                </Row>


                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
                {this.props.form.getFieldValue('isDill') == '1' ?
                    <div className={styles.module}>
                        <Card bordered={false}>
                            <Tabs type="card">
                                <TabPane tab="出票" key="1">
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="请选择方案" {...formItemLayout}>
                                                {getFieldDecorator('selectSche', {
                                                    rules: [{ required: true, message: "必填" }],
                                                    initialValue: 0
                                                })(
                                                    <Select placeholder="请选择">
                                                        {this.createOptions()}
                                                    </Select>
                                                    )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="出票日期" {...formItemLayout}>
                                                {getFieldDecorator('tiketDate', {
                                                    rules: [{ required: true, message: "必填" }],
                                                    initialValue: 0
                                                })(
                                                    <DatePicker />
                                                    )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="卖价" {...formItemLayout}>
                                                {getFieldDecorator('sellPrice', {
                                                    rules: [{ required: true, message: "必填" }],
                                                    initialValue: 0
                                                })(
                                                    <Input />
                                                    )}
                                                <span>元/人</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col span={5}>
                                            <FormItem label="结算总价" {...formItemLayout}>
                                                {getFieldDecorator('sellPrice', {
                                                    initialValue: 0
                                                })(
                                                    <Input readOnly className={styles.reandOnly} />
                                                    )}
                                                <span>元/人</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem label="卖价总价" {...formItemLayout}>
                                                {getFieldDecorator('sellPrice', {
                                                    initialValue: 0
                                                })(
                                                    <Input readOnly className={styles.reandOnly} />
                                                    )}
                                                <span>元/人</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={5}>
                                            <FormItem label="利润" {...formItemLayout}>
                                                {getFieldDecorator('sellPrice', {
                                                    initialValue: 0
                                                })(
                                                    <Input readOnly className={styles.reandOnly} />
                                                    )}
                                                <span>元/人</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="票号" {...formItemLayout}>
                                                {getFieldDecorator('tiketNo', {
                                                    rules: [{ required: true, message: "必填" }],
                                                    initialValue: 0
                                                })(
                                                    <Input />
                                                    )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="结算" key="2">
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="汇款给供应商" {...formItemLayout}>
                                                {getFieldDecorator('paySupplier', {
                                                    valuePropName: 'checked',
                                                })(
                                                    <Checkbox>
                                                        是
                                                    </Checkbox>
                                                    )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="发票/行程单" key="3">
                                    <Row gutter={20}>
                                        <Col span={5}>
                                            <FormItem label="是否邮寄" {...formItemLayout}>
                                                {getFieldDecorator('isPush', {
                                                    valuePropName: 'checked',
                                                })(
                                                    <Checkbox>
                                                        是
                                                    </Checkbox>
                                                    )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="快递公司" {...formItemLayout}>
                                                {getFieldDecorator('express', {
                                                    initialValue: '0'
                                                })(
                                                    <Select placeholder="请选择">
                                                        <Option value="0">顺丰</Option>
                                                    </Select>
                                                    )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="快递单号" {...formItemLayout}>
                                                {getFieldDecorator('expressNo', {
                                                })(
                                                    <Input />
                                                    )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>
                    : null
                }
                <Card bordered={false}>
                    <div style={{ textAlign: 'center' }}><Button type='primary'>保存</Button></div>
                </Card>

            </Form>
        )
    }
}





