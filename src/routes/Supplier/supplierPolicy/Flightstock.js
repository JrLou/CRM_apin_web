/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import css from './Flightstock.less';
import {connect, Link} from 'dva';
import {
  Table,
  Modal,
  Divider,
} from 'antd';
import moment from 'moment';

const confirm = Modal.confirm;
const {Column,} = Table;
import Filter from '../../../components/screening/Filter.js';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';


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
      visible: false,
    }
  }

  componentDidMount() {
    //加载第一页
    const val = this.state.filter;
    val.airlineStatus = 1
    const {dispatch} = this.props;
    dispatch({
      type: 'flightstock/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });
  }

  companyname(ole, e, event) { //全局函数（根据ole作为标识可以快速查找各功能实现位置）
    switch (ole) {
      case 0: //新增政策跳转新增页面
        this.props.history.push({pathname: 'flightstock/Add'});
        break;
      case 1: //弹窗确认按钮所调函数
        this.setState({visible: false})
    }
  }

  dataProcess(ole) {
    ole.p = 1;
    ole.pc = 10;
    let dates = {};
    for (let i in ole) {
      if (ole[i] != undefined && ole[i] != '') {
        dates[i] = ole[i];
      }
    }
    this.setState({
      filter: dates,
    });
    setTimeout(() => {
      console.log(this.state.filter)
      this.props.dispatch({
        type: 'flightstock/fetch',
        payload: this.state.filter,
      });
    }, 10)
  }

  render() {
    const formData = {
      added: '新增政策',
      list: [
        {name: '出发城市', id: 'city_dep', required: false, category: 0,},
        {name: '到达城市', id: 'city_arr', required: false, category: 0,},
        {name: '去程航班号', id: 'airLineGo', required: false, category: 0,},
        {name: '返程航班号', id: 'airLineBack', required: false, category: 0,},
        {name: '机票资源号', id: 'id', required: false, category: 0,},
        {
          name: '往返天数',
          id: 'days',
          required: false,
          category: 0,
          check: [{pattern: /^[0-9]*$/, message: "只能输入数字"}]
        },
        {name: '资源负责人', id: 'principalName', required: false, category: 0,},
        {
          name: '请选择有效性',
          id: 'validity',
          required: false,
          category: 1,
          disabled: 0,
          options: [{name: '全部', id: '-1'}, {name: '待上架', id: '0'}, {name: '上架', id: '1',}, {
            name: '过期',
            id: '3'
          }]
        },
        {name: '供应商名称', id: 'supplierName', required: false, category: 0,},

      ],
    };
    let form = (      <PageHeaderLayout>
        <Filter formData={formData} dataProcess={this.dataProcess.bind(this)}
                add={this.companyname.bind(this, 0)}/> {this.getTableView()}      </PageHeaderLayout>
    )
    return form;
  }

  getTableView() {
    const columns = [
      {
        title: '操作人',
        dataIndex: 'user_name',
        key: 'user_name',
      }, {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
      }, {
        title: '操作内容',
        dataIndex: 'create_content',
        key: 'create_content',
      }];
    const {flightstock: {loading, list: {data, option: {current, size, total}}, logs: {data:datalis, option}}} = this.props;
    return (
      <div className={css.table_container}>
        <Table
          loading={loading}
          dataSource={data}
          rowKey={'id'}
          pagination={{
            pageSize: size ? size : 10,
            total: total ? total : 0,
            current: current ? current : 1,
            showSizeChanger: true,
            showQuickJumper: true
          }}
          onChange={(pagination, filters, sorter) => {
            let val = this.state.filter;
            val.current = pagination.current;
            val.pageSize = pagination.pageSize;
            this.props.dispatch({
              type: 'flightstock/fetch',
              payload: val,
            });
          }}
        >
          <Column
            title="机票资源号"
            dataIndex="id"
            key="id"
          />
          <Column
            title="供应商名称"
            dataIndex="supplier_name"
            key="supplier_name"
          />
          <Column
            title="出发/回程城市"
            dataIndex="city_dep"
            key="city_dep"
            render={(text, record, index) => {
              return <div>{record.city_dep + "/" + record.city_arr}</div>
            }}
          />
          <Column
            title="出发/回程航班"
            dataIndex="flight_no"
            key="flight_no"
          />
          <Column
            title="航班周期"
            dataIndex="departure_start"
            key="departure_start"
            render={(text, record, index) => {
              return <div>{moment(record.departure_start).format('YYYY/MM/DD') + "至" + moment(record.departure_end).format('YYYY/MM/DD')}</div>
            }}
          />
          <Column
            title="往返天数"
            dataIndex="days"
            key="days"
          />
          <Column
            title="资源负责人"
            dataIndex="manager"
            key="manager"
          />
          <Column
            title="状态"
            dataIndex="airline_status"
            key="airline_status"
            render={(text, record, index) => {
              switch (record.airline_status) {
                case 0:
                  return <div>待上架</div>
                  break;
                case 1:
                  return <div>上架</div>
                  break;
              }
            }}
          />
          <Column
            title="创建时间"
            dataIndex="time"
            key="time"
            render={(text, record, index) => {
              return <div>{moment(record.create_time).format('YYYY/MM/DD')}</div>
            }}
          />
          <Column
            title="操作"
            className={css.lastCol}
            key="action"
            render={(text, record, index) => {
              switch (record.airline_status) {
                case 0:
                  return <div>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 0,)}>编辑
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
                case 1:
                  return <div>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 0, )}>编辑
                    </a>
                    <Divider type="vertical"/>
                    <a
                      style={{cursor: "pointer", margin: "6px"}}
                      onClick={this.operating.bind(this, record, 4, )}>查看
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
          visible={this.state.visible}
          onOk={this.companyname.bind(this, 1)}
          onCancel={this.companyname.bind(this, 1)}
        >
          <Table pagination={false} dataSource={datalis ? datalis : []} columns={columns}/>
        </Modal>
      </div>

    )
  }


  operating(data, ole,) {
    let _this = this;
    const confirms = (data, titlea) => {
      confirm({
        title: titlea,
        onOk() {
          _this.props.dispatch({
            type: 'flightstock/changeStatus',
            payload: data,
          });
        },
        onCancel() {
        },
      });
    }
    switch (ole) {
      case 0:
        this.props.history.push({
          pathname: 'flightstock/Edit',
          state: {
            data: data,
          }
        });
        break;
      case 1:
        confirms({
          airlineStatus: 1,
          id: data.id,
        }, "确定是否上架？");
        break;
      case 3:
        _this.setState({visible: true})
        _this.props.dispatch({
          type: 'flightstock/loglist',
          payload: {
            p: 1,
            pc: 100,
            uuid: data.id,
          },
        });
        break;
      case 4:
        _this.props.history.push({
          pathname: 'flightstock/View',
          state: {
            data: data,
          }
        });
        break;
    }
  }
}

module.exports = page;
