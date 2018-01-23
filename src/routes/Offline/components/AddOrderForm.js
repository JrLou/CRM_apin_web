//需求池页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker, AutoComplete, Radio, Icon, Tabs, Checkbox, Modal, message } from 'antd';
import { Link } from 'dva/router';
import styles from '../Offline.less';
import moment from 'moment';
import AddChangeForm from './AddChangeForm';
// import TicketForm from './TiketForm';
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
      modalVisible: false
    }
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取默认的三个自动补全数组
    dispatch({
      type: 'offline/searchCustomer',
      payload: { name: '' },
    });
    dispatch({
      type: 'offline/searchSupplier',
      payload: { name: '' },
    });
    dispatch({
      type: 'offline/searchCity',
      payload: { condition: '' },
    });
    dispatch({
      type: 'offline/searchCity',
      payload: { condition: '', arrFlag: true },
    });
  }

  onBlurCheck = (inputId, dataSource, value) => {
    if (dataSource.indexOf(value) == -1) {
      this.props.form.setFieldsValue({ [inputId]: '' })
    }
  }
  createScheme = () => {
    const { getFieldDecorator } = this.props.form;
    const { readOnly } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const { offline: { usernameData, supplierData, schemeInfo } } = this.props;
    let schemes = schemeInfo.map((v, k) => {
      return (<div key={'scheme' + k}>
        <div className={styles.schemeTitle}><Icon type="file-text" /> <b>方案{k + 1}</b></div>
        <Row gutter={20}>
          <Col span={6}>
            <FormItem label="供应商" {...formItemLayout}>
              {getFieldDecorator('supplierName' + k, {
                rules: [],
                initialValue: v.supplierName
              })(
                <AutoComplete
                  disabled={readOnly}
                  onSearch={this.autoCompSearch.bind(null, 'supplierName')}
                  dataSource={supplierData}
                  onBlur={this.onBlurCheck.bind(null, 'supplierName' + k, supplierData)}
                  onChange={this.saveScheme.bind(null, k, 'supplierName')}
                />
                )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="结算价"  {...formItemLayout}>
              {getFieldDecorator('unitprice' + k, {
                rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: v.unitprice
              })(
                <Input
                  disabled={readOnly}
                  style={{ width: '50%', marginRight: '5px' }}
                  onBlur={this.changeCaulator}
                  onChange={this.saveScheme.bind(null, k, 'unitprice')} />

                )}
              <span>元/人</span>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="出行航班"  {...formItemLayout}>
              {getFieldDecorator('flight' + k, {
                rules: [{ max: 200, message: "最多输入200字" }],
                initialValue: v.flight
              })(
                <TextArea
                  disabled={readOnly}
                  onChange={this.saveScheme.bind(null, k, 'flight')} />
                )}
            </FormItem>
          </Col>
          <Col span={4}>
            {schemeInfo.length == 1 ? null : <Button type='primary' disabled={readOnly} onClick={this.delOneSche.bind(null, k)}>删除</Button>}
          </Col>
          {getFieldDecorator('id' + k, {
            initialValue: v.id
          })(
            <Input type='hidden' />
            )}
          {getFieldDecorator('orderId' + k, {
            initialValue: v.orderId
          })(
            <Input type='hidden' />
            )}
          {getFieldDecorator('selected' + k, {
            initialValue: v.selected
          })(
            <Input type='hidden' />
            )}
        </Row>
      </div>)
    })
    return schemes;
  }
  addScheme = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/addOneScheme',
      payload: this.props.id,
    });

  }
  delOneSche = (k) => {
    const { dispatch, offline: { schemeInfo } } = this.props;
    if (schemeInfo[k].id) {
      dispatch({
        type: 'offline/delOneSchemeWithid',
        payload: { id: schemeInfo[k].id, index: k },
      });
    } else {
      dispatch({
        type: 'offline/delOneScheme',
        payload: k,
      });
    }
    this.setValue()
  }
  setValue = () => {
    const { offline: { schemeInfo } } = this.props;
    console.log(schemeInfo);
    schemeInfo.map((v, k) => {
      this.props.form.setFieldsValue(
        {
          ['supplierName' + k]: v.supplierName,
          ['unitprice' + k]: v.unitprice,
          ['flight' + k]: v.flight,
        }
      )
    })
  }
  saveScheme = (k, inputId, e) => {
    const { dispatch, offline: { schemeInfo } } = this.props;
    let newSchemeInfo = schemeInfo;
    newSchemeInfo[k][inputId] = e.target ? e.target.value : e;
    dispatch({
      type: 'offline/changeSchemeInfo',
      payload: newSchemeInfo,
    })
    console.log(schemeInfo)
  }
  isShowTabs = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/changeIsdill',
      payload: e.target.value,
    });
  }
  createOptions = () => {
    const { offline: { schemeInfo } } = this.props;
    let options = schemeInfo.map((v, k) => {
      return <Option value={k} key={k}>方案{k + 1}</Option>
    })
    options.unshift(<Option value={''} key={'-1'}>请选择</Option>)
    return options;
  }
  createChangeInfo = () => {
    // 判断退改添加是否可修改
    // 查看情况下退改不可修改
    let isDisabled;
    if (this.props.isView) {
      isDisabled = true
    }
    // 编辑情况下客服不能修改，总监可以
    if (this.props.isEdit && !this.props.isLeader) {
      isDisabled = true
    }
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const { offline: { changeInfo } } = this.props;
    let divs = changeInfo.map((v, k) => {
      return (
        <div className={styles.changeInfoBox} key={k}>
          <Row gutter={20}>
            <Col span={8}>
              <FormItem label="类型" {...formItemLayout}>
                {getFieldDecorator('type' + k, {
                  rules: [{ required: true, message: "必填" }],
                  initialValue: v.type
                })(
                  <Select
                    disabled={isDisabled}
                    placeholder="请选择"
                    onChange={this.saveChange.bind(null, k, 'type')}
                  >
                    <Option value={2}>退票</Option>
                    <Option value={1}>改签</Option>
                  </Select>
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={8}>
              <FormItem label="发生费用"  {...formItemLayout}>
                {getFieldDecorator('fee' + k, {
                  rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" },{ required: true, message: "必填" }],
                  initialValue: v.fee
                })(
                  <Input disabled={isDisabled} onChange={this.saveChange.bind(null, k, 'fee')} />
                  )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="退改利润"  {...formItemLayout}>
                {getFieldDecorator('profit' + k, {
                  rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" },{ required: true, message: "必填" }],
                  initialValue: v.profit
                })(
                  <Input disabled={isDisabled} onChange={this.saveChange.bind(null, k, 'profit')} />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={8}>
              <FormItem label="退改详情"  {...formItemLayout}>
                {getFieldDecorator('detail' + k, {
                  rules: [{ max: 200, message: "输入位数过长" },{ required: true, message: "必填" }],
                  initialValue: v.detail
                })(
                  <TextArea disabled={isDisabled} onChange={this.saveChange.bind(null, k, 'detail')} />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={8}>
              <FormItem label="操作日期"  {...formItemLayout}>
                {getFieldDecorator('handleDate' + k, {
                  rules: [{ required: true, message: "必填" }],
                  initialValue: v.handleDate
                })(
                  <DatePicker disabled={isDisabled} onChange={this.saveChange.bind(null, k, 'handleDate')} />
                  )}
              </FormItem>
            </Col>
            {getFieldDecorator('id' + k, {
              initialValue: v.id
            })(
              <Input type='hidden' />
              )}
            {getFieldDecorator('orderId' + k, {
              initialValue: v.orderId
            })(
              <Input type='hidden' />
              )}
            {/* <Col span={6}>
                            <Button type='primary' onClick={this.delOneChange.bind(null, k)}>删除</Button>
                        </Col> */}
          </Row>
        </div>
      )
    })
    return divs
  }
  addChange = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/addOneChange',
      payload: values,
    });
  }
  delOneChange = (k) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/delOneChange',
      payload: k,
    });
    this.setChangeValue()
  }
  saveChange = (k, inputId, e) => {
    const { dispatch, offline: { changeInfo } } = this.props;
    let newChangeInfo = changeInfo;
    newChangeInfo[k][inputId] = e.target ? e.target.value : e;
    dispatch({
      type: 'offline/changeChangeInfo',
      payload: newChangeInfo,
    })
  }
  setChangeValue = () => {
    const { offline: { changeInfo } } = this.props;
    changeInfo.map((v, k) => {
      this.props.form.setFieldsValue(
        {
          ['type' + k]: v.type,
          ['cost' + k]: v.cost,
          ['profit' + k]: v.profit,
          ['detail' + k]: v.detail,
          ['handleDate' + k]: v.handleDate,
        }
      )
    })
  }
  handleModalVisible = (bool) => {
    const { dispatch } = this.props;
    // this.setState({
    //   modalVisible: bool
    // })
    dispatch({
      type: 'offline/isShowModal',
      payload: bool,
    })
  }
  _changeToDatestr = (values, strArr) => {
    strArr.map((v, k) => {
      if (values[v]) {
        values[v] = moment(values[v]).format('YYYY-MM-DD');
      }
    })
    return values;
  }
  _changePlanValues = (values, strArr) => {
    const { offline: { schemeInfo, originalPlans } } = this.props;
    let plan = []
    for (let i = 0; i < schemeInfo.length; i++) {
      let midObj = {}
      strArr.map((v, k) => {
        midObj[v] = values[v + i]
        delete values[v + i]
      })
      plan.push(midObj)
    }
    values.plans = plan;
    return values;
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { offline: { changeInfo } } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        values = this._changeToDatestr(values, ['arrDate', 'depDate', 'inquiryDate', 'printDate'])
        values = this._changePlanValues(values, ['supplierName', 'unitprice', 'flight', 'id', 'orderId', 'selected'])
        values.isPayoff = values.isPayoff ? '1' : '0';
        values.isSendoff = values.isSendoff ? '1' : '0';
        console.log('将要提交的参数'); console.log(values);
        // 判断编辑还是新增
        if (this.props.id) {
          // 转化格式
          values.endorse = changeInfo.map((v, k) => {
            let _v = { ...v };
            _v.handleDate = moment(_v.handleDate).format('YYYY-MM-DD');
            return _v;
          });
          dispatch({
            type: 'offline/updateOrder',
            payload: { ...values, id: this.props.id },
          });
        } else {
          dispatch({
            type: 'offline/addOrder',
            payload: values,
          });
        }

      }
    });
  };
  changeCaulator = (e) => {
    // 如果是数字且方案已选择
    let index = this.props.form.getFieldValue('selected');
    if (!isNaN(e.target.value) && (index === 0 || index)) {
      // 重新计算
      this.changeScheme(index)
    }
  }
  changeScheme = (value) => {
    const { dispatch } = this.props;
    // 人数  结算价  卖价;
    if (value !== '') {
      let counts = +this.props.form.getFieldValue('numbers');
      let finalPrice = +this.props.form.getFieldValue('unitprice' + value);
      let sellPrice = +this.props.form.getFieldValue('sellPrice');
      if (!counts || !finalPrice || !sellPrice) {
        message.warning('请输入人数、方案结算价、卖价再选择')
        setTimeout(() => {
          this.props.form.setFieldsValue({ selected: '' })
        }, 100);
        return
      } else {
        this.props.form.setFieldsValue({
          settlePrice: finalPrice * counts,
          totalPrice: sellPrice * counts,
          profit: (sellPrice - finalPrice) * counts
        })
      }
      // 选择的方案要添加 selected
      dispatch({
        type: 'offline/changeSelected',
        payload: value,
      });
    }
  }
  autoCompSearch = (which, value) => {
    const { dispatch } = this.props;
    switch (which) {
      case 'customerName':
        dispatch({
          type: 'offline/searchCustomer',
          payload: { name: value },
        });
        break;
      case 'supplierName':
        dispatch({
          type: 'offline/searchSupplier',
          payload: { name: value },
        });
        break;
      case 'cityData':
        dispatch({
          type: 'offline/searchCity',
          payload: { condition: value },
        });
        break;
      case 'cityData2':
        dispatch({
          type: 'offline/searchCity',
          payload: { condition: value, arrFlag: true },
        });
        break;
      default:
        break;
    }

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout2 = {
      labelCol: { span: 2 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout3 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const { readOnly, offline: { usernameData, supplierData, cityData, cityData2, changeInfo, schemeInfo, isShowModal } } = this.props;
    let detail = this.props.detail ? this.props.detail : {};
    schemeInfo.map((v, k) => {
      if (v.selected == 1) {
        detail.selected = k
      }
    })
    // 判断是否没修改过快递
    let specialFlag;
    if (this.props.isView) {
      specialFlag = true;
    } else if (detail.isPrint == 1 && !this.props.isLeader) {//已出票，不是领导
      specialFlag = true
    }
    let resonText;
    if (detail.nodealReason) {
      resonText = detail.nodealReason
    } else if (detail.nodealReason === 0) {
      resonText = 0
    } else {
      resonText = ''
    }

    return (
      <div>
        <Form onSubmit={this.handleSearch} className={styles.addOrderForm}>
          <div className={styles.module}>
            <Card bordered={false}>
              <Tabs type="card">
                <TabPane tab="询价" key="1">
                  {
                    this.props.isView ?
                      <div className={styles.btnGroup}>
                        <Button
                          type="primary"
                          disabled={detail.isPrint !== 1}
                          onClick={this.handleModalVisible.bind(null, true)}
                        >新增退改</Button>
                      </div> : null
                  }
                  <Row gutter={20}>
                    <Col span={24}>
                      <FormItem label="备忘录" {...formItemLayout2}>
                        {getFieldDecorator('remark', {
                          rules: [{ max: 200, message: "最多输入200字" }],
                          initialValue: detail.remark
                        })(
                          <TextArea disabled={readOnly} rows={4} />
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <FormItem label="询价日期" {...formItemLayout}>
                        {getFieldDecorator('inquiryDate', {
                          rules: [{ required: true, message: "必填" }],
                          initialValue: this.props.isAdd ? moment(new Date()) : detail.inquiryDate
                        })(
                          <DatePicker disabled={readOnly} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="客户名"  {...formItemLayout}>
                        {getFieldDecorator('customerName', {
                          rules: [{ required: true, message: "必填" }],
                          initialValue: detail.customerName
                        })(
                          <AutoComplete
                            onSearch={this.autoCompSearch.bind(null, 'customerName')}
                            disabled={readOnly}
                            dataSource={usernameData}
                            onBlur={this.onBlurCheck.bind(null, 'customerName', usernameData)} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="是否匹配切位" className='specialLabel' {...formItemLayout}>
                        {getFieldDecorator('isCutoff', {
                          rules: [],
                          initialValue: detail.isCutoff
                        })(
                          <RadioGroup disabled={readOnly}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                          </RadioGroup>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <FormItem label="出发城市" {...formItemLayout}>
                        {getFieldDecorator('cityDep', {
                          rules: [],
                          initialValue: detail.cityDep
                        })(
                          <AutoComplete
                            disabled={readOnly}
                            onSearch={this.autoCompSearch.bind(null, 'cityData')}
                            dataSource={cityData}
                            onBlur={this.onBlurCheck.bind(null, 'cityDep', cityData)} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="到达城市"  {...formItemLayout}>
                        {getFieldDecorator('cityArr', {
                          rules: [],
                          initialValue: detail.cityArr
                        })(
                          <AutoComplete
                            disabled={readOnly}
                            onSearch={this.autoCompSearch.bind(null, 'cityData2')}
                            dataSource={cityData2}
                            onBlur={this.onBlurCheck.bind(null, 'cityArr', cityData2)} />
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <FormItem label="去程日期" {...formItemLayout}>
                        {getFieldDecorator('depDate', {
                          rules: [],
                          initialValue: detail.depDate
                        })(
                          <DatePicker disabled={readOnly} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="回程日期"  {...formItemLayout}>
                        {getFieldDecorator('arrDate', {
                          rules: [],
                          initialValue: detail.arrDate
                        })(
                          <DatePicker disabled={readOnly} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="人数"  {...formItemLayout}>
                        {getFieldDecorator('numbers', {
                          rules: [{ pattern: /^[1-9][0-9]{0,2}$/, message: "请输入1-999的整数" }],
                          initialValue: detail.numbers
                        })(
                          <Input onBlur={this.changeCaulator} disabled={readOnly} style={{ width: '50%', marginRight: '5px' }} />
                          )}
                        <span>人</span>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <FormItem label="类型" {...formItemLayout}>
                        {getFieldDecorator('type', {
                          rules: [],
                          initialValue: detail.type
                        })(
                          <Select placeholder="请选择" disabled={readOnly}>
                            <Option value={0}>国际散客</Option>
                            <Option value={1}>国际团客</Option>
                            <Option value={2}>国内散客</Option>
                            <Option value={3}>国内团客</Option>
                          </Select>
                          )}
                      </FormItem>
                    </Col>
                  </Row>
                  <div className={styles.schemeBox}>
                    {this.createScheme()}
                    <Row gutter={20}>
                      <Col span={6} offset={18}>
                        {schemeInfo.length == 3 ? null : <Button type='primary' disabled={readOnly} onClick={this.addScheme}>增加方案</Button>}
                      </Col>
                    </Row>
                  </div>
                  <Row gutter={20}>
                    <Col span={6}>
                      <FormItem label="" {...formItemLayout}>
                        {getFieldDecorator('isPrint', {
                          rules: [{ required: true, message: "必填" }],
                          initialValue: detail.isPrint || 0
                        })(
                          <RadioGroup onChange={this.isShowTabs} disabled={readOnly}>
                            <Radio value={0}>未出票</Radio>
                            <Radio value={1}>已出票</Radio>
                          </RadioGroup>
                          )}
                      </FormItem>
                    </Col>
                    {this.props.form.getFieldValue('isPrint') == 0 ?
                      <Col span={8}>
                        <FormItem label="原因" {...formItemLayout}>
                          {getFieldDecorator('nodealReason', {
                            rules: [],
                            initialValue: resonText
                          })(
                            <Select placeholder="请选择" disabled={readOnly}>
                              <Option value=''>请选择</Option>
                              <Option value={0}>比价询单采购意愿低</Option>
                              <Option value={1}>账期结算</Option>
                              <Option value={2}>跟踪周期较长待客人确认</Option>
                              <Option value={3}>团期较远无资源匹配</Option>
                              <Option value={4}>客人预算不足</Option>
                              <Option value={5}>供应商价格高</Option>
                              <Option value={6}>线路资源缺乏无匹配</Option>
                              <Option value={7}>有供应但无位置</Option>
                            </Select>
                            )}
                        </FormItem>
                      </Col>
                      : null}

                  </Row>
                </TabPane>
              </Tabs>
            </Card>
          </div>
          {this.props.form.getFieldValue('isPrint') == 1 ?
            <div className={styles.module}>
              <Card bordered={false}>
                <Tabs type="card">
                  <TabPane tab="出票" key="1">
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="出票日期" {...formItemLayout3}>
                          {getFieldDecorator('printDate', {
                            rules: [{ required: true, message: "必填" }],
                            initialValue: detail.printDate
                          })(
                            <DatePicker disabled={readOnly} />
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="卖价" {...formItemLayout3}>
                          {getFieldDecorator('sellPrice', {
                            rules: [{ required: true, message: "必填" }, { pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                            initialValue: detail.sellPrice
                          })(
                            <Input onBlur={this.changeCaulator} disabled={readOnly} style={{ width: '70%', marginRight: "6px" }} />
                            )}
                          <span>元/人</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="请选择方案" {...formItemLayout3}>
                          {getFieldDecorator('selected', {
                            rules: [{ required: true, message: "必填" }],
                            initialValue: detail.selected
                          })(
                            <Select placeholder="请选择"
                              disabled={readOnly}
                              onChange={this.changeScheme}>
                              {this.createOptions()}
                            </Select>
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="结算总价" {...formItemLayout3}>
                          {getFieldDecorator('settlePrice', {
                            initialValue: detail.settlePrice
                          })(
                            <Input readOnly className={styles.reandOnly} />
                            )}
                          <span>元</span>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="卖价总价" {...formItemLayout3}>
                          {getFieldDecorator('totalPrice', {
                            initialValue: detail.totalPrice
                          })(
                            <Input readOnly className={styles.reandOnly} />
                            )}
                          <span>元</span>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="利润" {...formItemLayout3}>
                          {getFieldDecorator('profit', {
                            initialValue: detail.profit
                          })(
                            <Input readOnly className={styles.reandOnly} />
                            )}
                          <span>元</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="票号" {...formItemLayout3}>
                          {getFieldDecorator('ticketNo', {
                            rules: [{ required: true, message: "必填" }, { max: 200, message: "最大输入200位" }],
                            initialValue: detail.ticketNo
                          })(
                            <Input disabled={readOnly} />
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="结算" key="2">
                    <Row gutter={20}>
                      <Col span={12}>
                        <FormItem label="汇款给供应商" {...formItemLayout}>
                          {getFieldDecorator('isPayoff', {
                            valuePropName: 'checked',
                            initialValue: detail.isPayoff == 1 ? true : false
                          })(
                            <Checkbox disabled={this.props.isView ? true : specialFlag && detail.isPayoff == 1}>是</Checkbox>
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="发票/行程单" key="3">
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="是否邮寄" {...formItemLayout}>
                          {getFieldDecorator('isSendoff', {
                            valuePropName: 'checked',
                            initialValue: detail.isSendoff == 1 ? true : false
                          })(
                            <Checkbox disabled={this.props.isView ? true : specialFlag && detail.isSendoff == 1}>
                              是
                                                    </Checkbox>
                            )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="快递公司" {...formItemLayout}>
                          {getFieldDecorator('express', {
                            rules: [{ max: 30, message: "最大输入30位" }],
                            initialValue: detail.express
                          })(
                            <Input disabled={this.props.isView ? true : specialFlag && detail.isSendoff == 1} />
                            )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="快递单号" {...formItemLayout}>
                          {getFieldDecorator('waybill', {
                            rules: [{ max: 30, message: "最大输入30位" }],
                            initialValue: detail.waybill
                          })(
                            <Input disabled={this.props.isView ? true : specialFlag && detail.isSendoff == 1} />
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
          {changeInfo.length > 0 && detail.isPrint == 1 ?
            <div className={styles.module}>
              <Card bordered={false}>
                <Tabs type="card">
                  <TabPane tab="退改" key="1">
                    {detail.isPrint == 1 && this.createChangeInfo()}
                  </TabPane>
                </Tabs>
              </Card>
            </div>
            : null
          }
          <Card bordered={false}>
            <div style={{ textAlign: 'center' }}>
              {this.props.isView ?
                <Link to={"/offline/order/EditOrder/" + this.props.id}> <Button type='primary'>修改</Button></Link>
                :
                <Button type='primary' htmlType="submit">保存</Button>
              }
            </div>
          </Card>
        </Form>
        <Modal
          title="退改签"
          visible={isShowModal}
          onCancel={() => this.handleModalVisible(false)}
          footer={null}
          width={850}
        >
          {isShowModal ? <AddChangeForm hideModal={() => this.handleModalVisible(false)} /> : null}
        </Modal>
      </div>
    )
  }
}





