/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Radio,
  Tabs,
  DatePicker,
  Row,
  Col,
  Table,
  AutoComplete,
} from 'antd';
import {connect, Link} from 'dva';
import css from './Flightstock.less';
import moment from 'moment';
import FlightstockPlugin from './FlightstockPlugin.js';
import Algorithm from './FlightstockAlgorithm.js';
import Manual from './FlightstockManual.js';
import FlightstockCalendar from './FlightstockCalendarView.js';
import FlightstockShow from './FlightstockShow.js';
import {getdetailAirLine, geteditAirline, searchSupplier} from '../../../services/api'

const {TextArea} = Input;
const {Column,} = Table;
const confirm = Modal.confirm;
const Option = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const {RangePicker} = DatePicker;

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flightdata: {},
      flightstockData: [{}, {}],//用于储蓄已添加航线
      linenubber: [],//用于存储以添加航线的值的索引
      listAir: 0, //控制航班查询有数据显示数据没有数据显示手工录入(1有数据)
      flightNumbering: '',
      flightNumsdbdsdering: true,
      visible: false,
      FlightstockView: props.FlightstockView ? props.FlightstockView : {details: []},
      baioshi: false,
      competencese: false,
      numbering: null,
      flight_type: null,
      returnData: [], //回显数据
      supplier: [], //供应商数据
    };
  }

  componentWillReceiveProps(nextProps) {
    let {flightdata} = this.state
    this.setState({
      flightstockAdd: nextProps.flightstockAdd ? nextProps.flightstockAdd : {},
      FlightstockView: nextProps.FlightstockView ? nextProps.FlightstockView : {details: []},
    });
  }

  componentDidMount() {
    let data = this.state.flightdata;
    data.competenceEdit = true
    data.competence = false
    data.selectedWeekGroup = ['', '']
    if (this.props.id) {
      data.competence = true
      data.competenceEdit = false
      this._searchPort(getdetailAirLine, {id: this.props.id}, 0)
    }
    this.setState({
      flightdata: data,
    });
  }

  _searchPort(url, value, ole) {
    let list = []
    let {flightdata} = this.state
    url(value).then((response) => {
      if (response.code == 200) {
        switch (ole) {
          case 0:
            list = response.data
            list[0].seat_type == 1 ? list[0].seat_type = "硬切" : list[0].seat_type = "代销"
            if (list[0].flight_type == 1) {
              this.addDate(1);
              list[0].flight_type = "单程"
            } else {
              this.addDate(2);
              list[0].flight_type = "往返"
            }
            // list[0].flight_type == 1 ? list[0].flight_type = "单程" : list[0].flight_type = "往返"
            switch (list[0].airline_type) {
              case 1:
                list[0].airline_type = '国际长线'
                break;
              case 2:
                list[0].airline_type = '国际短线'
                break;
              case 3:
                list[0].airline_type = '国内航线'
                break;
            }
            for (let i = 0; i < list.length; i++) {
              list[i].FlightNo = list[i].flight_no
              list[i].FlightDepAirport = list[i].city_dep_name
              list[i].FlightDepcode = list[i].airport_dep_code
              list[i].FlightDeptimePlanDate = moment(list[i].departure_start + list[i].time_dep).format("YYYY-MM-DD HH:mm:ss")
              list[i].FlightArrtimePlanDate = moment(list[i].departure_start + list[i].time_arr).format("YYYY-MM-DD HH:mm:ss")
              list[i].FlightArrAirport = list[i].city_arr_name
              list[i].FlightArrcode = list[i].airport_arr_name
              list[i].FlightCompany = list[i].flight_company
            }
            flightdata.flightTimeWill = [moment(list[0].departure_start), moment(list[0].departure_end)]
            if (list[0].trip_index == 0) {
              flightdata.selectedWeekGroup[0] = list[0].week_flights
              this.setState({
                flightstockData: [list[0], list[1]],
                linenubber: [0, 1]
              });
            } else {
              flightdata.selectedWeekGroup[0] = list[1].week_flights
              this.setState({
                flightstockData: [list[1], list[0]],
                linenubber: [1, 0]
              });
            }
            this.setState({
              returnData: list,
            });
            break;
          case 1:
            message.success(response.msg)
            this.props.history.push({
              pathname: '/supplier/supplierPolicy/flightstock',
            });
            return
            break;
          case 2:
            this.setState({
              supplier: response.data,
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
  reviewerLists() {
    let options = []
    const {flightstockAdd} = this.state;
    if (flightstockAdd && flightstockAdd.accurate.data && flightstockAdd.accurate.data.length > 0) {
      flightstockAdd.accurate.data.map((v, k) => {
        options.push(
          <Radio value={v} key={k} className={css.selectbBox}>
            <FlightstockShow accurate={v} routeSelection={this.routeSelection.bind(this)}/>
          </Radio>
        )
      })
      return options
    }
  }



  showcasing(ole) {
    let data = this.state.flightstockData;

    if (!this.props.id) {
      return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
        <div style={{width: '100%'}}>
          <FlightstockPlugin
            data={data[ole]}
            week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
            disabledadd={this.state.flightdata.competence}
            kyes={ole}
          />
        </div>
      </Col>
    } else {
      if (data[1]) {
        if (ole == data[ole].trip_index) {
          return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
            <div style={{width: '100%'}}>
              <FlightstockPlugin
                data={data[ole]}
                week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
                disabledadd={this.state.flightdata.competence}
                kyes={ole}
              />
            </div>
          </Col>
        } else {
          return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
            <div style={{width: '100%'}}>
              <FlightstockPlugin
                data={data[data[ole].trip_index]}
                week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
                disabledadd={this.state.flightdata.competence}
                kyes={ole}
              />
            </div>
          </Col>
        }
      } else {
        return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
          <div style={{width: '100%'}}>
            <FlightstockPlugin
              data={data[0]}
              week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[0])}
              disabledadd={this.state.flightdata.competence}
              kyes={0}
            />
          </div>
        </Col>
      }
    }
  }

  valHeadquarters(olr, e, event) {
    let _this = this
    let data = _this.state.flightdata;
    switch (olr) {
      case 1:
        data.days = e.target.value
        _this.setState({
          flightdata: data,
        });
        break;
      case 5:
        data.chupiaodays = parseFloat(e.target.value);
        _this.setState({
          flightdata: data,
        });
        break;
      case 7:
        this.props.history.push({
          pathname: '/supplier/supplierPolicy/flightstock',
        });
        break;
    }
  }

  addDate(ole, add) {
    let _this = this;
    const {form} = _this.props;
    switch (ole) {
      case 1:
        form.setFieldsValue({keys: [0]});
        break;
      case 2:
        form.setFieldsValue({keys: [0, 1]});
        break;
    }
  }

  auxiliary(e) {
    if (e.target.value == '单程') {
      this.addDate(1);
      this.setState({
        flight_type: 1,
      });
    } else {
      this.addDate(2);
      this.setState({
        flight_type: 2,
      });
    }
  }
  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const { FlightstockView, flight_type, returnData} = this.state
    const plainOptionsb = ['硬切', '代销'];
    const plainOptionsc = ['单程', '往返'];
    const plainOptionsd = ['国际长线', '国际短线', '国内航线'];
    const requiredText = "请填写此选项"
    if (FlightstockView && returnData.length > 0) {
      for (let i = 0; i < returnData.length; i++) {
        if (returnData[i].trip_index == i) {
          getFieldDecorator('names-' + returnData[i].trip_index, {initialValue: returnData[returnData[i].trip_index].flight_no});
        } else {
          getFieldDecorator('names-0', {initialValue: returnData[1].flight_no});
          getFieldDecorator('names-1', {initialValue: returnData[0].flight_no});
        }
      }
    }
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Col key={k} span={24}>
          <FormItem
            {...formItemLayout}
            style={{marginBottom: '10px'}}
            label={( k == 1) ? '添加返程航线' : '添加航线'}
          >
            {getFieldDecorator(`names-${k}`, {
              rules: [{
                required: true,
                message: requiredText,
              },
                {
                  max: 6,
                  message: "航班号最长六位"
                },

                {
                  pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                  message: "请填写正确航班号"
                }
              ],
            })(
              <Search
                placeholder="请填写航班号"
                style={{width: '450px'}}
                // disabled={this.state.flightdata.competence}
                disabled={this.state.flightdata.competence}
                enterButton
              />
            )}
            {this.state.linenubber.indexOf(k) != -1 && this.showcasing(k)}
          </FormItem>
        </Col>
      )
    });
    let rangeValue = returnData[0] ? [moment(returnData[0].departure_start), moment(returnData[0].departure_end)] : [];
    return (
      <div className={css.AgenciesView_box}>
        <Tabs type="card">
          <TabPane tab="航班政策信息" key="1">
            {this.props.id &&
            <div className={css.AgenciesView_box_column}>
              <p>机票资源编号：<span>{this.props.id}</span></p>
              <p style={{cursor: "pointer"}}>
                供应商名称：<span>{this.props.information.supplier_name ? this.props.information.supplier_name : ''}</span>
              </p>
              <p>航班号：<span>{this.props.information.flight_no}</span></p>
              <p>当前状态：<span>{this.props.information.airline_status == 0 ? "待上架" : "已上架"}</span></p>
            </div>
            }
            <Form layout={'horizontal'}>
              <div className={css.AgenciesView_box_list}>
                <Row>

                  <Col span={24}>
                    <FormItem
                      label="航班类型"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('flight_type', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: returnData.length > 0 ? returnData[0].flight_type : '',
                      })
                      (<RadioGroup options={plainOptionsc}
                                   onChange={this.auxiliary.bind(this)}
                                   disabled={true}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="航线类型"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('airline_type', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: returnData.length > 0 ? returnData[0].airline_type : '',
                      })
                      (<RadioGroup options={plainOptionsd}
                                   disabled={true}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="类别"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('seatType', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: returnData.length > 0 ? returnData[0].seat_type : '',
                      })
                      (<RadioGroup options={plainOptionsb}
                                   disabled={true}/>)}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem
                      label="航线负责人"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('manager', {
                        rules: [{required: true, message: requiredText,}, {max: 6, message: "最多6位"}],
                        initialValue: returnData.length > 0 ? returnData[0].manager : '',
                      })
                      (< Input placeholder="请填写航线负责人"
                               disabled={true}
                               style={{width: '450px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="航班周期"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('time', {
                        rules: [{required: true, message: requiredText,}],
                        initialValue: rangeValue
                      })
                      (<RangePicker style={{width: '450px'}}
                                    disabled={true}
                                    disabledDate={(current) => {
                                      return current && current < moment().endOf('day');
                                    }}/>)}
                    </FormItem>
                  </Col>
                  {flight_type == 2 ?
                    <Col span={24}>
                      <FormItem
                        label="出行天数"
                        {...formItemLayout}
                      >
                        {getFieldDecorator('days', {
                          rules: [{
                            required: true,
                            message: requiredText,
                          }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].days : '',
                        })
                        (< Input placeholder="请填写出行天数"
                                 disabled={true}
                                 onChange={this.valHeadquarters.bind(this, 1)}
                                 style={{width: '450px'}}
                        />)}
                      </FormItem>
                    </Col> : null
                  }

                  <Col span={24}>
                    {formItems}
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="每日仓位"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('seatCount', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                        initialValue: returnData.length > 0 ? returnData[0].seat_count : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>个</span>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="结算价（成人）"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('settlementPrice', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: returnData.length > 0 ? (returnData[0].settlement_price / 100).toString() : '',

                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem
                      label="结算价（儿童）"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('settlementPriceChild', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: returnData.length > 0 ? (returnData[0].settlement_price_child / 100).toString() : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="折扣"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('discount', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {
                          pattern: /^[1-9](\.\d{1})?$|^(10)(\.0)?$|^[0](\.[1-9]{1}){1}$/,
                          message: "最多输入一位小数，范围从0.1至10折"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: returnData.length > 0 ? returnData[0].discount : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24} style={{display: '-webkit-box', paddingLeft: "4%"}}>
                    <FormItem
                      {...formItemLayout}
                    >
                      <div style={{width: '225px'}}>
                        <span><span style={{color: "#e40505"}}>*</span>行李规则 免费托运:</span>
                        {getFieldDecorator('freeBag', {
                          rules: [{
                            required: true,
                            message: requiredText,
                          }, , {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].free_bag : '',

                        })
                        (< Input placeholder="请填写"
                                 disabled={true}
                                 style={{
                                   width: '70px',
                                   marginLeft: '10px',
                                   marginRight: '15px'
                                 }}/>)}
                      </div>
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                    >
                      <div style={{width: '300px'}}>
                        <span style={{marginLeft: '-10px'}}>件,每件重量上限</span>
                        {getFieldDecorator('weightLimit', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, , {pattern: /^[1-9]\d{0,5}$/, message: "请填写小于6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].weight_limit : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={true}
                                 style={{
                                   width: '70px',
                                   marginLeft: '10px',
                                   marginRight: '10px'
                                 }}/>)}
                        <span>kg</span>
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={24} style={{display: '-webkit-box', paddingLeft: "4%"}}>
                    <FormItem
                      // label="出票时间"
                      {...formItemLayout}
                    >
                      <div style={{width: '225px'}}>
                        <span><span style={{color: "#e40505"}}>*</span>出票时间 起飞前</span>
                        {getFieldDecorator('ticketDays', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[0-9]\d{0,5}$/, message: "请填写小于6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].ticket_days : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={true}
                                 onChange={this.valHeadquarters.bind(this, 5)}
                                 style={{
                                   width: '70px',
                                   marginLeft: '10px',
                                   marginRight: '10px'
                                 }}/>)}
                        <span>天</span>
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={24} style={{display: '-webkit-box', paddingLeft: "4%"}}>
                    <FormItem
                      // label="库存预警规则"
                      {...formItemLayout}
                    >
                      <div style={{width: '560px'}}>
                        <span><span style={{color: "#e40505"}}>*</span>清位时间 起飞前</span>
                        {getFieldDecorator('clearDays', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[0-9]\d{0,5}$/, message: "请填写小于6位的正整数"},
                          ],
                          initialValue: returnData.length > 0 ? returnData[0].clear_days : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={true}

                                 style={{
                                   width: '70px',
                                   marginLeft: '10px',
                                   marginRight: '10px'
                                 }}/>)}
                        <span>天(该天数必须大于出票天数)</span>
                      </div>
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <div style={{paddingLeft: '12%'}}>
                      <Button type="primary"  disabled={false} style={{height: "30px", marginRight: "10px"}}
                              onClick={this.valHeadquarters.bind(this, 7)}>返回</Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </TabPane>
          {this.props.id &&
          <TabPane tab="航班库存价格" key="2">
            <FlightstockCalendar
              disabledadd={this.state.competencese}
              listdata={this.props.information}
              airline_status={this.props.location.state.data.airline_status}
              // date={[moment(returnData[0].departure_start).format("YYYY-MM-DD"), moment(returnData[0].departure_end).format("YYYY-MM-DD")]}
              {...this.props}
            />
          </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}

module.exports = AddForm;
