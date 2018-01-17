/**
 *  李斯奇 on 16/10/25.
 *  （首页日历）.
 */
import React, {Component} from 'react';
import {Calendar, Button, Icon, Modal, Row, Col, Form, Input, Radio, message, Upload} from 'antd';
import moment from 'moment';
import Masking from './FlightMasking.js';
import css from './Flightstock.less';
import md5 from 'md5';
import {connect, Link} from 'dva';
import fetch from 'dva/fetch';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
import AllocationCalendar from './AllocationCalendar/MultipleSelectCalendar.js';

moment.locale('zh-cn');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(state => ({
  flightstockView: state.flightstockView,
}))
class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelect: moment('2017-1'),
      visible: false,
      rightType: 'modifyPrice',   //'modifyStock'   'modifyClearTime'
      currenMonthStocks: new Array(31).fill(0),
      canPick: [],
      selectedTips: [],
      datesArr: [],
      flightstockView: {},
      judgment: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flightstockView: nextProps.flightstockView ? nextProps.flightstockView : {}
    });
  }

  componentDidMount() {
    this.dateGet();
    // 库存
    const dateStart = moment(this.props.listdata.departure_start, "YYYY-MM-DD").format('YYYY/MM/DD');
    let [year, month, day] = [new Date(dateStart).getFullYear(), new Date(dateStart).getMonth(), new Date(dateStart).getDate()]
  }

  loadData(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }

  dateGet() {  //初始化获取要展示的日期
    let dates = moment(new Date()).format("YYYY-MM");
    let b = new Date().getTime();
    let a = moment(this.props.listdata.departure_start, "YYYY-MM").format('x');
    let c = moment(this.props.listdata.departure_end, "YYYY-MM").format('x');
    if (b > a && b < c) {
      this.loadData('flightstockView/getpriceAirline', {
        date: moment(this.props.listdata.departure_start).format('YYYY-MM'),
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(this.props.listdata.departure_start),
      })

    } else {
      this.loadData('flightstockView/getpriceAirline', {
        date: dates,
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(dates),
      })
    }
  }

  dateGetReturn() {
    this.loadData('flightstockView/getpriceAirline', {
      date: moment(this.state.dateSelect).format('YYYY-MM'),
      id: this.props.listdata.id,
    },);
  }

  getListData(value) {
    const {flightstockView: {airline}} = this.props;
    let listData;
    if (airline.length > 0) {
      for (let i = 0; i < airline.length; i++) {
        if (moment(airline[i].flight_date).format("YYYY-MM-DD") == value.format("YYYY-MM-DD")) {
          listData = {
            list: [
              {
                type: 'warning',
                content: '销售价',
                price: airline[i].sell_price
              },
              {
                type: 'error',
                content: '结算价',
                price: airline[i].settlement_price
              },
              {
                type: 'normal',
                content: '库存(已售/总):',
                price: airline[i].sale_count + '/' + airline[i].seat_count
              },
              {
                type: 'errorss',
                content: '清位时间',
                price: moment(airline[i].clear_date).format("YYYY-MM-DD")
              },
            ]
          };
        }
      }
    }
    return listData || {
      tishi: false, list: [
        {content: '暂无班期'},
      ], tishis: 0,
    };
  }

  addPost(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }

  // 封装批量修改
  modifyData(values, myValidate) {
    let {flightstockView, judgment} = this.state;
    let url = ''
    if (!this.state.datesArr || this.state.datesArr.length < 1) {
      message.warning('请选择批量修改的日期')
      return
    }
    if (myValidate) {
      if (!this.state.recycleDay) {
        this.setState({
          inputErr: true
        })
        return
      }
    }
    switch (judgment) {
      case 0:
        url = 'flightstockView/getmodifyPricees'
        break;
      case 1:
        url = 'flightstockView/getmodifyInventoryes'
        break;
      case 2:
        url = 'flightstockView/getgetmodifyDayses'
        break;
      default:
        break;
    }
    this.addPost("flightstockView/ajaxJu", {ajaxJudgment: false})
    this.addPost(url, Object.assign({
      dateString: this.state.datesArr.join(","),
      uuid: this.props.listdata.id
    }, values))
    this.pamdiam();
  }

  pamdiam() {
    let _this = this
    let {flightstockView} = _this.state
    if (flightstockView && flightstockView.ajaxJudgment) {
      message.success('操作成功')
      // 刷新日历
      _this.dateGetReturn();
      // 清空
      _this.setState({
        visible: false,
      })
      // 清空表单
      _this.form.resetFields()
    }
  }

  ObtainloadData() {
    this.loadData("/apinAirline/calendarInfo", {
      airlineId: this.props.post.id,
      endDate: moment(moment(this.state.dateSelect).format("YYYY-MM")).endOf('month').format("YYYY-MM-DD"),
      startDate: moment(this.state.dateSelect).format("YYYY-MM") + "-01",
    });
  }

  dateCellRender(value) {
    const listData = this.getListData(value);
    //初始化,记录,被选中
    const key = md5(value.toString());
    if (!this.maskingMap) {
      this.maskingMap = new Map();
    }
    return (
      <Masking
        in={(close) => {
          //告诉兄弟们,关闭吧
          for (let key2 of this.maskingMap.keys()) {
            if (key != key2) {
              let action = this.maskingMap.get(key2);
              if (action && typeof (action) == "function") {
                action();
              }
            }
          }
          this.maskingMap.clear();
          this.maskingMap.set(key, close)
        }}
        listData={listData}
        loadData={this.ObtainloadData.bind(this)}/>
    );
  }

  onSelect(value) {
    this.setState({
      dateSelect: value,
    });
    this.loadData('flightstockView/getpriceAirline', {
      date: moment(value).format('YYYY-MM'),
      id: this.props.listdata.id,
    },);
  }

  showPickInfo(pickInfo) {
    this.createSelectedText(pickInfo)
    this.setState({
      selectedStocks: pickInfo
    })
  }

  showImportModal(value) {
    this.setState({
      showImportModal: value
    })
  }


  render() {
    // 库存
    return (
      <div className={css.container}>
        <Calendar
          value={this.state.dateSelect}
          dateCellRender={this.dateCellRender.bind(this)}
          onSelect={this.onSelect.bind(this)} onPanelChange={this.onSelect.bind(this)}
        />
      </div>
    );
  }
}

module.exports = page;
export default page;


