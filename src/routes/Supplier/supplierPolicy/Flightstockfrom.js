/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Form,
  Input,
  Button,
  Spin,
  message,
  Modal,
  Radio,
  Tabs,
  DatePicker,
  Row,
  Col,
  Icon,
  AutoComplete,
  InputNumber,
} from 'antd';
import {connect, Link} from 'dva';
import css from './Flightstock.less';
import moment from 'moment';
import FlightstockPlugin from './FlightstockPlugin.js';
import Algorithm from './FlightstockAlgorithm.js';
import Manual from './FlightstockManual.js';
import FlightstockCalendar from './FlightstockCalendar.js';
import FlightstockShow from './FlightstockShow.js';

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
      flightdata: {
        flightstockData: {
          line: {
            departureStart: '2017-11-01',
            departureStart: '2017-11-30',
          }
        },
        voyages: {
          managerId: null,
        }
      },
      flightNumbering: '',
      flightNumsdbdsdering: true,
    };
  }

  componentDidMount() {
    let data = this.state.flightdata;
    data.visible = false; //弹窗控制变量
    data.listAir = false; //控制航班查询有数据显示数据，没有数据显示手工录入
    data.entry = false; //控制点击手工录入，切换手工录入form
    data.chupiaodays = 0; //用于判断余票回收天数必须大于出片天数的变量
    data.flightstockData.voyages = []; //用于储蓄已添加航线
    data.flightstockData.linenubber = [];//用于存储以添加航线的值的索引
    data.selectedWeekGroup = []; //选中的航班计算后的数组集群
    data.flightType = 0; //航班数组指针
    data.competence = false; //全局控制disabled
    data.competenceEdit = false; //编辑disabled
    data.flightType = 2;
    data.competence = false;
    data.competenceEdit = false;
    this.setState({
      flightdata: data,
    });
    this.addDate(2);
  }

  // arrange(val) {
  //   let _this = this;
  //   let data = _this.state.flightdata;
  //   let keys = [];
  //   let selectedWeekGroup = [];
  //   val.line.adultPrice = val.line.adultPrice.toString();
  //   val.line.childPrice = val.line.childPrice.toString();
  //   if (val.line.depositAmount) {
  //     val.line.depositAmount = val.line.depositAmount.toString();
  //   }
  //   data.flightType = val.airline.flightType;
  //   val.line.seatType == 1 ? val.line.seatType = '硬切' : val.line.seatType = '代销';
  //   data.flightstockData = val;
  //   data.selectedWeek = Algorithm.getPeriodWeek(data.flightstockData.line.departureStart, data.flightstockData.line.departureEnd);   //计算出所选结果区间包含的所有星期数
  //   data.flightTime = Algorithm.dateRange(data.flightstockData.line.departureStart, data.flightstockData.line.departureEnd);
  //   data.flightTimeWill = [moment(data.flightstockData.line.departureStart), moment(data.flightstockData.line.departureEnd)];
  //   data.flightstockData.voyages.sort(function (a, b) {
  //     if (a.tripIndex < b.tripIndex) {
  //       return -1;
  //     } else if (a.tripIndex > b.tripIndex) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  //   for (let i = 0; i < data.flightstockData.voyages.length; i++) {
  //     keys.push(i);
  //   }
  //   data.flightstockData.airline.flightType == 2 ? data.days = data.flightstockData.voyages[1].days + 1 : data.days = 0;
  //   data.flightstockData.linenubber = keys;
  //   for (let i = 0; i < keys.length; i++) {
  //     _this.add();
  //     data.transshipment = i;
  //     selectedWeekGroup.push(this.weekCalculate(data.flightstockData.voyages[i].flights));
  //   }
  //   data.selectedWeekGroup = selectedWeekGroup;
  //   data.supplierName = val.line.supplierName;
  //   data.managerId = val.line.managerId;
  //   data.deposit = val.line.depositAmount == 0 ? false : true;
  //   val.line.depositAmount == 0 ? this.props.form.setFieldsValue({'sdda': '全款'}) : this.props.form.setFieldsValue({'sdda': '押金'});
  //   switch (data.flightstockData.airline.flightType) {
  //     case 1:
  //       data.flightstockData.airline.flightType = "单程";
  //       break;
  //     case 2:
  //       data.flightstockData.airline.flightType = "往返";
  //       break;
  //     case 3:
  //       data.flightstockData.airline.flightType = "多程";
  //       break;
  //   }
  //   _this.setState({
  //     flightdata: data,
  //   });
  // }

  handleSubmit(e, event) {  //提交时数据格式整理，数据校验
    let datas = this.state.flightdata;
    let details = [];
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.props.id) {
          for (let i = 0; i < datas.flightstockData.voyages.length; i++) {
            datas.flightstockData.voyages[i].data.tripIndex = datas.flightstockData.voyages[i].numbering;
            details.push(datas.flightstockData.voyages[i].data)
          }
        }
        for (let j = 0; j < details.length; j++) {
          if (datas.selectedWeekGroup[j].length > 0) {
            details[j].flights = Algorithm.toogleToWeekStr(datas.selectedWeekGroup[j])
          }
        }
        if (details.length < 2 && !this.props.post.id) {
          message.warning('请查询并选择出发航线或返程航线');
          return;
        }
        values.flightType = 2;
        this.props.post.id ? datas.flightstockData.voyages[0].days = 0 : details[0].days = 0;
        this.props.post.id ? datas.flightstockData.voyages[1].days = values.days - 1 : details[1].days = values.days - 1;
        values.seatType == '硬切' ? values.seatType = 1 : values.seatType = 2;
        values.departureStart = values.time[0].format("YYYY-MM-DD");
        values.departureEnd = values.time[1].format("YYYY-MM-DD");
        datas.remark ? values.canChange = datas.remark : values.canChange = '';
        delete values.days;
        delete values.time;
        delete values.keys;
        values = JSON.stringify(values);
        this.props.id ? this.addPost(APILXF.api_edit, values, 0) : this.addPost(APILXF.api_add, values, 0);
      }
    });
  }

  onChange(value, selectedOptions) {  //日期选择器结果输出
    let data = this.state.flightdata;
    console.log(value)
    console.log(selectedOptions)
    // let week = [];
    data.flightTimeWill = value;
    // if (data.flightstockData.voyages.length > 0) {
    //   for (let i = 0; i < data.flightstockData.voyages.length; i++) {
    //     for (let j = 0; j < data.selectedWeek.length; j++) {
    //       if (Algorithm.toogleToWeekArr(data.flightstockData.voyages[i].data.flights).indexOf(data.selectedWeek[j]) != -1) {
    //         week.push(data.selectedWeek[j]);
    //       }
    //     }
    //     data.selectedWeekGroup[i] = week;
    //     week = [];
    //   }
    // }
    this.setState({flightdata: data});
  }

  handleOk() { //弹窗确定操作回调
    let data = this.state.flightdata;
    switch (data.ok) {
      case "选择航班":
        data.visible = false;
        data.selected = null;
        data.flightNumsdbdsdering = false;
        data.remarks = false;
        break;
      case "手工录入":
        data.entry = true;
        data.visible = true;
        data.flightNumsdbdsdering = false;
        data.remarks = false;
        data.ok = "录入";
        this.setState({
          flightNumsdbdsdering: false,
          flightNumbering: "手工录入航班"
        });
        break;
      case "录入":
        data.visible = false;
        data.remarks = false;
        data.flightNumsdbdsdering = false;
        break;
    }
    this.setState({
      flightdata: data,
    });
  }

  handleCancel(e) { //弹框关闭回调
    let data = this.state.flightdata;
    data.visible = false;
    data.remarks = false;
    data.entry = false;
    data.ok = '选择航班';
    this.setState({
      flightdata: data,
      flightNumsdbdsdering: true,
    });
  }

  inquiries(ole, value, event) {  //查询航线详细信息
    let data = this.state.flightdata;
    // if (!value) {
    //   message.warning('请填写要查询的航班');
    //   return;
    // }
    // if (value.match(/^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/) == null) {
    //   message.warning('请输入正确的航班号');
    //   return;
    // }
    data.ok = "选择航班";
    this.setState({
      flightdata: data,
      flightNumbering: "航班号为:" + value + "的所有航班"
    });
    // if (data.flightTimeWill) {
    this.props.addPost('flightstockAdd/addAirLine', {
      endDate: '2018-01-15',
      fnum: 'CA111',
      startDate: '2018-01-12',
      numbering: ole,
    },);
    data.visible = true;
    this.setState({
      flightdata: data,
    });
    // } else {
    //   message.warning('请先选择出发航班日期');
    // }
  }

  reviewerLists() {
    let options = []
    const {accurate} = this.props
    console.log(accurate)
    if (accurate.data && accurate.data.length) {
      {/*<FlightstockShow accurate={accurate}  routeSelection={this.routeSelection.bind(this)}/>*/
      }
      accurate.data.map((v, k) => {
        options.push(
          <Radio value={k} className={css.selectbBox}>
            <div className={css.flightList} onClick={this.routeSelection.bind(this, v)}>
              <Row>
                <Col span={24}>
                  <Col span={21} className={css.selectbContent}>
                    <Col span={24}>
                      <Col span={24} style={{fontSize: '20px', color: "rgb(0, 0, 0)"}}>{v.FlightNo}</Col>
                    </Col>
                    <Col span={v.stopFlag ? 11 : 12}>
                      <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{v.FlightDep}</Col>
                      <Col span={24}>{v.FlightDepAirport}</Col>
                      <Col span={24}>{v.FlightDepcode}</Col>
                      <Col span={24}>{v.FlightDeptimePlanDate}</Col>
                    </Col>
                    {v.stopFlag &&
                    <Col span={2} style={{fontSize: '16px'}}>
                      经停
                    </Col>
                    }
                    <Col span={v.stopFlag ? 11 : 12}>
                      <Col style={{fontSize: '20px', color: "rgb(0, 0, 0)"}} span={24}>{v.FlightArr}</Col>
                      <Col span={24}>{v.FlightArrAirport}</Col>
                      <Col span={24}>{v.FlightArrcode}</Col>
                      <Col span={24}>{v.FlightArrtimePlanDate}</Col>
                    </Col>
                  </Col>
                </Col>
              </Row>
            </div>
          </Radio>
        )
      })
    }


    return options
  }

  obtainData(api, isput, ole) {
    let data = this.state.flightdata;
    // HttpTool.post(api,
    //   (code, msg, json, option) => {
    //     if (code == 200) {
    //       for (let i = 0; i < json.length; i++) {
    //         json[i].tripIndex = 0;
    //       }
    //       data.transshipment = ole;
    //       data.list = json;
    //       data.listAir = false;
    //     } else {
    //       data.listAir = true;
    //       data.ok = '手工录入';
    //     }
    //     data.visible = true;
    //     this.setState({
    //       flightdata: data,
    //     });
    //   },
    //   (code, msg, option) => {
    //     message.warning(msg);
    //   }
    //   , isput
    // )

  }

  transshipments(ole, data) { //把选中的航线信息存入数组并且
    let datalist = this.state.flightdata.flightstockData.voyages;
    let datalists = this.state.flightdata.flightstockData.linenubber;
    if (!datalist[ole] || datalist[ole] == undefined) {
      datalist.push({numbering: ole, data: data,});
      datalists.push(ole);
    } else {
      datalist[ole].data = data;
      datalist[ole].numbering = ole;
      datalists[ole] = ole;
    }
  }

  showcasing(ole) {
    let data = {};
    this.props.post.id ? data = this.state.flightdata.flightstockData.voyages[ole] : data = this.state.flightdata.flightstockData.voyages[ole].data;
    return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
      <div style={{width: '100%'}}>
        <FlightstockPlugin
          data={data}
          week={this.state.flightdata.selectedWeekGroup[ole]}
          weekSelect={this.weekSelect.bind(this)}
          disabledadd={this.state.flightdata.competence}
          Updates={this.Updates.bind(this)}
          kyes={ole}
        />
      </div>
    </Col>
  }

  Updates(add, data) {
    this.obtainData(APILXF.api_update, {
      beginDate: this.state.flightdata.flightTime[0],
      flightNo: data,
    }, add)
  }

  weekCalculate(arr) {
    let data = this.state.flightdata;
    let selectedWeek = [];
    let days = 0;
    let weekdays = [];
    let week = [];
    if (data.transshipment == 0) {
      week = data.selectedWeek;
    } else {
      days = data.days - 1;
      weekdays = Algorithm._caculateNewDatePart(data.flightTimeWill, days);
      week = Algorithm.getPeriodWeek(weekdays[0], weekdays[1]);
    }
    week.map((v, k) => {
      if (Algorithm.toogleToWeekArr(arr).indexOf(v) != -1) {
        selectedWeek.push(v);
      }
    });
    return selectedWeek
  }

  routeSelection(arr) { //查询航线结果选中
    let data = this.state.flightdata;
    if (this.weekCalculate(arr.flights)) {
      data.selectedWeekGroup[this.state.flightdata.transshipment] = this.weekCalculate(arr.flights);
      this.setState({
        flightdata: data,
      })
      if (data.flightType == 2) {
        this.props.form.setFieldsValue({keys: [0, 1]});
      }
      this.transshipments(this.state.flightdata.transshipment, arr);
    }
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


  valHeadquarters(olr, e, event) {
    let data = this.state.flightdata;
    switch (olr) {
      case 0:
        data.days = parseFloat(e.target.value);
        break
      case 5:
        data.chupiaodays = parseFloat(e.target.value);
        this.setState({
          flightdata: data,
        });
        break;
      case 6:
        if (parseFloat(e.target.value) <= data.chupiaodays) {
          message.warning('该天数必须大于出票时间');
          return;
        }
        break;
    }
  }

  weekSelect(week, ole) {
    let data = this.state.flightdata;
    data.selectedWeekGroup[ole] = week;
    this.setState({
      flightdata: data,
    });
  }

  mokecopen(ole) { //手动录入成功回调函数
    let data = this.state.flightdata;
    data.visible = false;
    this.setState({
      flightdata: data,
      flightNumsdbdsdering: true,
    });
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

  render() {
    const {getFieldDecorator, getFieldProps, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    let flightstockData = this.state.flightdata.flightstockData;
    const plainOptionsb = ['硬切', '代销'];
    const requiredText = "请填写此选项"
    const flightdata = this.state.flightdata;
    if (flightstockData.voyages) {
      for (let i = 0; i < flightstockData.voyages.length; i++) {
        getFieldDecorator('names-' + i, {initialValue: flightstockData.voyages[i].flightNo});
        getFieldDecorator('days-' + i, {initialValue: flightstockData.voyages[i].days});
      }
    }
    getFieldDecorator('keys', {initialValue: []});
    let {details} = this.props;
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Col key={k} span={24}>
          {this.state.flightdata.flightType == 3 && k > 0 &&
          <Col span={24}>
            <FormItem
              label="天数"
              {...formItemLayout}
            >
              {getFieldDecorator(`days-${k}`, {
                rules: [{
                  required: true,
                  message: requiredText,
                }, {pattern: /^\+?[1-9]\d*$/, message: "请输入大于0的正整数"}],
              })
              (< Input placeholder="请输入出行天数"
                       disabled={this.state.flightdata.competence}
                       style={{width: '450px'}}
              />)}
              {(keys.length > 1 && !this.props.post.id) ? (
                <Icon
                  className={css.deleting}
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </FormItem>
          </Col>
          }
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              style={{marginBottom: '10px'}}
              label={(flightdata.flightType == 2 && k == 1) ? '添加返程航线' : '添加航线'}
            >
              {getFieldDecorator(`names-${k}`, {
                rules: [{
                  required: true,
                  message: requiredText,
                }, {
                  max: 6,
                  message: "航班号最长六位"
                }, {
                  pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                  message: "请输入正确航班号"
                }],
              })(
                <Search
                  placeholder="请输入航班号"
                  style={{width: '450px'}}
                  // disabled={this.state.flightdata.competence}
                  onSearch={this.inquiries.bind(this, k)}
                  enterButton
                />
              )}
              {this.state.flightdata.flightstockData.linenubber.indexOf(k) != -1 && this.showcasing(k)}
            </FormItem>
          </Col>
        </Col>
      )
    });
    // let rangeValue = this.props.post.id ? [moment(flightstockData.line.departureStart, 'YYYY-MM-DD'), moment(flightstockData.line.departureEnd, 'YYYY-MM-DD')] : [];
    let rangeValue = [];
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
              <p>当前状态：<span>{this.props.information.airline_status = 0 ? "待上架" : "已上架"}</span></p>
            </div>
            }
            <Form layout={'horizontal'} onSubmit={this.handleSubmit.bind(this)}>
              <div className={css.AgenciesView_box_list}>
                <Row>

                  <Col span={24}>
                    <FormItem
                      label="类别"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('seatType', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: flightstockData.line ? flightstockData.line.seatType : '',

                      })
                      (<RadioGroup options={plainOptionsb}
                                   disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}/>)}
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem
                      label="输入供应商"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('supplierName', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: details.length > 0 ? details[0].supplier_name : '',

                      })
                      (
                        < Input placeholder="请填写供应商"
                                disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}
                                style={{width: '450px', marginRight: '10px'}}/>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="航线负责人"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('manager', {
                        rules: [{required: true, message: requiredText,}],
                        initialValue: details.length > 0 ? details[0].manager : '',
                      })
                      (< Input placeholder="请填写航线负责人"
                               disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}
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
                                    disabled={this.state.flightdata.competence}
                                    disabledDate={(current) => {
                                      return current.valueOf() < Date.now() - 24 * 60 * 60 * 1000
                                    }}
                                    onChange={this.onChange.bind(this)}/>)}
                    </FormItem>
                  </Col>
                  {
                    this.state.flightdata.flightType == 2 &&
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
                          initialValue: details.length > 0 ? details[0].days : '',
                        })
                        (< Input placeholder="请输入出行天数"
                                 onChange={this.valHeadquarters.bind(this, 0)}
                                 disabled={this.state.flightdata.competence}
                                 style={{width: '450px'}}
                        />)}
                      </FormItem>
                    </Col>
                  }
                  {this.state.flightdata.flightType != 0 &&
                  <Col span={24}>
                    {formItems}
                  </Col>
                  }
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
                        initialValue: flightstockData.line ? flightstockData.line.seatCount : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={this.state.flightdata.competence}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>个</span>
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem
                      label="结算价"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('adultPrice', {
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
                        initialValue: details.length > 0 ? details[0].settlement_price : '',

                      })
                      (< Input placeholder="请填写"
                               disabled={this.state.flightdata.competence}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
                    </FormItem>
                  </Col>

                  <Col span={24}>
                    <FormItem
                      label="销售价"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('childPrice', {
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
                        initialValue: details.length > 0 ? details[0].sell_price : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={this.state.flightdata.competence}
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
                        initialValue: details.length > 0 ? details[0].discount : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={this.state.flightdata.competence}
                               style={{width: '260px', marginRight: '10px'}}/>)}
                      <span>元/人</span>
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
                          initialValue: details.length > 0 ? details[0].free_bag : '',

                        })
                        (< Input placeholder="请填写"
                                 disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}
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
                          initialValue: details.length > 0 ? details[0].weight_limit : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}
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
                        {getFieldDecorator('ticket_days', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: details.length > 0 ? details[0].ticket_days : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={this.state.flightdata.competence}
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
                      <div style={{width: '360px'}}>
                        <span><span style={{color: "#e40505"}}>*</span>清位时间 起飞前</span>
                        {getFieldDecorator('clear_days', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: details.length > 0 ? details[0].clear_days : '',
                        })
                        (< Input placeholder="请填写"
                                 disabled={this.state.flightdata.competence}
                                 onChange={this.valHeadquarters.bind(this, 6)}
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
                              disabled={false}
                              htmlType="submit"
                              size="large"
                              style={{height: "30px", marginRight: "10px"}}>保存</Button>

                      <Button onClick={this.props.retures}>取消</Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </TabPane>
          {this.props.id &&
          <TabPane tab="航班库存价格" key="2">
            <FlightstockCalendar
              disabledadd={this.state.flightdata.competence}
              listdata={this.props.information}
              date={[this.state.flightdata.voyages.departureStart, this.state.flightdata.voyages.departureEnd]}
            />
          </TabPane>
          }
        </Tabs>
        <div className={css.shoudes}>
          <Modal
            className={css.popModal}
            title={this.state.flightNumbering}
            visible={this.state.flightdata.visible}
            onCancel={this.handleCancel.bind(this)}
            footer={null}
          >
            {!this.state.flightdata.listAir && !this.state.flightdata.entry &&
            <RadioGroup onChange={this.operating.bind(this, 0)} value={this.state.flightdata.selected}>
              {this.reviewerLists()}
            </RadioGroup>}
            {this.state.flightdata.listAir && !this.state.flightdata.entry &&
            <h3 style={{textAlign: "center", marginBottom: '10px'}}>没有该航班信息</h3>}
            {this.state.flightdata.entry && <Manual open={this.mokecopen.bind(this)}/>}
            {this.state.flightNumsdbdsdering &&
            <Button style={{marginLeft: '41%'}} type="primary"
                    onClick={this.handleOk.bind(this)}>{this.state.flightdata.ok}</Button>}

          </Modal>
        </div>
      </div>
    )
  }
}

module.exports = AddForm;
