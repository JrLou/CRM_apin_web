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
import FlightstockCalendar from './FlightstockCalendar.js';
import FlightstockShow from './FlightstockShow.js';

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
      flightstockAdd: props.flightstockAdd ? props.flightstockAdd : {},
      flightstockEdit: props.flightstockEdit ? props.flightstockEdit : {details: []},
      baioshi: false,
      competencese: false,
      numbering: null,
      code: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    let {flightdata} = this.state
    this.setState({
      flightstockAdd: nextProps.flightstockAdd ? nextProps.flightstockAdd : {},
      flightstockEdit: nextProps.flightstockEdit ? nextProps.flightstockEdit : {details: []},
    });

    if (nextProps.flightstockEdit && nextProps.flightstockEdit.details.length == 2) {
      let list = nextProps.flightstockEdit.details;
      list[0].seat_type == 0 ? list[0].seat_type = "硬切" : list[0].seat_type = "代销"
      list[0].FlightNo = list[0].flight_no
      list[0].FlightDepAirport = list[0].city_dep_name
      list[0].FlightDepcode = list[0].airport_dep_name
      // list[0].FlightDeptimePlanDate =moment(parseInt(list[0].departure_start) + parseInt(list[0].time_dep)).format("HH:mm")
      // list[0].FlightDeptimePlanDate =moment(new Date(1516411800000),'x').format("HH:mm")
      // list[0].FlightDeptimePlanDate = new Date(parseInt(list[0].departure_start) + parseInt(list[0].time_dep)).getMinutes()
      list[0].FlightDeptimePlanDate = moment(list[0].time_dep).format("HH:mm")
      list[0].FlightArrtimePlanDate = moment(list[0].time_arr).format("HH:mm")
      list[0].FlightArrAirport = list[0].city_arr_name
      list[0].FlightArrcode = list[0].airport_arr_name
      list[0].FlightCompany = list[0].flight_company
      list[1].FlightCompany = list[1].flight_company
      list[1].FlightNo = list[1].flight_no
      list[1].FlightDepAirport = list[1].city_dep_name
      list[1].FlightDepcode = list[1].airport_dep_name
      list[1].FlightDeptimePlanDate = moment(list[1].time_dep).format("HH:mm")
      list[1].FlightArrtimePlanDate = moment(list[1].time_arr).format("HH:mm")
      list[1].FlightArrAirport = list[1].city_arr_name
      list[1].FlightArrcode = list[1].airport_arr_name
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
      if (nextProps.flightstockEdit && nextProps.flightstockEdit.ajaxJudgment && this.state.baioshi) {
        this.props.away()
      }
      if (nextProps.flightstockEdit && nextProps.flightstockEdit.ajaxJudgment) {
        this.props.addPost('flightstockEdit/ajaxJu', {ajaxJudgment: false},);
        flightdata.content = ''
        this.setState({
          visible: false,
        });
      }
      this.setState({
        flightdata: flightdata,
      });
    }
    if (nextProps.flightstockAdd && nextProps.flightstockAdd.judgment) {
      this.props.addPost('flightstockAdd/judgmentesdobj', {judgmentes: false},);
      this.props.away()
    }
    if (nextProps.flightstockAdd && nextProps.flightstockAdd.code.length > 0 && nextProps.flightstockAdd.code[0].data.length > 0) {
      this.setState({
        flightstockAdd: nextProps.flightstockAdd,
      })
      setTimeout(() => {
        this.judgmentMokecopen()
      }, 100)
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

  handleSubmit(e, event) {  //提交时数据格式整理，数据校验
    let _this = this
    let {flightstockData, flightdata} = _this.state
    e.preventDefault();
    _this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!_this.props.id) {
          if (!flightstockData[1].FlightArr) {
            message.warning('请查询并选择返程航线');
            return
          }
          if (!flightstockData[0].FlightArr) {
            message.warning('请查询并选择出发航线');
            return
          }
        }
        values.settlementPrice = values.settlementPrice * 100
        values.sellPrice = values.sellPrice * 100
        values.backAirLine = JSON.stringify([flightstockData[1]])
        values.goAirLine = JSON.stringify([flightstockData[0]])
        values.cityArr = flightstockData[0].FlightArr
        values.seatType == "硬切" ? values.seatType = 0 : values.seatType = 1
        values.cityDep = flightstockData[0].FlightDep
        values.endDate = moment(flightdata.flightTimeWill[1]).format("YYYY-MM-DD")
        values.startDate = moment(flightdata.flightTimeWill[0]).format("YYYY-MM-DD")
        values.flightNumber = flightstockData[0].FlightNo + '-' + flightstockData[1].FlightNo
        values.weekFlights = flightdata.selectedWeekGroup[0]
        values.managerId = 0
        this.setState({
          baioshi: true,
        });
        if (_this.props.id) {
          values.id = _this.props.id
          _this.props.addPost('flightstockEdit/geteditAirlines', values);
        } else {
          _this.props.addPost('flightstockAdd/getaddtit', values);
        }
      }
    });
  }

  onChange(value, selectedOptions) {  //日期选择器结果输出
    console.log(value)
    let data = this.state.flightdata;
    data.flightTimeWill = value;
    this.setState({flightdata: data});
  }


  handleCancel(e) { //弹框关闭回调

    let data = this.state.flightdata;
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

  handleCancels() {
    this.props.addPost('flightstockAdd/ajaxJu', {ajaxJudgment: false},);
    this.setState({
      visible: false,
    });
  }

  inquiries(ole, value, event) {  //查询航线详细信息
    let data = this.state.flightdata
    let {flightstockAdd, flightstockData, linenubber, flightdata} = this.state
    if (!data.competence) {
      if (!flightdata.days) {
        message.warning('请先填写出行天数');
        return;
      }
      if (!value) {
        message.warning('请填写要查询的航班');
        return;
      }
      if (!data.flightTimeWill) {
        message.warning('请先选择出发航班日期');
        return;
      }
      this.props.addPost('flightstockAdd/getsearchAirportesaddes', {},);
      flightstockData[ole] = {}
      linenubber[ole] = null
      flightdata.selectedWeekGroup[ole] = ''
      this.setState({
        flightstockData: flightstockData,
        flightNumbering: '航班号为：' + value + '的所有的航班',
        flightdata: flightdata,
        numbering: ole
      });
      this.props.addPost('flightstockAdd/addAirLine', {
        endDate: moment(data.flightTimeWill[1]).format("YYYY-MM-DD"),
        fnum: value,
        startDate: moment(data.flightTimeWill[0]).format("YYYY-MM-DD"),
        numbering: ole,
      },);

    }
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

  routeSelection(e) { //查询航线结果选中
    let {flightstockAdd, flightstockData, linenubber, flightdata} = this.state
    flightstockData[flightstockAdd.numbering] = e.target.value
    linenubber[flightstockAdd.numbering] = flightstockAdd.numbering
    flightdata.selectedWeekGroup[flightstockAdd.numbering] = flightstockAdd.accurate.option.mixedFlights
    this.setState({
      flightstockData: flightstockData,
      linenubber: linenubber,
      flightdata: flightdata,
    });
  }

  mokecopen(ole) { //手动录入成功回调函数
    let {linenubber, flightdata, flightstockData, flightstockAdd, numbering} = this.state
    this.props.addPost('flightstockAdd/getsearchAirportes', {code: [ole.FlightDepcode, ole.FlightArrcode]});
    this.setState({
      code: ole,
    });
  }

  judgmentMokecopen() {
    let {linenubber, flightdata, flightstockData, flightstockAdd, numbering, code} = this.state
    flightstockAdd.visible = false;
    code.FlightDepAirport = flightstockAdd.code[0].data[0].airport_name
    code.FlightArrAirport = flightstockAdd.code[1].data[0].airport_name
    code.FlightDeptimePlanDate = flightdata.flightTimeWill[0].format('YYYY-MM-DD') + " " + code.FlightDeptimePlanDate + ':00'
    code.FlightArrtimePlanDate = Algorithm._caculateNewDatePartSingle(flightdata.flightTimeWill[0].format('YYYY-MM-DD'), flightdata.days - 1) + " " + code.FlightArrtimePlanDate + ':00'
    flightstockData[numbering] = code
    flightdata.selectedWeekGroup[numbering] = Algorithm.toogleToWeekStr(code.flights)
    linenubber[numbering] = numbering
    flightdata.entry = false
    this.setState({
      flightstockAdd,
      linenubber,
      flightdata,
      flightstockData,
      flightdata: flightdata,
      flightNumsdbdsdering: true
    });
    this.props.addPost('flightstockAdd/getsearchAirportesaddes', {},);
  }

  handleOk() { //弹窗确定操作回调
    let {flightstockAdd, flightdata, flightstockData} = this.state;
    switch (flightstockAdd.ok) {
      case "选择航班":
        if (!flightstockData[flightstockAdd.numbering].FlightNo) {
          message.warning('请选择航班');
          return
        } else {
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
        flightdata.flightNumsdbdsdering = false;
        flightdata.ok = "录入";
        this.setState({
          flightNumsdbdsdering: false,
          flightNumbering: "手工录入航班"
        });
        break;
      case "录入":
        flightdata.flightNumsdbdsdering = false;
        break;
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
            weekSelect={this.weekSelect.bind(this)}
            disabledadd={this.state.flightdata.competence}
            kyes={ole}
          />
        </div>
      </Col>
    } else {
      if (ole == data[ole].trip_index) {
        return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
          <div style={{width: '100%'}}>
            <FlightstockPlugin
              data={data[ole]}
              week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[ole])}
              weekSelect={this.weekSelect.bind(this)}
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
              weekSelect={this.weekSelect.bind(this)}
              disabledadd={this.state.flightdata.competence}
              kyes={ole}
            />
          </div>
        </Col>

      }

    }
  }

  valHeadquarters(olr, e, event) {
    let _this = this
    let data = _this.state.flightdata;
    let {flightstockAdd} = _this.state;
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
      case 6:
        if (parseFloat(e.target.value) <= data.chupiaodays) {
          message.warning('该天数必须大于出票时间');
          return;
        }
        break;
      case 7:
        _this.setState({
          listAir: 1,
          visible: true,
        });
        break;
      case 8:
        data.content = e.target.value
        _this.setState({
          flightdata: data,
        })
        break;
      case 9:
        this.props.addPost('flightstockEdit/loglist', {
          p: 1,
          pc: 10000,
          uuid: this.props.id,
        },);
        _this.setState({
          listAir: 2,
          visible: true,
        });
        break;
      case 10:
        if (!this.state.flightdata.content) {
          _this.setState({
            visible: false,
          });
          return;
        }
        _this.props.addPost('flightstockEdit/LogAirLine', {
          content: this.state.flightdata.content,
          id: this.props.id,
        },);
        break;
    }
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
      case 1:
        form.setFieldsValue({keys: [0]});
        break;
      case 2:
        form.setFieldsValue({keys: [0, 1]});
        break;
    }
  }

  shelves() {
    let _this = this
    let data = _this.props.information.airline_status
    data == 0 ? data = "上架" : data = "下架"
    confirm({
      title: '您确定要' + data + '吗？',
      onOk() {
        _this.props.addPost('flightstockEdit/getstateAirLines', {
          id: _this.props.id,
          airlineStatus: data == "上架" ? 1 : 0,
        },);
        _this.setState({
          baioshi: true,
        });
      },
      onCancel() {
      },
    });
  }

  render() {
    const {getFieldDecorator, getFieldProps, getFieldsValue, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const {flightstockData, flightstockAdd, flightstockEdit, visible} = this.state
    const plainOptionsb = ['硬切', '代销'];
    const requiredText = "请填写此选项"
    const columns = [
      {
        title: '操作人',
        dataIndex: 'user_name',
        key: 'user_name',
      }, {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, data) => {
          return moment(data.create_time).format("YYYY-MM-DD HH:mm:ss");
        }
      }, {
        title: '操作内容',
        dataIndex: 'create_content',
        key: 'create_content',
      }];
    if (flightstockEdit && flightstockEdit.details.length > 0) {
      for (let i = 0; i < flightstockEdit.details.length; i++) {
        getFieldDecorator('names-' + flightstockEdit.details[i].trip_index, {initialValue: flightstockEdit.details[i].flight_no});
      }
      console.log(getFieldsValue())
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
                onSearch={this.inquiries.bind(this, k)}
                disabled={this.state.flightdata.competence}
                enterButton
              />
            )}
            {this.state.linenubber.indexOf(k) != -1 && this.showcasing(k)}
          </FormItem>
        </Col>
      )
    });
    let rangeValue = flightstockEdit.details[0] ? [moment(flightstockEdit.details[0].departure_start), moment(flightstockEdit.details[0].departure_end)] : [];
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
              <Button style={{float: 'right', position: "relative", top: '30px', marginRight: "20px", zIndex: "10"}}
                      onClick={this.shelves.bind(this)}
                      type="primary">{this.props.information.airline_status == 0 ? "上架" : "下架"}</Button>
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
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].seat_type : '',
                      })
                      (<RadioGroup options={plainOptionsb}
                                   disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}/>)}
                    </FormItem>
                  </Col>
                  {!this.props.id &&
                  <Col span={24}>
                    <FormItem
                      label="填写供应商"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('supplierName', {
                        rules: [{required: true, message: requiredText}, {max: 32, message: "最多32位"}],
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].supplier_name : '',
                      })
                      (
                        < Input placeholder="请填写供应商"
                                disabled={(this.state.flightdata.competence)}
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
                        rules: [{required: true, message: requiredText,}, {max: 6, message: "最多6位"}],
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
                                      return current && current < moment().endOf('day');
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
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].days : '',
                      })
                      (< Input placeholder="请填写出行天数"
                               disabled={this.state.flightdata.competence}
                               onChange={this.valHeadquarters.bind(this, 1)}
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
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].seat_count : '',
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
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockEdit.details.length > 0 ? (flightstockEdit.details[0].settlement_price / 100).toString() : '',

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
                        }, {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockEdit.details.length > 0 ? (flightstockEdit.details[0].sell_price / 100).toString() : '',
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
                          pattern: /^[1-9](\.\d{1})?$|^(10)(\.0)?$|^[0](\.[1-9]{1}){1}$/,
                          message: "折扣需大于0，且最多一位小数"
                        }, {
                          max: 6,
                          message: "最多6位"
                        }],
                        initialValue: flightstockEdit.details.length > 0 ? flightstockEdit.details[0].discount : '',
                      })
                      (< Input placeholder="请填写"
                               disabled={(this.state.flightdata.competence && this.state.flightdata.competenceEdit)}

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
                          }, , {pattern: /^[1-9]\d{0,4}$/, message: "请填写最多6位的正整数"}],
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
                          }, , {pattern: /^[1-9]\d{0,4}$/, message: "请填写小于6位的正整数"}],
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
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请填写小于6位的正整数"}],
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
                          }, {pattern: /^[1-9]\d{0,4}$/, message: "请填写小于6位的正整数"}],
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
                      {this.props.id && !this.state.competencese &&
                      <Button type="primary" style={{height: "30px", marginRight: "10px"}}
                              onClick={this.valHeadquarters.bind(this, 7)}>备注</Button>}
                      {this.props.id && !this.state.competencese &&
                      < Button type="primary" style={{height: "30px", marginRight: "10px"}}
                               onClick={this.valHeadquarters.bind(this, 9)}>日志</Button>
                      }

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
              // date={[moment(flightstockEdit.details[0].departure_start).format("YYYY-MM-DD"), moment(flightstockEdit.details[0].departure_end).format("YYYY-MM-DD")]}
              {...this.props}
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
            <RadioGroup onChange={this.routeSelection.bind(this)}>
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
        {visible &&
        < div className={css.shoudes}>
          <Modal
            className={css.popModal}
            title={this.state.listAir == 1 ? "添加备注" : "日志"}
            visible={visible}
            onCancel={this.handleCancels.bind(this)}
            footer={null}
          >
            {this.state.listAir == 1 && <TextArea placeholder="请填写" onChange={this.valHeadquarters.bind(this, 8)}/>}
            {this.state.listAir == 2 &&
            <Table style={{width: '900px'}} pagination={false}
                   dataSource={flightstockEdit.logs.data ? flightstockEdit.logs.data : []}
                   columns={columns}/>}
            {this.state.listAir == 1 &&
            <Button style={{marginLeft: '41%', marginTop: "20px"}} type="primary"
                    onClick={this.valHeadquarters.bind(this, 10)}>提交</Button>
            }

          </Modal>
        </div>
        }
      </div>
    )
  }
}

module.exports = AddForm;
