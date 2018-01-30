import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  Table,
  Divider,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import css from './Flightstock.less';

const confirm = Modal.confirm;
const {Column,} = Table;

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
@connect(state => ({
  h5List: state.h5List,
}))
@Form.create()
export default class TableList extends PureComponent {
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
      type: 'h5List/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });
  }

  companyname(ole, e, event) { //全局函数（根据ole作为标识可以快速查找各功能实现位置）
    switch (ole) {
      case 0: //新增政策跳转新增页面
        this.props.history.push({pathname: 'h5/Add'});
        break;
      case 1: //弹窗确认按钮所调函数
        this.setState({visible: false})
    }
  }

  handleFormReset() {
    if(this.props.h5List.loading){
      return null
    }
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'h5List/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    if(this.props.h5List.loading){
      return null
    }
    this.setState({
      isLoadingSearch: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.p = 1;
        values.pc = 10;
        let dates = {};
        for (let i in values) {
          if (values[i] != undefined) {
            dates[i] = values[i];
          }
        }
        this.setState({
          filter: dates,
        });
        this.props.dispatch({
          type: 'h5List/fetch',
          payload: dates,
        });
      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('city_dep', {rules: [{max: 32, message: '最长32位'}]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('city_arr', {rules: [{max: 32, message: '最长32位'}]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="航班号">
              {getFieldDecorator('id', {rules: [{max: 32, message: '最长32位'}]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="资源状态">
              {getFieldDecorator('validity', {
                initialValue: '-1'
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value='-1' key='-1'>全部</Option>
                  <Option value='1' key='1'>有效</Option>
                  <Option value='0' key='0'>失效</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
             <Button style={{marginRight: 8}} type="primary" onClick={this.companyname.bind(this, 0)}>新增政策</Button>
             <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={::this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  operating(data, ole,) {
    let _this = this;
    const confirms = (data, titlea) => {
      confirm({
        title: titlea,
        onOk() {
          _this.props.dispatch({
            type: 'h5List/changeStatus',
            payload: {status: data, filter: {..._this.state.filter, p: 1, pc: 10}},
          });
        },
        onCancel() {
        },
      });
    }
    switch (ole) {
      case 0:
        this.props.history.push({
          pathname: 'h5/Edit',
          state: {
            data: data,
          }
        });
        break;
      case 1:
        confirms({
          airlineStatus: 1,
          id: data.id,
        }, "您确定要上架吗？");
        break;
      case 3:
        _this.setState({visible: true})
        _this.props.dispatch({
          type: 'h5List/loglist',
          payload: {
            p: 1,
            pc: 100,
            uuid: data.id,
          },
        });
        break;
      case 4:
        _this.props.history.push({
          pathname: 'H5List/View',
          state: {
            data: data,
          }
        });
        break;
      case 5:
        confirms({
          airlineStatus: 0,
          id: data.id,
        }, "您确定要下架吗？");
        break;
    }
  }

  render() {
    const {h5List: {loading, list: {data, option: {current, size, total}}, logs: {data: datalis, option}}} = this.props;
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
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={css.tableList}>
            <div className={css.tableListForm}>
              {this.renderForm()}
            </div>
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
                val.p = pagination.current;
                val.pc = pagination.pageSize;
                this.props.dispatch({
                  type: 'h5List/fetch',
                  payload: val,
                });
              }}
            >
              <Column
                title="出发/回程城市"
                dataIndex="city_dep"
                key="city_dep"
                render={(text, record, index) => {
                  return <div>{record.city_dep + "/" + record.city_arr}</div>
                }}
              />
              <Column
                title="航班号"
                dataIndex="flight_no"
                key="flight_no"
                render={(text, record, index) => {
                  return <div>{record.flight_no.split('/')[0]}</div>
                }}
              />
              <Column
                title="出发日期"
                dataIndex="departure_start"
                key="departure_start"
                render={(text, record, index) => {
                  return <div>{moment(record.departure_start).format('YYYY-MM-DD')}</div>
                }}
              />
              <Column
                title="出发时刻"
                dataIndex="time_dep"
                key="time_dep"
                render={(text, record, index) => {
                  return <div>{moment(record.time_dep + record.departure_start).format('HH:mm') + "-" + moment(record.time_arr + record.departure_start).format('HH:mm')}</div>
                }}
              />
              <Column
                title="含税价"
                dataIndex="sell_price"
                key="sell_price"
                render={(text, record, index) => {
                  return <div>{"￥" + record.sell_price / 100}</div>
                }}
              />
              <Column
                title="折扣"
                dataIndex="seat_count"
                key="seat_count"
                render={(text, record, index) => {
                  return <div>{record.discount + '折'}</div>
                }}
              />
              <Column
                title="状态"
                dataIndex="is_invalid"
                key="is_invalid"
                render={(text, record, index) => {
                  switch (record.airline_status) {
                    case 0:
                      return <div>失效</div>
                      break;
                    case 1:
                      return <div>有效</div>
                      break;
                  }
                }}
              />
              <Column
                title="更新时间"
                dataIndex="create_time"
                key="create_time"
                render={(text, record, index) => {
                  return <div>{moment(record.create_time).format('YYYY-MM-DD HH:mm')}</div>
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
                          onClick={this.operating.bind(this, record, 0,)}>编辑
                        </a>
                        <Divider type="vertical"/>
                        <a
                          style={{cursor: "pointer", margin: "6px"}}
                          onClick={this.operating.bind(this, record, 5,)}>下架
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
              width={'600px'}
            >
              <Table pagination={false} rowKey={'id'}
                     dataSource={datalis ? datalis : []} columns={columns}/>
            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
