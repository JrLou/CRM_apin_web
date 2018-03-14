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
import {getdetailAirLine, geteditAirline, searchSupplier, stateAirLine} from '../../../services/api'

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
      flight_type: null,
      returnData: [], //回显数据
      supplier: [], //供应商数据
    };
  }

//组件将被卸载
  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  componentWillReceiveProps(nextProps) {
    let {flightdata} = this.state
    if (nextProps.flightstockEdit && nextProps.flightstockEdit.details.length > 0) {
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
    this.setState({
      flightstockAdd: nextProps.flightstockAdd ? nextProps.flightstockAdd : {},
      flightstockEdit: nextProps.flightstockEdit ? nextProps.flightstockEdit : {details: []},
    });

    if (nextProps.flightstockAdd && nextProps.flightstockAdd.judgment) {
      this.props.addPost('flightstockAdd/judgmentesdobj', {judgmentes: false},);
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
      this._searchPort(getdetailAirLine, {id: this.props.id}, 0)
    } else {
      this._searchPort(searchSupplier, {name: ''}, 2)
    }
    this.setState({
      flightdata: data,
    });
    console.log(this.props)
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
              this.setState({
                flight_type: 1,
              });
              list[0].flight_type = "单程"
            } else {
              this.addDate(2);
              this.setState({
                flight_type: 2,
              });
              list[0].flight_type = "往返";
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
            message.success('操作成功')
            this.props.history.push({
              pathname: '/supplier/supplierPolicy/flightstock',
            });
            break;
          case 2:
            this.setState({
              supplier: response.data,
            });
            break;
          case 3:
            this._searchPort(getdetailAirLine, {id: this.props.id}, 0)
            this.props.history.push({
              pathname: '/supplier/supplierPolicy/flightstock',
            });
            message.success('操作成功')
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

  handleSubmit(e, event) {  //提交时数据格式整理，数据校验
    let _this = this
    let {flightstockData, flightdata} = _this.state
    e.preventDefault();
    _this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!_this.props.id) {
          if (!flightstockData[1].FlightArr && values.flight_type == "往返") {
            message.warning('请查询并选择返程航线');
            return
          }
          if (!flightstockData[0].FlightArr) {
            message.warning('请查询并选择出发航线');
            return
          }
          if (values.clearDays != 0 && values.ticketDays != 0) {
            if (values.clearDays <= values.ticketDays) {
              message.warning('该天数必须大于出票时间');
              return
            }
          }
        }
        if (!_this.props.id) {
          for (let i = 0; i < flightstockData.length; i++) {
            flightstockData[i].FlightDeptimePlanDate = moment(flightstockData[i].FlightDeptimePlanDate, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss")
            flightstockData[i].FlightArrtimePlanDate = moment(flightstockData[i].FlightArrtimePlanDate, "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss")
          }
        }
        switch (values.airline_type) {
          case "国际长线":
            values.airline_type = 1
            break;
          case "国际短线":
            values.airline_type = 2
            break;
          case "国内航线":
            values.airline_type = 3
            break;
        }
        values.flight_type == "单程" ? values.flight_type = 1 : values.flight_type = 2
        if (values.flight_type == 1) {
          values.days = 0
        }
        values.settlementPrice = values.settlementPrice * 100
        values.settlementPriceChild = values.settlementPriceChild * 100
        values.backAirLine = this.state.flight_type == 2 ? JSON.stringify([flightstockData[1]]) : []
        values.goAirLine = JSON.stringify([flightstockData[0]])
        values.cityArr = flightstockData[0].FlightArrcode
        values.seatType == "硬切" ? values.seatType = 1 : values.seatType = 2
        values.cityDep = flightstockData[0].FlightDepcode
        values.supplierName = flightdata.supplierName;
        values.endDate = moment(flightdata.flightTimeWill[1]).format("YYYY-MM-DD")
        values.startDate = moment(flightdata.flightTimeWill[0]).format("YYYY-MM-DD")
        values.flightNumber = values.flight_type == 1 ? flightstockData[0].FlightNo : flightstockData[0].FlightNo + '-' + flightstockData[1].FlightNo
        values.weekFlights = flightdata.selectedWeekGroup[0]
        values.managerId = 0
        // console.log("整理后的", values)
        this.setState({
          baioshi: true,
        });
        if (_this.props.id) {
          values.id = _this.props.id
          this._searchPort(geteditAirline, values, 1)
        } else {
          _this.props.addPost('flightstockAdd/getaddtit', values);
        }
      }
    });
  }

  onChange(value, selectedOptions) {  //日期选择器结果输出
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
    let {flightstockAdd, flightstockData, linenubber, flightdata, flight_type} = this.state
    if (!data.competence) {
      if (!flightdata.days && flight_type == 2) {
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

      let reg = /^([a-zA-Z][0-9a-zA-Z]|[0-9a-zA-Z][a-zA-Z])([0-9]{1,4})$/;
      if (reg.test(value)) {
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
      } else {
        message.warning('请填写正确航班号');
        return;
      }
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
    e.target.value.FlightDeptimePlanDate = moment(e.target.value.FlightDeptimePlanDate)
    e.target.value.FlightArrtimePlanDate = moment(e.target.value.FlightArrtimePlanDate)
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
    flightstockAdd.visible = false;
    ole.FlightDeptimePlanDate = moment(flightdata.flightTimeWill[0].format('YYYY-MM-DD') + " " + ole.FlightDeptimePlanDate + ':00')
    ole.FlightArrtimePlanDate = moment(Algorithm._caculateNewDatePartSingle(flightdata.flightTimeWill[0].format('YYYY-MM-DD'), flightdata.days - 1) + " " + ole.FlightArrtimePlanDate + ':00')
    this.props.form.setFieldsValue({['names-' + numbering]: ole.FlightNo});
    flightstockData[numbering] = ole
    flightdata.selectedWeekGroup[numbering] = Algorithm.toogleToWeekStr(ole.flights)
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
      // data = data.map((v, k) => {
      //   v.FlightDeptimePlanDate = v.FlightDeptimePlanDate.split(' ')[1]
      //   v.FlightArrtimePlanDate = v.FlightArrtimePlanDate.split(' ')[1]
      // })
      // data[ole].FlightDeptimePlanDate = data[ole].FlightDeptimePlanDate.split(' ')[1]
      // data[ole].FlightArrtimePlanDate = data[ole].FlightArrtimePlanDate.split(' ')[1]
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
      if (data[1]) {
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
      } else {
        return <Col style={{width: '100%', marginTop: '10px'}} span={24}>
          <div style={{width: '100%'}}>
            <FlightstockPlugin
              data={data[0]}
              week={Algorithm.toogleToWeekArr(this.state.flightdata.selectedWeekGroup[0])}
              weekSelect={this.weekSelect.bind(this)}
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
        if (e.target.value != 0) {
          if (parseFloat(e.target.value) <= data.chupiaodays) {
            message.warning('该天数必须大于出票时间');
            return;
          }
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
        _this._searchPort(stateAirLine, {
          id: _this.props.id,
          airlineStatus: data == "上架" ? 1 : 4,
        }, 3)
        // _this.props.addPost('flightstockEdit/getstateAirLines', {
        //   id: _this.props.id,
        //   airlineStatus: data == "上架" ? 1 : 0,
        // },);
        _this.setState({
          baioshi: true,
        });
      },
      onCancel() {
      },
    });
  }

  validatores(rule, value, callback) {
    let data = this.state.flightdata;
    if (value <= data.chupiaodays) {
      callback('该天数必须大于出票时间')
    }
    callback()
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

  handleSvloe(value, option) { //供应商选择后的回调
    let data = this.state.flightdata;
    data.managerId = value.split(',')[0];
    data.supplierName = value.split(',')[1];
    if (value.split(',')[2] != 'null') {
      this.props.form.setFieldsValue({'manager': value.split(',')[2]})
    } else {
      this.props.form.setFieldsValue({'manager': ''})

    }
    this.setState({
      flightdata: data,
    });
  }

  handleSearch(value) {  //加载供应商选择数据
    this._searchPort(searchSupplier, {name: value}, 2)
  }

  reviewerListsadd() {
    let options = []
    let {supplier} = this.state
    if (supplier) {
      supplier.map((v, k) => {
        options.push(<Option style={{height: "32px"}} key={k}
                             value={v.id + "," + v.name + "," + v.charge}>{v.name}</Option>)
      })
    }
    return options
  }

  render() {
    const {getFieldDecorator, getFieldProps, getFieldsValue, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
    };
    const {flightstockData, flightstockAdd, flightstockEdit, visible, flight_type, returnData} = this.state
    const plainOptionsb = ['硬切', '代销'];
    const plainOptionsc = ['单程', '往返'];
    const plainOptionsd = ['国际长线', '国际短线', '国内航线'];
    const requiredText = "请填写此选项"
    const columns = [
      {
        title: '操作人',
        dataIndex: 'user_name',
        key: 'user_name',
        width: '20%',
      }, {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, data) => {
          return moment(data.create_time).format("YYYY-MM-DD HH:mm:ss");
        },
        width: '20%',
      }, {
        title: '操作内容',
        dataIndex: 'create_content',
        key: 'create_content',
      }];
    if (flightstockEdit && returnData.length > 0) {
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
                      label="航班类型"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('flight_type', {
                        rules: [{required: true, message: requiredText}],
                        initialValue: returnData.length > 0 ? returnData[0].flight_type : '',
                      })
                      (<RadioGroup options={plainOptionsc}
                                   onChange={this.auxiliary.bind(this)}
                                   disabled={this.state.flightdata.competence}/>)}
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
                                   disabled={(this.state.flightdata.competence)}/>)}
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
                                   disabled={(this.state.flightdata.competence)}/>)}
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
                        initialValue: returnData.length > 0 ? returnData[0].supplier_name : '',
                      })
                      (
                        <AutoComplete
                          style={{width: 450}}
                          onSearch={this.handleSearch.bind(this)}
                          disabled={(this.state.flightdata.competence)}
                          onSelect={this.handleSvloe.bind(this)}
                          placeholder="请选择供应商"
                        >
                          {this.reviewerListsadd()}
                        </AutoComplete>
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
                        initialValue: returnData.length > 0 ? returnData[0].manager : '',
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
                                 disabled={this.state.flightdata.competence}
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
                               disabled={this.state.flightdata.competence}
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
                               disabled={this.state.flightdata.competence}
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
                          required: false,
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
                          }, , {pattern: /^[1-9]\d{0,5}$/, message: "请填写最多6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].free_bag : '',

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
                          }, , {pattern: /^[1-9]\d{0,5}$/, message: "请填写小于6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].weight_limit : '',
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
                          }, {pattern: /^[0-9]\d{0,5}$/, message: "请填写小于6位的正整数"}],
                          initialValue: returnData.length > 0 ? returnData[0].ticket_days : '',
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
              airline_status={this.props.location.state.data.airline_status}
              valid_date={this.props.location.state.data.valid_date}
              // date={[moment(returnData[0].departure_start).format("YYYY-MM-DD"), moment(returnData[0].departure_end).format("YYYY-MM-DD")]}
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
            {!flightstockAdd.accurate.data && !this.state.flightdata.entry &&
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
            width={this.state.listAir == 1 ? '500px' : '1200px'}
          >
            {this.state.listAir == 1 && <TextArea placeholder="请填写" onChange={this.valHeadquarters.bind(this, 8)}/>}
            {this.state.listAir == 2 &&
            <Table pagination={false}
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
