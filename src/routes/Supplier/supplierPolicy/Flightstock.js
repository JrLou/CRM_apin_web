/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import css from './Flightstock.less';
// import {routerRedux} from 'dva/router';
import {
  message,
  Table,
  Modal,
} from 'antd';
import moment from 'moment';

const confirm = Modal.confirm;
const {Column,} = Table;
// import HttpTool from '../../../http/HttpTool.js';
// import APILXF from '../../../http/APILXF.js';
import Filter from '../../../components/screening/Filter.js';

class page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      p: 1,
      pc: 10,
      total: 0,
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
    data.tableLoading = false;
    data.visible = false;
    // console.log(CookieHelp.getAccountId());
    // this.loadData(0, APILXF.api_airlines, {
    //     page: this.state.p,
    //     size: this.state.pc,
    //     airlineStatus: this.state.filter.airlineStatus
    // });
    this.setState({
      data: data,
      filter: val,
    })
  }

  loadData(ole, url, param) {
    let {data} = this.state;
    let {filter} = this.state;
    let _this = this;
    HttpTool.post(url,
      (code, msg, json, option) => {
        if (code == 200) {
          switch (ole) {
            case 0:
              if (json && json.length > 0) {
                json.map((v, k) => {
                  v.indexCol = k + 1
                })
                _this.setState({
                  total: option.option.totalRows,
                  tableDataSource: json,
                })
              } else {
                _this.setState({
                  tableDataSource: [],
                  total: option.option.totalRows,
                })
              }
              data.tableLoading = false;
              _this.setState({
                data: data,
              })
              break;
            case 1:
              message.success(msg);
              filter.page = _this.state.p;
              filter.size = _this.state.pc;
              filter.airlineStatus = _this.state.filter.airlineStatus;
              for (let i in filter) {
                if (filter[i] == undefined) {
                  delete filter[i];
                }
              }
              _this.loadData(0, APILXF.api_airlines, filter);
              break;
            case 2:
              data.dataSource = json;
              for (let i = 0; i < json.length; i++) {
                json[i].createdTime = moment(json[i].createdTime).format('YYYY-MM-DD:HH:mm')
              }
              _this.setState({
                data: data,
              })
              break;

          }
        } else {
          message.warning(msg);
        }

      },
      (code, msg, option) => {
        switch (ole) {
          case 0:
            data.tableLoading = false;
            this.setState({
              data: data,
              tableDataSource: [],
            });
            break;
          case 1:
            message.success(msg);
            break;
        }

        message.warning(msg);
      }
      , param
    )

  }

  companyname(ole, e, event) { //全局函数（根据ole作为标识可以快速查找各功能实现位置）
    switch (ole) {
      case 0: //新增政策跳转新增页面
        console.log('ddddd');
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
    console.log(ole);
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
    return (
      <div className={css.table_container}>
        <Table
          loading={this.state.data.tableLoading}
          dataSource={this.state.tableDataSource}
          rowKey={record => record.indexCol}
          bordered={true}
          pagination={{
            pageSize: this.state.pc,
            total: this.state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            current: this.state.p
          }}
          onChange={(pagination, filters, sorter) => {
            let val = this.state.filter;
            val.page = pagination.current;
            val.size = pagination.pageSize;
            this.loadData(0, APILXF.api_airlines, val);
            this.state.pc = pagination.pageSize;
            this.setState({
              p: pagination.current,
            });
            setTimeout(() => {
              console.log(this.state.p)
            }, 1000)
          }}
        >
          <Column
            title="机票资源号"
            dataIndex="airlineNo"
            key="airlineNo"
          />
          <Column
            title="供应商名称"
            dataIndex="supplierName"
            key="supplierName"
            render={(text, record, index) => {
              if (record.supplierName == "undefined") {
                return <span>未知</span>
              } else {
                return <span>{record.supplierName}</span>
              }
            }}
          />
          <Column
            title="出发/回程城市"
            dataIndex="voyage"
            key="voyage"
          />
          <Column
            title="出发/回程航班"
            dataIndex="flightNumber"
            key="flightNumber"
          />
          <Column
            title="资源负责人"
            dataIndex="manager"
            key="manager"
          />
          <Column
            title="出发日期"
            dataIndex="flightDate"
            key="flightDate"
          />
          <Column
            title="回程日期"
            dataIndex="returnDate"
            key="returnDate"
            render={(text, record, index) => {
              switch (record.flightType) {
                case 1:
                  return <span>{record.returnDate}</span>
                  break;
                case 2:
                  return <span>{record.returnDate}</span>
                  break;
              }
            }}
          />

          <Column
            title="成人价"
            dataIndex="adultPrice"
            key="adultPrice"
          />
          <Column
            title="可售库存"
            dataIndex="unsaldCount"
            key="unsaldCount"
          />
          <Column
            title="行程类型"
            dataIndex="flightType"
            key="flightType"
            render={(text, record, index) => {
              switch (record.flightType) {
                case 1:
                  return <span>单程</span>
                  break;
                case 2:
                  return <span>往返</span>
                  break;
                case 3:
                  return <span>多程</span>
                  break;
              }
            }}
          />
          <Column
            title="创建时间"
            dataIndex="createdTime"
            key="createdTime"
          />
          <Column
            title="操作"
            className={css.lastCol}
            key="action"
            render={(text, record, index) => {
              if (record.resType == 0) {
                switch (record.airlineStatus) {
                  case 0:
                    return <div>
                      <a
                        style={{cursor: "pointer", margin: "6px"}}
                        onClick={this.operating.bind(this, record, 0, '编辑航班库存')}>编辑
                      </a>
                      <a style={{cursor: "pointer", margin: "6px"}}
                         onClick={this.operating.bind(this, record, 1)}>上架
                      </a>
                      <a style={{cursor: "pointer", margin: "6px"}}
                         onClick={this.operating.bind(this, record, 2)}>删除
                      </a>
                      <a style={{cursor: "pointer", margin: "6px"}}
                         onClick={this.operating.bind(this, record, 3)}>日志
                      </a>
                    </div>
                    break;
                  case 1:
                    return <div>
                      <a
                        style={{cursor: "pointer", margin: "6px"}}
                        onClick={this.operating.bind(this, record, 0, '编辑航班库存')}>编辑
                      </a>
                      <a
                        style={{cursor: "pointer", margin: "6px"}}
                        onClick={this.operating.bind(this, record, 4, '查看航班库存')}>查看
                      </a>
                      <a style={{cursor: "pointer", margin: "6px"}}
                         onClick={this.operating.bind(this, record, 2)}>删除
                      </a>
                      <a style={{cursor: "pointer", margin: "6px"}}
                         onClick={this.operating.bind(this, record, 3)}>日志
                      </a>
                    </div>
                    break;
                }
              } else {
                return <a
                  style={{cursor: "pointer", margin: "6px"}}
                  onClick={this.operating.bind(this, record, 4, '查看航班库存')}>查看
                </a>

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
