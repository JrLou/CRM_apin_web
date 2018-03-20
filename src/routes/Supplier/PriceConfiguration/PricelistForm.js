import React, {PureComponent} from 'react';
import {
  Calendar, Checkbox, Col, Form, Input, Select, Button, Row, message, Radio
} from 'antd'
import AllocationCalendar from '../supplierPolicy/AllocationCalendar/MultipleSelectCalendar.js';
import {editPriceConfig, getpriceAirline, addPriceConfig,} from '../../../services/api'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import css from './PriceList.less';
import moment from 'moment';

// 批量修改的表单
class BulkImportForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      value: null,
      values: null,
      selectedTips: [],
      currenMonthStocks: new Array(31).fill(0),
      currentData: {},
      text: '',
      order: '',
      data: [],
      datesArr: [],
      id: null,
    }
  }

  componentDidMount() {
    this.setState({
      currentData: this.props.currentData,
    });
    switch (this.props.condition) {
      case 0:
        this.judgment(this.props.currentData)
        break;
      case 2:
        let date = this.props.currentData.detail.map((v, k) => {
          return moment(v).format("YYYY-MM-DD")
        })
        this._searchPort(getpriceAirline, {
          id: this.props.currentData.airline_id,
          date: moment(this.props.currentData.detail ? this.props.currentData.detail[0] : new Date()).format("YYYY-MM")
        }, 1)
        this.setState({id: this.props.currentData.airline_id, selectedTips: date});
        break;
      case 4:
        this.props.form.resetFields();
        break;
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentData: nextProps.currentData,
      id: nextProps.currentData.airline_id,
    });
    switch (nextProps.condition) {
      case 0:
        this.judgment(nextProps.currentData)
        break;
      case 2:
        let date = nextProps.currentData.detail.map((v, k) => {
          return moment(v).format("YYYY-MM-DD")
        })
        this._searchPort(getpriceAirline, {
          id: nextProps.currentData.airline_id,
          date: moment(nextProps.currentData.detail ? nextProps.currentData.detail[0] : new Date()).format("YYYY-MM")
        }, 1)
        this.setState({id: nextProps.currentData.airline_id, selectedTips: date});
        break;
      case 4:
        this.props.form.resetFields();
        break;
    }
  }

  handleSubmit(e) {
    const {condition, currentData} = this.props;
    let data = {}
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.id = values.airline_id ? values.airline_id : currentData.airline_id
        values.config_id = currentData.id
        values.price = values.price * 100
        values.price_group = values.price_group * 100
        for (let i in values) {
          if (values[i] != undefined) {
            data[i] = values[i];
          }
        }
        if (values.type == 0) {
          delete data.price
        } else {
          delete data.percent
        }
        if (values.type_group == 0) {
          delete data.price_group
        } else {
          delete data.percent_group
        }
        switch (this.props.condition) {
          case 0:
            data.state = 1
            this._searchPort(editPriceConfig, data, 0)
            break;
          case 2:
            data.date = this.state.datesArr.length > 0 ? this.state.datesArr.join(',') : -1
            this._searchPort(editPriceConfig, data, 0)
            break;
          case 3:
            data.date = this.state.datesArr.length > 0 ? this.state.datesArr.join(',') : -1
            this._searchPort(addPriceConfig, data, 0)
            break;
        }

        this.props.form.resetFields()
        this.setState({
          value: null,
          values: null,
        });

      }
    });
  }

  _searchPort(url, value, ole) {
    url(value).then((response) => {
      if (response.code == 200) {
        switch (ole) {
          case 0:
            message.success('编辑成功')
            this.props.success()
            break;
          case 1:
            this.setState({
              data: response.data,
            });
            break;
        }
      } else {
        message.warning(response.msg)
        return
      }
    }).catch(() => {
      message.warning(response.msg)
    });
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
    });
    if(e.target.value==0){
      this.props.form.resetFields('price');
    } else {
      this.props.form.resetFields('percent');
    }
  }

  onChanges(e) {
    this.setState({
      values: e.target.value,
    });
    if(e.target.value==0){
      this.props.form.resetFields('price_group');
    } else {
      this.props.form.resetFields('percent_group');
    }
  }

  showPickInfo(pickInfo) {
    this.createSelectedText(pickInfo)
    this.setState({
      selectedStocks: pickInfo
    })
  }

  // 生成页面显示的已选信息
  createSelectedText(pickInfo) {
    let textArr = []
    // let wholeStock = []
    let datesArr = []
    // 年
    for (var key in pickInfo) {
      if (pickInfo.hasOwnProperty(key)) {
        // 月
        for (var _key in pickInfo[key]) {
          if (pickInfo[key].hasOwnProperty(_key)) {
            let sortedDays = pickInfo[key][_key].days.sort((a, b) => {
              return a - b
            })
            let newDays = sortedDays.map((v, k) => {
              datesArr.push(
                moment(key + '-' + _key + '-' + v, "YYYY-MM-DD").format("YYYY-MM-DD")
              )
              return v + '日'
            })
            newDays.length > 0 && textArr.push(
              <div key={key + _key}
                   className={css.tip}>{key + '年' + _key + '月：' + newDays.join(',')}</div>
            )
            // wholeStock = wholeStock.concat(pickInfo[key][_key].stocks)
          }
        }

      }
    }
    this.setState({
      selectedTips: textArr,
      // minStock: _minStock ? _minStock : 0,
      datesArr: datesArr
    })
  }

  judgment(obj) {
    let text = ''
    let order = ''
    switch (obj.airline_id) {
      case "0":
        text = '国际长线'
        order = '代销'
        break;
      case "1":
        text = '国际短线'
        order = '代销'
        break;
      case "2":
        text = '国内航线'
        order = '代销'
        break;
      case "3":
        text = '国际长线'
        order = '硬切'
        break;
      case "4":
        text = '国际短线'
        order = '硬切'
        break;
      case "5":
        text = '国内航线'
        order = '硬切'
        break;
    }
    this.setState({
      text: text,
      order: order
    })
  }

  calendar(e) {
    if (e.target.value) {

      this._searchPort(getpriceAirline, {
        id: e.target.value,
        date: moment(new Date().getTime()).format("YYYY-MM")
      }, 1)
      this.setState({
        id: e.target.value,
      })
    } else {
      message.warning('请填写航班资源号')
      return
    }
  }

  validatores(rule, value, callback) {
    if (value > 1000 || value < -100) {
      callback('范围为-100-1000')
    }
    if ((value + '').split('.')[1] && value.split('.')[1].length > 1) {
      callback('最多一位小数')
    }
    callback()
  }

  validatoresb(rule, value, callback) {
    if (value > 999999 || value < -999999) {
      callback('范围为-999999-999999')
    }
    callback()
  }

  //
  // guanb() {
  //   this.props.guab()
  // }
  updateMonthStock(obj, ole) {
    console.log(obj)
    console.log(ole)
    if (this.state.id) {
      this._searchPort(getpriceAirline, {
        id: this.state.id,
        date: obj + "-" + ((ole + 1) < 9 ? "0" + (ole + 1) : (ole + 1))
      }, 1)
    } else {
      message.warning('请填写航班资源号')
      return
    }
  }

  render() {
    // let airline = [{flight_date:'1521072000000',sale_count:100,seat_count:1111,sell_price:1111,settlement_price:1222}]
    const {getFieldDecorator} = this.props.form;
    const {condition} = this.props;
    let {data} = this.state
    let [year, month, day] = [
      +moment(this.props.currentData.detail ? this.props.currentData.detail[0] : new Date().getTime(), "YYYY-MM-DD").format('YYYY'),
      +moment(this.props.currentData.detail ? this.props.currentData.detail[0] : new Date().getTime(), "YYYY-MM-DD").format('MM') - 1,
      +moment(this.props.currentData.detail ? this.props.currentData.detail[0] : new Date().getTime(), "YYYY-MM-DD").format('DD')
      + moment('2018-03-15', "YYYY-MM-DD").format('YYYY'),
      +moment('2018-03-15', "YYYY-MM-DD").format('MM') - 1,
      +moment('2018-03-15', "YYYY-MM-DD").format('DD')
    ]
    let canPick = this.state.data.map((v, k) => {
      return moment(moment(v.flight_date).format("YYYY-MM-DD"), 'YYYY-MM-DD').format('x')
    })
    // let canPick = [1521043200000]
    const {value, values} = this.state
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
        <Row>
          {(condition == 2 || condition == 3) ?
            <Col span={24}>
              <FormItem
                label="机票资源号"
                {...formItemLayout}
              >
                {getFieldDecorator('airline_id', {
                  initialValue: this.props.currentData.airline_id
                })
                (< Input disabled={(condition == 2 ? true : false)} onBlur={this.calendar.bind(this)}
                         style={{width: '280px', marginRight: '10px'}}/>)}

              </FormItem>
            </Col> : null
          }
          {(condition == 2 || condition == 3) ?
            <Col span={24}>
              <Col span={6} style={{textAlign: "right"}}>
                <div className={css.title}>选择团期:</div>
              </Col>
              <Col span={16} style={{paddingLeft: '4px'}}>
                <AllocationCalendar
                  ref={calendar => this.outter = calendar}
                  year={year}
                  month={month}
                  day={day}
                  currenMonthStocks={this.state.currenMonthStocks}
                  updateMonthStock={this.updateMonthStock.bind(this)}
                  canPick={canPick}
                  placeholder={this.state.selectedTips.length > 0 ? '已选择' : '选择分配时间'}
                  upPickInfo={this.showPickInfo.bind(this)}
                />
                <div className={css.tipBox}>
                  {this.state.selectedTips.length > 0 ? <div>已选择：</div> : null}
                  {this.state.selectedTips.length > 0 ? this.state.selectedTips.join("，") : "请选择需要批量修改的日期"} {/*显示的日期加上逗号分隔*/}
                </div>
              </Col>
            </Col> : null
          }
          {condition == 0 ?
            <Col span={24}>
              <FormItem
                label="采购类型"
                {...formItemLayout}
              >
                {getFieldDecorator('resourceIndex', {
                  initialValue: this.state.order
                })
                (< Input className={css.notEdit} placeholder="" readOnly
                         style={{width: '150px', marginRight: '10px'}}/>)}

              </FormItem>
            </Col> : null
          }
          {condition == 0 ?
            <Col span={24}>
              <FormItem
                label="航线类型"
                {...formItemLayout}
              >
                {getFieldDecorator('flightrrrrrNo', {
                  initialValue: this.state.text
                })
                (< Input className={css.notEdit} placeholder="" readOnly
                         style={{width: '150px', marginRight: '10px'}}/>)}
              </FormItem>
            </Col> : null
          }

          <Col span={24}>
            <FormItem
              label="加价方式（单团）"
              {...formItemLayout}
            >
              {getFieldDecorator('type', {
                rules: [{required: true, message: '请选择加价方式'}],
                initialValue: this.state.value
              })
              (<RadioGroup onChange={this.onChange.bind(this)}>
                <Col span={24} style={{marginBottom: '20px'}}>
                  <Col span={6}>
                    <Radio value={0}>比例加价</Radio>
                  </Col>
                  <Col span={18}>
                    <FormItem
                      {...formItemLayout}
                    >
                      {getFieldDecorator('percent', {
                        rules: [{required: value == 0 ? true : false, message: '请填写次字段'}, {
                          validator: this.validatores.bind(this),
                        }, {
                          pattern: /^[\+\-]?\d*?\.?\d*?$/,
                          message: "只能输入数字"
                        }],
                        initialValue: this.state.currentData.percent ? this.state.currentData.percent : 0
                      })
                      (< Input addonAfter={'%'}
                               disabled={value == 0 ? false : true}
                               style={{width: '150px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={6}>
                    <Radio value={1}>金额加价</Radio>
                  </Col>
                  <Col span={18}>
                    <FormItem
                      {...formItemLayout}
                    >
                      {getFieldDecorator('price', {
                        rules: [{required: value == 1 ? true : false, message: '请填写次字段'}, {
                          validator: this.validatoresb.bind(this),
                        }, {
                          pattern: /^[\+\-]?\d*?\.?\d*?$/,
                          message: "只能输入数字"
                        }],
                        initialValue: this.state.currentData.price ? parseInt(this.state.currentData.price) / 100 : 0
                      })
                      (< Input addonAfter={'元'}
                               disabled={value == 1 ? false : true}
                               style={{width: '150px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                </Col>
              </RadioGroup>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="加价方式（系列团）"
              {...formItemLayout}
            >
              {getFieldDecorator('type_group', {
                rules: [{required: true, message: '请选择加价方式'}],
                initialValue: this.state.values,
              })
              (<RadioGroup onChange={this.onChanges.bind(this)}>
                <Col span={24} style={{marginBottom: '20px'}}>
                  <Col span={6}>
                    <Radio value={0}>比例加价</Radio>
                  </Col>
                  <Col span={18}>
                    <FormItem
                      {...formItemLayout}
                    >
                      {getFieldDecorator('percent_group', {
                        rules: [{required: values == 0 ? true : false, message: '请填写次字段'}, {
                          validator: this.validatores.bind(this),
                        }, {
                          pattern: /^[\+\-]?\d*?\.?\d*?$/,
                          message: "只能输入数字"
                        }],
                        initialValue: this.state.currentData.percent_group ? this.state.currentData.percent_group : 0
                      })
                      (< Input addonAfter={'%'}
                               disabled={values == 0 ? false : true}
                               style={{width: '150px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                </Col>
                <Col span={24}>
                  <Col span={6}>
                    <Radio value={1}>金额加价</Radio>
                  </Col>
                  <Col span={18}>
                    <FormItem
                      {...formItemLayout}
                    >
                      {getFieldDecorator('price_group', {
                        rules: [{required: values == 1 ? true : false, message: '请填写次字段'}, {
                          validator: this.validatoresb.bind(this),
                        }, {
                          pattern: /^[\+\-]?\d*?\.?\d*?$/,
                          message: "只能输入数字"
                        }],
                        initialValue: this.state.currentData.price_group ? parseInt(this.state.currentData.price_group) / 100 : 0
                      })
                      (< Input addonAfter={'元'}
                               disabled={values == 1 ? false : true}
                               style={{width: '150px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                </Col>
              </RadioGroup>)}
            </FormItem>
          </Col>
          {(condition == 2 || condition == 3) ?
            <Col span={24}>
              <FormItem
                label="状态"
                {...formItemLayout}
              >
                {getFieldDecorator('state', {
                  rules: [{required: true, message: '请填写次字段'}],
                  initialValue: this.props.currentData.state
                })
                (<RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </RadioGroup>)}

              </FormItem>
            </Col> : null
          }
          <Col span={24}>
            <FormItem
              {...formItemLayout}
            >
              <Button style={{marginLeft: '35%', marginRight: "20px"}} type="primary" htmlType="submit">确认</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedBulkImportForm = Form.create()(BulkImportForm);
module.exports = WrappedBulkImportForm;
