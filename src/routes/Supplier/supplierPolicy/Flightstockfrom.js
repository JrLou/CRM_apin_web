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
      flightdata: {},
      flightstockData: [{}, {}],//用于储蓄已添加航线
      linenubber: [],//用于存储以添加航线的值的索引
      listAir: 0, //控制航班查询有数据显示数据没有数据显示手工录入(0:没有数据，1有数据)
      flightNumbering: '',
      flightNumsdbdsdering: true,
      flightstockAdd: props.flightstockAdd ? props.flightstockAdd : {},
      flightstockEdit: props.flightstockEdit ? props.flightstockEdit : {details: []}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flightstockAdd: nextProps.flightstockAdd ? nextProps.flightstockAdd : {},
      flightstockEdit: nextProps.flightstockEdit ? nextProps.flightstockEdit : {details: []}
    });
  }

  componentDidMount() {
    let data = this.state.flightdata;
    data.selectedWeekGroup = ['', '']
    // data.visible = false; //弹窗控制变量
    // data.listAir = false; //控制航班查询有数据显示数据，没有数据显示手工录入
    // data.entry = false; //控制点击手工录入，切换手工录入form
    // data.chupiaodays = 0; //用于判断余票回收天数必须大于出片天数的变量
    // data.selectedWeekGroup = []; //选中的航班计算后的数组集群
    // data.flightType = 0; //航班数组指针
    // data.competence = false; //全局控制disabled
    // data.competenceEdit = false; //编辑disabled
    // data.flightType = 2;
    // data.competence = false;
    // data.competenceEdit = false;
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
    let {flightstockAdd, flightstockData, linenubber, flightdata} = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.backAirLine = [flightstockData[1]]
        values.cityArr = flightstockData[0].FlightArr
        values.cityDep = flightstockData[0].FlightDep
        values.endDate = moment(flightdata.flightTimeWill[1]).format("YYYY-MM-DD")
        values.startDate = moment(flightdata.flightTimeWill[1]).format("YYYY-MM-DD")
        console.log(values)

        // if (!this.props.id) {
        //   for (let i = 0; i < datas.flightstockData.voyages.length; i++) {
        //     datas.flightstockData.voyages[i].data.tripIndex = datas.flightstockData.voyages[i].numbering;
        //     details.push(datas.flightstockData.voyages[i].data)
        //   }
        // }
        // for (let j = 0; j < details.length; j++) {
        //   if (datas.selectedWeekGroup[j].length > 0) {
        //     details[j].flights = Algorithm.toogleToWeekStr(datas.selectedWeekGroup[j])
        //   }
        // }
        // if (details.length < 2 && !this.props.post.id) {
        //   message.warning('请查询并选择出发航线或返程航线');
        //   return;
        // }
        // values.flightType = 2;
        // this.props.post.id ? datas.flightstockData.voyages[0].days = 0 : details[0].days = 0;
        // this.props.post.id ? datas.flightstockData.voyages[1].days = values.days - 1 : details[1].days = values.days - 1;
        // values.seatType == '硬切' ? values.seatType = 1 : values.seatType = 2;
        // values.departureStart = values.time[0].format("YYYY-MM-DD");
        // values.departureEnd = values.time[1].format("YYYY-MM-DD");
        // datas.remark ? values.canChange = datas.remark : values.canChange = '';
        // delete values.days;
        // delete values.time;
        // delete values.keys;
        // values = JSON.stringify(values);
        // this.props.id ? this.addPost(APILXF.api_edit, values, 0) : this.addPost(APILXF.api_add, values, 0);
      }
    });
  }

  onChange(value, selectedOptions) {  //日期选择器结果输出
    let data = this.state.flightdata;
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



  handleCancel(e) { //弹框关闭回调
    let data = this.state.flightdata;
    data.selected = null;
    data.entry = false;
    this.setState({
      flightdata: data,
      flightNumsdbdsdering: true,
    });
    this.props.addPost('flightstockAdd/clearAdds', {},);
    this.props.addPost('flightstockAdd/visiblebs', {
      visible: false,
    },);
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

  inquiries(ole, value, event) {  //查询航线详细信息
    let data = this.state.flightdata
    let {flightstockAdd, flightstockData, linenubber, flightdata} = this.state
    if (!value) {
      message.warning('请填写要查询的航班');
      return;
    }
    if (data.flightTimeWill) {
      flightstockData[ole] = {}
      flightdata.selectedWeekGroup[ole] = ''
      this.setState({
        flightstockData: flightstockData,
        flightdata: flightdata,
      });
      this.props.addPost('flightstockAdd/addAirLine', {
        endDate: moment(data.flightTimeWill[1]).format("YYYY-MM-DD"),
        fnum: value,
        startDate: moment(data.flightTimeWill[0]).format("YYYY-MM-DD"),
        numbering: ole,
      },);
    } else {
      message.warning('请先选择出发航班日期');
    }
  }

  reviewerLists() {
    let options = []
    const {flightstockAdd} = this.state;
    if (flightstockAdd && flightstockAdd.accurate.data && flightstockAdd.accurate.data.length > 0) {
      flightstockAdd.accurate.data.map((v, k) => {
        options.push(
          <Radio value={k} key={k} className={css.selectbBox}>
            <FlightstockShow accurate={v} routeSelection={this.routeSelection.bind(this)}/>
          </Radio>
        )
      })
      return options
    }
  }

  routeSelection(arr) { //查询航线结果选中
    let {flightstockAdd, flightstockData, linenubber, flightdata} = this.state
    flightstockData[flightstockAdd.numbering] = arr
    linenubber[flightstockAdd.numbering] = flightstockAdd.numbering
    flightdata.selected = flightstockAdd.accurate;
    flightdata.selectedWeekGroup[flightstockAdd.numbering] = flightstockAdd.accurate.option.mixedFlights
    this.setState({
      flightstockData: flightstockData,
      linenubber: linenubber,
      flightdata: flightdata,
    });
  }

  handleOk() { //弹窗确定操作回调
    let {flightstockAdd, flightdata, flightstockData} = this.state;
    console.log(flightstockAdd)
    console.log(flightdata.selectedWeekGroup)
    console.log(flightstockData)
    switch (flightstockAdd.ok) {
      case "选择航班":
        if (flightstockData[flightstockAdd.numbering] == {}) {
          debugger
          message.warning('请选择航班');
          return
        } else {
          flightdata.selected = null;
          this.setState({
            flightdata: flightdata
          });
          this.props.addPost('flightstockAdd/visiblebs', {
            visible: false,
          },);
        }
        break;
      case "手工录入":
        flightdata.entry = true;
        flightdata.visible = true;
        flightdata.flightNumsdbdsdering = false;
        flightdata.remarks = false;
        flightdata.ok = "录入";
        this.setState({
          flightNumsdbdsdering: false,
          flightNumbering: "手工录入航班"
        });
        break;
      case "录入":
        flightdata.remarks = false;
        flightdata.flightNumsdbdsdering = false;
        break;
    }
  }

  showcasing(ole) {
    let data = this.state.flightstockData[ole];
    return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
      <div style={{width: '100%'}}>
        <FlightstockPlugin
          data={data}
          week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
          weekSelect={this.weekSelect.bind(this)}
          disabledadd={this.state.flightdata.competence}
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
    const {flightstockData, flightstockAdd, flightstockEdit,} = this.state
    const plainOptionsb = ['硬切', '代销'];
    const requiredText = "请填写此选项"
    // if (flightstockData) {
    //   for (let i = 0; i < flightstockData.length; i++) {
    //     getFieldDecorator('names-' + i, {initialValue: flightstockData[i].FlightNo});
    //   }
    // }
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

                //   {
                //   max: 6,
                //   message: "航班号最长六位"
                // },
                //
                //   {
                //   pattern: /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/,
                //   message: "请输入正确航班号"
                // }
              ],
            })(
              <Search
                placeholder="请输入航班号"
                style={{width: '450px'}}
                // disabled={this.state.flightdata.competence}
                onSearch={this.inquiries.bind(this, k)}
                enterButton
              />
            )}
            {this.state.linenubber.indexOf(k) != -1 && this.showcasing(k)}
          </FormItem>
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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].supplier_name : '',

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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].manager : '',
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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].days : '',
                      })
                      (< Input placeholder="请输入出行天数"
                               onChange={this.valHeadquarters.bind(this, 0)}
                               disabled={this.state.flightdata.competence}
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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].settlement_price : '',

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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].sell_price : '',
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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].discount : '',
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
                          initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].free_bag : '',

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
                          initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].weight_limit : '',
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
                        {getFieldDecorator('ticketDays', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].ticket_days : '',
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
                        {getFieldDecorator('clearDays', {
                          rules: [{
                            required: true,
                            message: requiredText
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请输入小于6位的正整数"}],
                          initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].clear_days : '',
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
              date={['2018-09-19', '2018-09-19']}
            />
          </TabPane>
          }
        </Tabs>
        {flightstockAdd.visible &&
        < div className={css.shoudes}>
          <Modal
            className={css.popModal}
            title={this.state.flightNumbering}
            visible={flightstockAdd.visible}
            onCancel={this.handleCancel.bind(this)}
            footer={null}
          >
            {flightstockAdd.accurate && flightstockAdd.accurate.data &&
            <RadioGroup onChange={this.operating.bind(this, 0)} value={this.state.flightdata.selected}>
              {this.reviewerLists()}
            </RadioGroup>}
            {!flightstockAdd.accurate.data &&
            <h3 style={{textAlign: "center", marginBottom: '10px'}}>没有该航班信息</h3>}
            {this.state.flightdata.entry && <Manual open={this.mokecopen.bind(this)}/>}
            {this.state.flightNumsdbdsdering &&
            <Button style={{marginLeft: '41%'}} type="primary"
                    onClick={this.handleOk.bind(this)}>{flightstockAdd.ok}</Button>}

          </Modal>
        </div>
        }

      </div>
    )
  }
}

module.exports = AddForm;
