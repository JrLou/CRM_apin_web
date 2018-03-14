/*eslint-disable*/
//需求池页面
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker, AutoComplete, Radio, Icon, Tabs, Checkbox, Modal, message, Upload } from 'antd';
import { Link } from 'dva/router';
import styles from '../Offline.less';
import moment from 'moment';
import AddChangeForm from './AddChangeForm';
import { uploadImg } from '../../../services/api';
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
      modalVisible: false,
      activeKey: '0',
      typeNum: 0, //1-沉积客户、2-激活客户、3-活跃客户', 0就是暂时没有
      contactsArr: [], //联系人数组， 第一个为【主联系人】
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.detail) {
  //     this.setState({
  //       detail:nextProps.detail
  //     })
  //   }
  // }
  componentDidMount() {
    const { dispatch, offline: { nameWithMoreInfo } } = this.props;    
    // 获取默认的三个自动补全数组
    dispatch({
      type: 'offline/searchCustomer',
      payload: { name: '' },
      succCb: () => {
        const { detail = {} } = this.props;
        if (detail.customerName) { //仅当有customerName的时候才执行，也就是editOrder页面的时候
          this.handleSelect(detail.customerName);
        }
      },
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

  onBlurCheck = (inputId, dataSource, index, value) => {
    const { offline: { totalCustomer, totalSupplier } } = this.props;
    if (dataSource.indexOf(value) == -1) {
      this.props.form.setFieldsValue({ [inputId + index]: '' })
    } else {
      // 拿出charge
      switch (inputId) {
        case 'customerName':
          let selectedCus = totalCustomer.filter((v, k) => {
            return v.name == value
          })
          this.props.form.setFieldsValue({ 'charge': selectedCus[0].charge })
          break;
        case 'supplierName':
          let selectedSup = totalSupplier.filter((v, k) => {
            return v.name == value
          })
          this.props.form.setFieldsValue({ ['charge' + index]: selectedSup[0].charge })
          break;

        default:
          break;
      }
    }
  }
  createScheme = () => {
    const { getFieldDecorator } = this.props.form;
    const { readOnly } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const adult = +this.props.form.getFieldValue('adultCount');
    const child = +this.props.form.getFieldValue('childCount');
    const baby = +this.props.form.getFieldValue('babyCount');
    const { offline: { usernameData, supplierData, schemeInfo } } = this.props;
    let schemes = schemeInfo.map((v, k) => {
      return (<div key={'scheme' + k} className={styles.schemeContainer}>
        <legend><div className={styles.schemeTitle}><Icon type="file-text" /> <b>方案{k + 1}</b></div></legend>
        <Row gutter={20}>
          <Col span={8}>
            <FormItem label="供应商" {...formItemLayout}>
              {getFieldDecorator('supplierName' + k, {
                rules: [],
                initialValue: v.supplierName
              })(
                <AutoComplete
                  disabled={readOnly}
                  onSearch={this.autoCompSearch.bind(null, 'supplierName')}
                  dataSource={supplierData}
                  onBlur={this.onBlurCheck.bind(null, 'supplierName', supplierData, k)}
                  onChange={this.saveScheme.bind(null, k, 'supplierName', '')}
                />
                )}
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
                  onChange={this.saveScheme.bind(null, k, 'flight', '')} />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <FormItem label="结算价"  {...formItemLayout} className='specialLabel'>
              <span style={{ marginRight: '5px' }}>成人:</span>
              {getFieldDecorator('adultUnitprice' + k, {
                rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: v.adultUnitprice
              })(
                <Input
                  disabled={readOnly}
                  style={{ width: '50%', marginRight: '5px' }}
                  onChange={this.saveScheme.bind(null, k, 'adultUnitprice', /^[1-9][0-9]{0,4}$/)} />

                )}
              <span>元/人</span>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="儿童"  {...formItemLayout} className='specialLabel'>
              {getFieldDecorator('childUnitprice' + k, {
                rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: v.childUnitprice
              })(
                <Input
                  disabled={readOnly}
                  style={{ width: '50%', marginRight: '5px' }}
                  onChange={this.saveScheme.bind(null, k, 'childUnitprice', /^[1-9][0-9]{0,4}$/)} />

                )}
              <span>元/人</span>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="婴儿"  {...formItemLayout} className='specialLabel'>
              {getFieldDecorator('babyUnitprice' + k, {
                rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                initialValue: v.babyUnitprice
              })(
                <Input
                  disabled={readOnly}
                  style={{ width: '50%', marginRight: '5px' }}
                  onChange={this.saveScheme.bind(null, k, 'babyUnitprice', /^[1-9][0-9]{0,4}$/)} />

                )}
              <span>元/人</span>
            </FormItem>
          </Col>
          <Col span={3}>
            {schemeInfo.length == 1 ? null : <Button type='danger' disabled={readOnly} onClick={this.delOneSche.bind(null, k)}>删除</Button>}
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
          {getFieldDecorator('charge' + k, {
            initialValue: v.charge
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
    // 每次删除方案重新填写
    this.props.form.setFieldsValue({
      selected: '',
      settlePrice: '',
      totalPrice: '',
      profit: '',
    })

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
    setTimeout(() => {
      this.setValue()
    }, 200);

  }
  setValue = () => {
    const { offline: { schemeInfo } } = this.props;
    // console.log(schemeInfo);
    schemeInfo.map((v, k) => {
      this.props.form.setFieldsValue(
        {
          ['supplierName' + k]: v.supplierName,
          ['adultUnitprice' + k]: v.adultUnitprice,
          ['childUnitprice' + k]: v.childUnitprice,
          ['babyUnitprice' + k]: v.babyUnitprice,
          ['flight' + k]: v.flight,
          ['id' + k]: v.id,
          ['orderId' + k]: v.orderId,
          ['charge' + k]: v.orderId,
        }
      )
    })
  }
  saveScheme = (k, inputId, reg, e) => {
    // 计算价格先
    reg && this.changeCaulator(reg, e)

    const { dispatch, offline: { schemeInfo } } = this.props;
    let newSchemeInfo = schemeInfo;
    newSchemeInfo[k][inputId] = e.target ? e.target.value : e;
    dispatch({
      type: 'offline/changeSchemeInfo',
      payload: newSchemeInfo,
    })
    // console.log(schemeInfo)
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
                  rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }, { required: true, message: "必填" }],
                  initialValue: v.fee
                })(
                  <Input disabled={isDisabled} onChange={this.saveChange.bind(null, k, 'fee')} />
                  )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="退改利润"  {...formItemLayout}>
                {getFieldDecorator('profit' + k, {
                  rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }, { required: true, message: "必填" }],
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
                  rules: [{ max: 200, message: "输入位数过长" }, { required: true, message: "必填" }],
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
            {/* {getFieldDecorator('id' + k, {
              initialValue: v.id
            })(
              <Input type='hidden' />
              )} */}
            {/* {getFieldDecorator('orderId' + k, {
              initialValue: v.orderId
            })(
              <Input type='hidden' />
              )} */}
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
  handleSelect = (value) => {
    const { offline: { nameWithMoreInfo }, form: { setFieldsValue } } = this.props;    
    const targetObj = nameWithMoreInfo.find(obj => obj.name === value);
    const { type } = targetObj;
    const { contacts } = targetObj;
    this.setState({typeNum: type, contactsArr: contacts});
    //应该直接设置后面那个Select的值
    setFieldsValue({contacts: contacts[0]});
  };

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
      // 判断标签页。/ 
      if (values.ticketStatus == 1) {
        let errorArr = []
        for (const key in err) {
          if (err.hasOwnProperty(key)) {
            errorArr.push(key);
          }
        }
        if (errorArr.indexOf('express') !== -1 || errorArr.indexOf('waybill') !== -1) {
          this.setState({
            activeKey: '3'
          })
        }
        else if (errorArr.indexOf('receiptDate') !== -1 || errorArr.indexOf('receiptAmount') !== -1 || errorArr.indexOf('receiptVoucher') !== -1) {
          this.setState({
            activeKey: '0'
          })
        }
        else if (errorArr.indexOf('payoffDate') !== -1) {
          this.setState({
            activeKey: '2'
          })
        }
        else {
          this.setState({
            activeKey: '1'
          })
        }
      }

      if (!err) {
        values = this._changeToDatestr(values, ['arrDate', 'depDate', 'inquiryDate', 'printDate', 'payoffDate', 'receiptDate'])
        values = this._changePlanValues(values, ['supplierName', 'adultUnitprice', 'childUnitprice', 'babyUnitprice', 'flight', 'id', 'orderId', 'selected', 'charge'])
        values.isPayoff = values.isPayoff ? '1' : '0';
        values.isReceipt = values.isReceipt ? '1' : '0';
        values.isSendoff = values.isSendoff ? '1' : '0';
        // console.log('将要提交的参数'); console.log(values);
        // 凭证
        // values.receiptVoucher = values.receiptVoucher.fileList.join(',');
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
  changeCaulator = (reg, e) => {
    // 判断输入不对就清空
    // console.log('e:' + e);
    if (!reg.test(e.target.value)) {
      this.props.form.setFieldsValue({
        [e.target.id]: ''
      })
    }
    // 如果方案已选择  
    let index = this.props.form.getFieldValue('selected');
    if (index === 0 || index) {
      // 重新计算
      setTimeout(() => {
        this.changeScheme(index)
      }, 200);
    }
  }
  changeScheme = (value) => {
    const { dispatch } = this.props;
    // 人数  结算价  卖价;
    if (value !== '') {
      // 人数
      let adultCounts = +(this.props.form.getFieldValue('adultCount') || 0);
      let childCounts = +(this.props.form.getFieldValue('childCount') || 0);
      let babyCounts = +(this.props.form.getFieldValue('babyCount') || 0);
      // 方案结算价
      let adultPrice = +(this.props.form.getFieldValue('adultUnitprice' + value) || 0);
      let childPrice = +(this.props.form.getFieldValue('childUnitprice' + value) || 0);
      let babyPrice = +(this.props.form.getFieldValue('babyUnitprice' + value) || 0);
      // 卖价
      let adultSellPrice = +(this.props.form.getFieldValue('adultSellPrice') || 0);
      let childSellPrice = +(this.props.form.getFieldValue('childSellPrice') || 0);
      let babySellPrice = +(this.props.form.getFieldValue('babySellPrice') || 0);

      if (!adultCounts || !adultPrice || !adultSellPrice) {
        message.warning('请输入成人人数、成人方案结算价、成人卖价再选择')
        setTimeout(() => {
          this.props.form.setFieldsValue({
            selected: '',
            settlePrice: '',
            totalPrice: '',
            profit: '',
          })

        }, 100);
        return
      }
      if (childCounts) {
        // && childPrice childSellPrice
        if (!childPrice || !childSellPrice) {
          message.warning('缺少儿童方案结算价或儿童卖价')
          setTimeout(() => {
            this.props.form.setFieldsValue({
              selected: '',
              settlePrice: '',
              totalPrice: '',
              profit: '',
            })
          }, 100);
          return
        }
      }
      if (babyCounts) {
        // && childPrice childSellPrice
        if (!babyPrice || !babySellPrice) {
          message.warning('缺少婴儿方案结算价或婴儿卖价')
          setTimeout(() => {
            this.props.form.setFieldsValue({
              selected: '',
              settlePrice: '',
              totalPrice: '',
              profit: '',
            })
          }, 100);
          return
        }
      }
      let price = adultCounts * adultPrice + childCounts * childPrice + babyCounts * babyPrice;
      let sellPrice = adultCounts * adultSellPrice + childCounts * childSellPrice + babyCounts * babySellPrice;
      // 计算出三个价钱
      this.props.form.setFieldsValue({
        settlePrice: price,
        totalPrice: sellPrice,
        profit: sellPrice - price
      })

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
  changeTab = (activeKey) => {
    this.setState({
      activeKey: activeKey
    })
  }
  getFileList = (imgList) => {
    this.props.form.setFieldsValue({
      receiptVoucher: imgList
    })
  }
  transferType = type => {
    //'类型，1-沉积客户、2-激活客户、3-活跃客户',
    let result = '';
    switch (type) {
      case 1:
        result = '沉积客户';
        break;
      case 2:
        result = '激活客户';
        break;
      case 3:
        result = '活跃客户';
        break;
      default:
        break;
    }
    return result;
  };

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
    const formItemLayout4 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 },
    };
    const formItemLayout5 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const { readOnly, offline: { usernameData, nameWithMoreInfo, totalCustomer, supplierData, cityData, cityData2, changeInfo, schemeInfo, isShowModal } } = this.props;
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
    } else if (detail.ticketStatus == 1 && !this.props.isLeader) {//已出票，不是领导
      specialFlag = true
    }

    const columns = [
      {
        title: '序号',
        key: 'index',
        width: 100,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '操作人',
        dataIndex: 'createUserName',
        width: 150
      },
      {
        title: '操作日期',
        dataIndex: 'createTime',
        width: 180
      },
      {
        title: '内容',
        dataIndex: 'record',
      }
    ]
    const adultRequire = +this.props.form.getFieldValue('adultCount');
    const childRequire = +this.props.form.getFieldValue('childCount');
    const babyRequire = +this.props.form.getFieldValue('babyCount');

    const {contactsArr, typeNum} = this.state;

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
                          disabled={detail.ticketStatus !== 1}
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
                            style={{ width: '60%', marginRight: '5px' }}
                            onSearch={this.autoCompSearch.bind(null, 'customerName')}
                            disabled={readOnly}
                            dataSource={usernameData}
                            onBlur={this.onBlurCheck.bind(null, 'customerName', usernameData, '')} 
                            onSelect={this.handleSelect}
                          />
                          )}
                        <span style={{color: '#f00'}}>{this.transferType(typeNum || detail.customerType)}</span>
                      </FormItem>
                      {getFieldDecorator('charge', {
                        initialValue: detail.charge
                      })(
                        <Input type='hidden' />
                        )}
                    </Col>
                    <Col span={8}>
                      <FormItem label="联系人"  {...formItemLayout}>
                        {getFieldDecorator('contacts', {initialValue: contactsArr[0] || detail.contacts})(
                          <Select disabled={readOnly}>
                            {contactsArr.map((currV, i) => <Option value={currV} key={`${currV}${i}`}>{currV}</Option>)}
                          </Select>
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
                            onBlur={this.onBlurCheck.bind(null, 'cityDep', cityData, '')} />
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
                            onBlur={this.onBlurCheck.bind(null, 'cityArr', cityData2, '')} />
                          )}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="类型" {...formItemLayout}>
                        {getFieldDecorator('type', {
                          rules: [],
                          initialValue: detail.type
                        })(
                          <Select placeholder="请选择" disabled={readOnly}>
                            <Option value={0}>国内散客</Option>
                            <Option value={1}>国内团队</Option>
                            <Option value={2}>国际散客</Option>
                            <Option value={3}>国际团队</Option>
                          </Select>
                          )}
                      </FormItem>
                    </Col>
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
                      <FormItem label="人数:&nbsp;&nbsp;成人"  {...formItemLayout}>
                        {/* <span style={{ marginRight: '5px' }}>:</span> */}
                        {getFieldDecorator('adultCount', {
                          rules: [{ pattern: /^[1-9][0-9]{0,2}$/, message: "请输入1-999的整数" }],
                          initialValue: detail.adultCount
                        })(
                          <Input onChange={this.changeCaulator.bind(null, /^[1-9][0-9]{0,2}$/)} disabled={readOnly} style={{ width: '50%', marginRight: '5px' }} />
                          )}
                        <span>人</span>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="儿童"  {...formItemLayout}>
                        {getFieldDecorator('childCount', {
                          rules: [{ pattern: /^[0-9]{0,3}$/, message: "请输入0-999的整数" }],
                          initialValue: detail.childCount
                        })(
                          <Input onChange={this.changeCaulator.bind(null, /^[0-9]{0,3}$/)} disabled={readOnly} style={{ width: '50%', marginRight: '5px' }} />
                          )}
                        <span>人</span>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem label="婴儿"  {...formItemLayout}>
                        {getFieldDecorator('babyCount', {
                          rules: [{ pattern: /^[0-9]{0,3}$/, message: "请输入0-999的整数" }],
                          initialValue: detail.babyCount
                        })(
                          <Input onChange={this.changeCaulator.bind(null, /^[0-9]{0,3}$/)} disabled={readOnly} style={{ width: '50%', marginRight: '5px' }} />
                          )}
                        <span>人</span>
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
                        {getFieldDecorator('ticketStatus', {
                          rules: [{ required: true, message: "必填" }],
                          initialValue: detail.ticketStatus || 0
                        })(
                          <RadioGroup onChange={this.isShowTabs} disabled={readOnly}>
                            <Radio value={0}>等待</Radio>
                            <Radio value={2}>失败</Radio>
                            <Radio value={1}>出票</Radio>
                          </RadioGroup>
                          )}
                      </FormItem>
                    </Col>
                    {this.props.form.getFieldValue('ticketStatus') == 2 ?
                      <Col span={8}>
                        <FormItem label="原因" {...formItemLayout}>
                          {getFieldDecorator('nodealReason', {
                            rules: [],
                            initialValue: detail.nodealReason || 0
                          })(
                            <Select placeholder="请选择" disabled={readOnly}>
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
          {this.props.form.getFieldValue('ticketStatus') == 1 ?
            <div className={styles.module}>
              <Card bordered={false}>
                <Tabs type="card" activeKey={this.state.activeKey} onChange={this.changeTab}>
                  <TabPane tab="收款凭证" key="0" >
                    <Row gutter={20}>
                      <Col span={24}>
                        <FormItem label="是否已收款" {...formItemLayout4}>
                          {getFieldDecorator('isReceipt', {
                            valuePropName: 'checked',
                            initialValue: detail.isReceipt == 1 ? true : false
                          })(
                            <Checkbox disabled={this.props.isView ? true : specialFlag && detail.isReceipt == 1}>是</Checkbox>
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={24}>
                        <FormItem label="收款日期" {...formItemLayout4}>
                          {getFieldDecorator('receiptDate', {
                            rules: [{ required: this.props.form.getFieldValue('isReceipt'), message: "必填" }],
                            initialValue: detail.receiptDate
                          })(
                            <DatePicker disabled={this.props.isView ? true : specialFlag && detail.receiptDate} />
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20} >
                      <Col span={24}>
                        <FormItem label="收款金额" {...formItemLayout4}>
                          {getFieldDecorator('receiptAmount', {
                            rules: [{ required: this.props.form.getFieldValue('isReceipt'), message: "必填" }, { pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                            initialValue: detail.receiptAmount
                          })(
                            <Input disabled={this.props.isView ? true : specialFlag && detail.receiptAmount} style={{ width: '70%', marginRight: "6px" }} />
                            )}
                          <span>元</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20} >
                      <Col span={24} >
                        <FormItem label="上传图片" {...formItemLayout5}>
                          {getFieldDecorator('receiptVoucher', {
                            rules: [{ required: this.props.form.getFieldValue('isReceipt'), message: "必填" }],
                            initialValue: detail.receiptVoucher
                          },
                          )(
                            <UpImg disabled={this.props.isView ? true : specialFlag && detail.receiptVoucher} getFileList={this.getFileList} imgList={detail.receiptVoucher} />
                            )}

                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="出票" key="1">
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="出票日期" {...formItemLayout3}>
                          {getFieldDecorator('printDate', {
                            rules: [],
                            initialValue: detail.printDate
                          })(
                            <DatePicker disabled={this.props.isView ? true : specialFlag && detail.printDate} />
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>

                      <Col span={8}>
                        <FormItem label="卖价" {...formItemLayout3}>
                          <span style={{ marginRight: '5px' }}>成人:</span>
                          {getFieldDecorator('adultSellPrice', {
                            rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                            initialValue: detail.adultSellPrice
                          })(
                            <Input onChange={this.changeCaulator.bind(null, /^[1-9][0-9]{0,4}$/)}
                              disabled={this.props.isView ? true : specialFlag && detail.adultSellPrice} style={{ width: '70%', marginRight: "6px" }} />
                            )}
                          <span>元/人</span>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="儿童" {...formItemLayout3}>
                          {getFieldDecorator('childSellPrice', {
                            rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                            initialValue: detail.childSellPrice
                          })(
                            <Input onChange={this.changeCaulator.bind(null, /^[1-9][0-9]{0,4}$/)}
                              disabled={this.props.isView ? true : specialFlag && detail.childSellPrice} style={{ width: '70%', marginRight: "6px" }} />
                            )}
                          <span>元/人</span>
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="婴儿" {...formItemLayout3}>
                          {getFieldDecorator('babySellPrice', {
                            rules: [{ pattern: /^[1-9][0-9]{0,4}$/, message: "请输入1-99999的整数" }],
                            initialValue: detail.babySellPrice
                          })(
                            <Input onChange={this.changeCaulator.bind(null, /^[1-9][0-9]{0,4}$/)}
                              disabled={this.props.isView ? true : specialFlag && detail.babySellPrice} style={{ width: '70%', marginRight: "6px" }} />
                            )}
                          <span>元/人</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="请选择方案" {...formItemLayout3}>
                          {getFieldDecorator('selected', {
                            rules: [],
                            initialValue: detail.selected
                          })(
                            <Select placeholder="请选择"
                              disabled={this.props.isView ? true : specialFlag && detail.selected !== undefined}
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
                            rules: [{ max: 200, message: "最大输入200位" }],
                            initialValue: detail.ticketNo
                          })(
                            <Input disabled={this.props.isView ? true : specialFlag && detail.ticketNo} />
                            )}
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="结算" key="2">
                    <Row gutter={20}>
                      <Col span={8}>
                        <FormItem label="打款给供应商" {...formItemLayout}>
                          {getFieldDecorator('isPayoff', {
                            valuePropName: 'checked',
                            initialValue: detail.isPayoff == 1 ? true : false
                          })(
                            <Checkbox disabled={this.props.isView ? true : specialFlag && detail.isPayoff == 1}>是</Checkbox>
                            )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="打款日期" {...formItemLayout}>
                          {getFieldDecorator('payoffDate', {
                            rules: [{ required: this.props.form.getFieldValue('isPayoff'), message: '必填' }],
                            initialValue: detail.payoffDate
                          })(
                            <DatePicker disabled={this.props.isView ? true : specialFlag && detail.isPayoff == 1} />
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
                            rules: [{ max: 30, message: "最大输入30位" }, { required: this.props.form.getFieldValue('isSendoff'), message: '必填' }],
                            initialValue: detail.express
                          })(
                            <Input disabled={this.props.isView ? true : specialFlag && detail.isSendoff == 1} />
                            )}
                        </FormItem>
                      </Col>
                      <Col span={8}>
                        <FormItem label="快递单号" {...formItemLayout}>
                          {getFieldDecorator('waybill', {
                            rules: [{ max: 30, message: "最大输入30位" }, { required: this.props.form.getFieldValue('isSendoff'), message: '必填' }],
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
          {changeInfo.length > 0 && detail.ticketStatus == 1 ?
            <div className={styles.module}>
              <Card bordered={false}>
                <Tabs type="card">
                  <TabPane tab="退改" key="1">
                    {detail.ticketStatus == 1 && this.createChangeInfo()}
                  </TabPane>
                </Tabs>
              </Card>
            </div>
            : null
          }
          <div className={styles.module}>
            <Card bordered={false}>
              <Tabs type="card">
                <TabPane tab="操作备注" key="1">
                  {detail.records ?
                    <FormItem label="记录" {...formItemLayout2}>
                      <Table
                        dataSource={detail.records}
                        columns={columns}
                        pagination={false}
                        bordered={true}
                        rowKey="id"
                      />
                    </FormItem>
                    : null}
                  <FormItem label="内容" {...formItemLayout2}>
                    {getFieldDecorator('record', {
                      rules: [{ max: 200, message: "最多输入200字" }],
                      initialValue: detail.record
                    })(
                      <TextArea disabled={this.props.isView ? true : false} rows={4} />
                      )}
                  </FormItem>
                </TabPane>
              </Tabs>
            </Card>
          </div>
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


class UpImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imgList: []
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log('next!!!!!!!!!!!!!!!!');
    // console.log(nextProps.imgList);
    // console.log('cur!!!!!!!');
    // console.log(this.props.imgList);
    if (this.props.imgList !== nextProps.imgList) {
      console.log('hello');
      this.setState({
        imgList: nextProps.imgList ? nextProps.imgList.split(',') : []
      })
    }
  }
  componentDidMount() {
    if (this.props.imgList) {
      this.setState({
        imgList: this.props.imgList.split(',')
      })
    }
  }
  handlePreview(file) {
    //显示图片
  }
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  onChange(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => {
        // 在这里请求接口 
        let imgList = this.state.imgList;
        uploadImg({ img: imageUrl }).then((response) => {
          if (response.code == 200) {
            imgList.push(response.data.url);
            this.setState({
              imgList,
              loading: false,
            },
              () => {
                this.props.getFileList(imgList.join(','));
              })
          }

        })
      });
    }
  }


  beforeUpload = (file, fl) => {
    if (file) {

      if (!/.+(.JPEG|.jpeg|.JPG|.jpg|.PNG|.png)$/.test(file.type)) {
        message.error("图片格式仅支持jpg、jpeg和png");
        return false;
      }
      if (file.size >= 5120000) {
        message.error("图片过大，最大允许5M。");
        return false;
      }
      if (file.status === "error") {
        message.error("图片(" + file.name + ")上传错误,请重新上传。");
        return false;
      }
    }
    return true
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const imgList = this.state.imgList;
    // console.log(imgList)
    return (
      <div style={{ width: "100%", background: "transparent" }}  >
        {imgList.map((url, key) => {
          return <span className={styles.uploadBox} key={key}>
            <div style={{ width: 102, height: 102, marginBottom: 20, position: "relative" }}
              onClick={() => {
                // alert(url);
                this.setState({
                  visible: true,
                  showImg: url
                })
              }}
            >
              <img key={key} style={{ width: "100%", height: "100%" }} src={url} />
              {
                this.props.disabled ? null :
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, background: 'rgba(0, 0, 0, 0.3)',
                    lineHeight: "30px", height: "30px", textAlign: "center", color: "#fff", fontSize: 16,
                    cursor: 'pointer'
                  }}
                    onClick={(ev) => {
                      //del img
                      imgList.splice(key, 1);
                      this.setState({ imgList },
                        () => {
                          this.props.getFileList(imgList.join(','));
                        });
                      try {
                        let oEvent = ev;
                        //js阻止事件冒泡
                        oEvent.cancelBubble = true;
                        oEvent.stopPropagation();
                        //js阻止链接默认行为，没有停止冒泡
                        oEvent.preventDefault();
                        return false;
                      } catch (e) {

                      }

                    }}
                  >
                    删除
              </div>
              }
            </div>
          </span>;
        })}

        <span className={styles.uploadBox}>
          <Upload
            style={{ cursor: this.props.disabled ? 'not-allowed' : 'default' }}
            disabled={this.props.disabled}
            onRemove={true}
            action=""
            listType="picture-card"
            showUploadList={false}
            onPreview={this.handlePreview.bind(this)}
            onChange={this.onChange.bind(this)}
            beforeUpload={this.beforeUpload.bind(this)}

          >
            {this.state.imgList.length == 6 || this.props.disabled ? null : uploadButton}
          </Upload >
        </span>
        <Modal visible={this.state.visible} footer={null} onCancel={this.handleCancel} width={800} style={{ textAlign: 'center' }}>
          <img style={{ maxWidth: '100%' }} src={this.state.showImg} />
        </Modal>
      </div>
    )
  }
}




