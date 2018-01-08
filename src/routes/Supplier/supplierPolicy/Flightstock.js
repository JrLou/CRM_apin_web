/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import css from './Flightstock.less';
import {connect, Link} from 'dva';
// import {routerRedux} from 'dva/router';
import {
  message,
  Table,
  Modal,
  Divider,
} from 'antd';
import moment from 'moment';

const confirm = Modal.confirm;
const {Column,} = Table;
// import HttpTool from '../../../http/HttpTool.js';
// import APILXF from '../../../http/APILXF.js';
import Filter from '../../../components/screening/Filter.js';

@connect(state => ({
  flightstock: state.flightstock,
}))
class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        airlineStatus: 1,
      },
      data: {},
      tableDataSource: [],
    }
  }

  componentDidMount() {
    //加载第一页
    const data = this.state.data;
    const val = this.state.filter;
    val.airlineStatus = 1
    data.visible = false;
    const {dispatch} = this.props;
    dispatch({
      type: 'flightstock/fetch',
    });
  }

  companyname(ole, e, event) { //全局函数（根据ole作为标识可以快速查找各功能实现位置）
    switch (ole) {
      case 0: //新增政策跳转新增页面
              // this.props.dispatch({
              //   type: 'supplier/supplierPolicy/flightstockAdd',
              // });
        this.props.history.push('flightstockAdd');
        break;
      case 1: //弹窗确认按钮所调函数
        let datas = this.state.data;
        datas.visible = false;
        this.setState({data: datas})

    }
  }

  dataProcess(ole) {
    ole.departureDateStart = (ole.departureTime && ole.departureTime.length > 0) ? moment(ole.departureTime[0]).format("YYYY-MM-DD") : undefined;
    ole.departureDateEnd = (ole.departureTime && ole.departureTime.length > 0) ? moment(ole.departureTime[1]).format("YYYY-MM-DD") : undefined;
    ole.departureTime = undefined;
    ole.page = 1;
    ole.size = this.state.pc;
    let dates = {};
    for (let i in ole) {
      if (ole[i] != undefined && i != 'flightDate' && ole[i] != '') {
        dates[i] = ole[i];
      }
    }
    this.setState({
      filter: dates,
      p: 1,
    });
    this.loadData(0, APILXF.api_airlines, dates);
  }

  render() {
    const formData = {
      added: '新增政策',
      list: [
        {name: '出发城市', id: 'departureCity', required: false, category: 0,},
        {name: '到达城市', id: 'arriveCity', required: false, category: 0,},
        {name: '去程航班号', id: 'departureFlightNo', required: false, category: 0,},
        {name: '返程航班号', id: 'returnFlightNo', required: false, category: 0,},
        {name: '机票资源号', id: 'airlineNo', required: false, category: 0,},
        {
          name: '往返天数',
          id: 'days',
          required: false,
          category: 0,
          check: [{pattern: /^[0-9]*$/, message: "只能输入数字"}]
        },
        {name: '资源负责人', id: 'charger', required: false, category: 0,},
        {
          name: '请选择有效性',
          id: 'airlineStatus',
          required: false,
          category: 1,
          disabled: 2,
          options: [{name: '全部', id: ''}, {name: '待上架', id: '0'}, {name: '上架', id: '1',}, {
            name: '过期',
            id: '3'
          }]
        },
        {name: '供应商名称', id: 'departureCityssss', required: false, category: 0,},

      ],
    };
    let form = (<div><Filter formData={formData} dataProcess={this.dataProcess.bind(this)}
                             add={this.companyname.bind(this, 0)}/> {this.getTableView()}</div>)
    return form;
  }

  getTableView() {
    const columns = [{
      title: '操作时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
    }, {
      title: '操作环境',
      dataIndex: 'eventSource',
      key: 'eventSource',
    }, {
      title: '操作内容',
      dataIndex: 'eventName',
      key: 'eventName',
    }, {
      title: '操作人',
      dataIndex: 'operatorUser',
      key: 'operatorUser',
    }, {
      title: '日志',
      dataIndex: 'message',
      key: 'message',
    }];
    const {flightstock: {loading: ruleLoading, data: {list, pagination: {current, pageSize, total}}}} = this.props;
    return (
      <div className={css.table_container}>
        <Table
          loading={ruleLoading}
          dataSource={list}
          rowKey={'id'}
          pagination={{
            pageSize: pageSize,
            total: total,
            current: current,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          onChange={(pagination, filters, sorter) => {
            let val = this.state.filter;
            val.current = pagination.current;
            val.pageSize = pagination.pageSize;

          }}
        >
          <Column
            title="机票资源号"
            dataIndex="id"
            key="id"
          />
          <Column
            title="供应商名称"
            dataIndex="arrCity"
            key="arrCity"
          />
          <Column
            title="出发/回程城市"
            dataIndex="lianxi"
            key="lianxi"
          />
          <Column
            title="出发/回程航班"
            dataIndex="startCity"
            key="startCity"
          />
          <Column
            title="航班周期"
            dataIndex="registerTime"
            key="registerTime"
          />
          <Column
            title="往返天数"
            dataIndex="progress"
            key="progress"
          />
          <Column
            title="航班负责人"
            dataIndex="money"
            key="money"
          />
          <Column
            title="状态"
            dataIndex="tel"
            key="tel"
          />
          <Column
            title="创建时间"
            dataIndex="time"
            key="time"
          />
          <Column
            title="操作"
            className={css.lastCol}
            key="action"
            render={(text, record, index) => {
              switch (record.disabled) {
                case true:
                  return <div>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 0, '编辑航班库存')}>编辑
                    </a>
                    <Divider type="vertical"/>
                    <a style={{cursor: "pointer", margin: "6px"}}
                       onClick={this.operating.bind(this, record, 1)}>上架
                    </a>
                    <Divider type="vertical"/>
                    <a style={{cursor: "pointer", margin: "6px"}}
                       onClick={this.operating.bind(this, record, 3)}>日志
                    </a>
                  </div>
                  break;
                case false:
                  return <div>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 0, '编辑航班库存')}>编辑
                    </a>
                    <Divider type="vertical"/>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 4, '查看航班库存')}>查看
                    </a>
                    <Divider type="vertical"/>
                    <a style={{cursor: "pointer", margin: "6px"}}
                       onClick={this.operating.bind(this, record, 3)}>日志
                    </a>
                  </div>
                  break;
              }
            }}
          />
        </Table>
        <Modal
          title="日志"
          visible={this.state.data.visible}
          onOk={this.companyname.bind(this, 1)}
          onCancel={this.companyname.bind(this, 1)}
        >
          <Table pagination={false} dataSource={this.state.data.dataSource} columns={columns}/>
        </Modal>
      </div>
    )
  }

  operating(data, ole, txt, ide) {
    let _this = this;
    let {filter} = this.state;
    filter.page = _this.state.p;
    filter.size = _this.state.pc;
    const turn = (ole) => {
      data.purpose = ole;
      _this.props.openTab({
        path: "FlightstockAdd",
        title: txt,
        post: data,
        callBack: (state) => {
          _this.loadData(0, APILXF.api_airlines, filter)
        }
      })
    };
    const confirms = (api, data, titlea) => {
      confirm({
        title: titlea,
        // content: titleb,
        onOk() {
          return _this.loadData(1, api, data);
        },
        onCancel() {
        },
      });
    }
    switch (ole) {
      case 0:
        turn('editor');
        break;
      case 1:
        confirms(APILXF.api_onshelve, {
          airlineStatus: 1,
          supplierName: data.supplierName,
          id: data.id,
        }, "您确定要上架吗？");
        break;
      case 2:
        confirms(APILXF.api_delete, {id: data.id}, "您确定要删除吗？");
        break;
      case 3:
        let datas = this.state.data;
        _this.loadData(2, APILXF.api_logs, {lineId: data.id});
        datas.visible = true;
        this.setState({data: datas})
        break;
      case 4:
        turn('view');
        break;

    }
  }
}

// page.contextTypes = {
//     router: React.PropTypes.object
// }
module.exports = page;
