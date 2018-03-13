/**
 *  李斯奇 on 16/10/25.
 *  （首页日历）.
 */
import React, {Component} from 'react';
import {Calendar} from 'antd';
import moment from 'moment';
import Masking from './FlightMasking.js';
import css from './Flightstock.less';
import md5 from 'md5';
import {connect, Link} from 'dva';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

@connect(state => ({
  flightstockView: state.flightstockView,
}))
class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSelect: moment('2017-1'),
      flightstockView: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      flightstockView: nextProps.flightstockView ? nextProps.flightstockView : {}
    });
  }
  componentDidMount() {
    this.dateGet();// 库存
  }
  loadData(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }
  dateGet() {  //初始化获取要展示的日期
    if (this.props.airline_status == 3) {
      this.loadData('flightstockView/getpriceAirline', {
        date: moment(this.props.listdata.departure_end).format('YYYY-MM'),
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(this.props.listdata.departure_end),
      })

    } else {
      this.loadData('flightstockView/getpriceAirline', {
        date: moment(this.props.listdata.departure_start).format('YYYY-MM'),
        id: this.props.listdata.id,
      },);
      this.setState({
        dateSelect: moment(this.props.listdata.departure_start),
      })
    }
  }

  getListData(value) {
    const {flightstockView: {airline}} = this.props;
    let listData = {};
    let list = [];
    let criticalPoint = null;
    // let s2 = new Date();
    if (airline.length > 0) {
      for (let i = 0; i < airline.length; i++) {
        // let s1 = airline[i].clear_date
        if (moment(airline[i].flight_date).format("YYYY-MM-DD") == value.format("YYYY-MM-DD")) {
          list = [
            {
              type: 'warning',
              content: '结算价:',
              price: parseInt(airline[i].settlement_price) / 100 + "元(成)" + "/" + parseInt(airline[i].settlement_price_child) / 100 + "元(儿)"

            },
            {
              type: 'errors',
              content: '销售价:',
              price: parseInt(airline[i].sell_price) / 100 + "元(成)" + "/" + parseInt(airline[i].sell_price_child) / 100 + "元(儿)"
            },
            {
              type: 'error',
              content: '销售价(团):',
              price: parseInt(airline[i].sell_price_group) / 100 + "元(成)" + "/" + parseInt(airline[i].sell_price_group_child) / 100 + "元(儿)"

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
        }
        criticalPoint = 2

        if (this.props.airline_status == 1 && (parseInt((( s1 - s2.getTime()) / (1000 * 60 * 60 * 24))) + 1) >= 0) {
          criticalPoint = 1
        }
        // if ((parseInt((( s1 - s2.getTime()) / (1000 * 60 * 60 * 24))) + 1) < 3) {
        //   criticalPoint = 3
        // }
      }
    }
    listData.list = list
    listData.criticalPoint = criticalPoint
    return list.length > 0 ? listData : {
      tishi: false,
      list: [{content: '暂无班期'}],
      criticalPoint: 5,
      tishis: 0
    }
  }

  addPost(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
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

