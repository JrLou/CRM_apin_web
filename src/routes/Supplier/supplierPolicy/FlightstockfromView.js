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
import FlightstockCalendar from './FlightstockCalendarView.js';

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
      flightstockView: props.flightstockView ? props.flightstockView : {details: []},
      baioshi: false,
      competencese: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    let {flightdata} = this.state

    this.setState({
      flightstockAdd: nextProps.flightstockAdd ? nextProps.flightstockAdd : {},
      flightstockView: nextProps.flightstockView ? nextProps.flightstockView : {details: []},
    });
    if (nextProps.flightstockView && nextProps.flightstockView.details.length > 0) {
      let list = nextProps.flightstockView.details;
      list[0].seat_type == 0 ? list[0].seat_type = "硬切" : list[0].seat_type = "代销"
      for (let i = 0; i < list.length; i++) {
        list[i].FlightNo = list[i].flight_no
        list[i].FlightDepAirport = list[i].city_arr_name
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
          linenubber: [0, 1]
        });
      }
      if (nextProps.flightstockView && nextProps.flightstockView.ajaxJudgment && this.state.baioshi) {
        this.props.away()
      }
      this.setState({
        flightdata: flightdata,
      });
    }
    if (nextProps.flightstockAdd && nextProps.flightstockAdd.judgment) {
      this.props.away()
    }
  }

  componentDidMount() {
    let data = this.state.flightdata;
    data.competenceEdit = true
    data.competence = false
    data.selectedWeekGroup = ['', '']
    if (this.props.id) {
      data.competence = true
      data.competenceEdit = false
    }
    this.setState({
      flightdata: data,
    });
    this.addDate(2);
  }

  showcasing(ole) {
    let data = this.state.flightstockData[ole];
    return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
      <div style={{width: '100%'}}>
        <FlightstockPlugin
          data={data}
          week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
          weekSelect={this.weekSelect.bind(this)}
          disabledadd={true}
          kyes={ole}
        />
      </div>
    </Col>
  }

  operating(ole, e, event) {
    let data = this.state.flightdata;
    switch (ole) {
      case 0:
        data.selected = e.target.value;
        break;
    }
    this.setState({
      flightdata: data,
    })
  }

  weekSelect(week, ole) {
    let data = this.state.flightdata;
    data.selectedWeekGroup[ole] = Algorithm.toogleToWeekStr(week);
    this.setState({
      flightdata: data,
    });
  }

  addDate(ole, add) {
    let _this = this;
    const {form} = _this.props;
    switch (ole) {
      case 2:
        form.setFieldsValue({keys: [0, 1]});
        break;
    }
  }

  render() {
    const {getFieldDecorator, getFieldProps, getFieldsValue, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const {flightstockView} = this.state
    const plainOptionsb = ['硬切', '代销'];
    const requiredText = "请填写此选项"
    if (flightstockView && flightstockView.details.length > 0) {
      for (let i = 0; i < flightstockView.details.length; i++) {
        getFieldDecorator('names-' + i, {initialValue: flightstockView.details[i].flight_no});
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
            {getFieldDecorator(`names-${k}`)(
              <Search
                placeholder="请输入航班号"
                style={{width: '450px'}}
                // disabled={this.state.flightdata.competence}
                disabled={true}
                enterButton
              />
            )}
            {this.state.linenubber.indexOf(k) != -1 && this.showcasing(k)}
          </FormItem>
        </Col>
      )
    });
    let rangeValue = flightstockView.details[0] ? [moment(flightstockView.details[0].departure_start), moment(flightstockView.details[0].departure_end)] : [];
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
                      label="类别"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('seatType', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].seat_type : '',
                      })
                      (<RadioGroup options={plainOptionsb}
                                   disabled={true}/>)}
                    </FormItem>
                  </Col>
                  {!this.props.id &&
                  <Col span={24}>
                    <FormItem
                      label="输入供应商"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('supplierName', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].supplier_name : '',

                      })
                      (
                        < Input placeholder="请填写供应商"
                                disabled={true}
                                style={{width: '450px', marginRight: '10px'}}/>
                      )}
                    </FormItem>
                  </Col>
                  }

                  <Col span={24}>
                    <FormItem
                      label="航线负责人"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('manager', {
                        rules: [{required: true, message: requiredText,}],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].manager : '',
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
                                      return current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
                                    }}/>)}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="出行天数"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('days', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].days : '',
                      })
                      (< Input placeholder="请输入出行天数"
                               disabled={true}
                               style={{width: '450px'}}
                      />)}
                    </FormItem>
                  </Col>
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
                        }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].seat_count : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>个</span>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="结算价"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('settlementPrice', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {
                          pattern: /^[1-9][0-9]*(\.[0-9][0-9])?$|^[1-9][0-9]*(\.[0-9])?$|^[0]\.([1-9])$|^[0]\.([0-9][1-9])$/,
                          message: "成人价需大于0，且最多两位小数"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockView.details.length > 0 ? (flightstockView.details[0].settlement_price / 100).toString() : '',

                      })
                      (< Input placeholder="请填写"
                               disabled={true}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem
                      label="销售价"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('sellPrice', {
                        rules: [{
                          required: true,
                          message: requiredText,
                        }, {
                          pattern: /^[1-9][0-9]*(\.[0-9][0-9])?$|^[1-9][0-9]*(\.[0-9])?$|^[0]\.([1-9])$|^[0]\.([0-9][1-9])$/,
                          message: "儿童价需大于0，且最多两位小数"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockView.details.length > 0 ? (flightstockView.details[0].sell_price / 100).toString() : '',
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
                          pattern: /^[1-9][0-9]*(\.[0-9][0-9])?$|^[1-9][0-9]*(\.[0-9])?$|^[0]\.([1-9])$|^[0]\.([0-9][1-9])$/,
                          message: "成人价需大于0，且最多两位小数"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].discount : '',
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
                          }, , {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].free_bag : '',

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
                          }, , {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].weight_limit : '',
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
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].ticket_days : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={true}
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
                      <div style={{width: '360px'}}>
                        <span><span style={{color: "#e40505"}}>*</span>清位时间 起飞前</span>
                        {getFieldDecorator('clearDays', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockView.details.length > 0 ? flightstockView.details[0].clear_days : '',
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
                      <Button type="primary"
                              disabled={true}
                              htmlType="submit"
                              size="large"
                              style={{height: "30px", marginRight: "10px"}}>保存</Button>
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
              // date={[moment(flightstockView.details[0].departure_start).format("YYYY-MM-DD"), moment(flightstockView.details[0].departure_end).format("YYYY-MM-DD")]}
            />
          </TabPane>
          }
        </Tabs>
      </div>
    )
  }
}

module.exports = AddForm;
