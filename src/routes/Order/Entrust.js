import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import moment from 'moment';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
const status = ['待付款', '委托中', '方案选择中', '待付尾款', '待出票', '已出票', '出票失败', '委托过期', '委托关闭', ];
@connect(state => ({
  entrustList: state.entrustList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
    pagination: {
      p: 1,
      pc: 10,
    },
    id: '',
    timeArr: [],
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleTableChange(pagination) {
    this.setState({
      pagination: {
        p: pagination.current,
        pc: pagination.pageSize,
      }
    }, () => {
      this.handleSearch();
    });
  }

  handleFormReset() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.setState({
      formValues: param,
      pagination: {
        p: 1,
        pc: 10,
      }
    }, () => {
      this.handleSearch();
    });
  };

  selectTime(date, dateString) {
    this.setState({
      timeArr: dateString,
    });
  }

  handleSearch() {
    const {dispatch, form} = this.props, {pagination, timeArr} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'start_time': timeArr[0] || '',
          'end_time': timeArr[1] || '',
        };
        values.group_type = Number(values.group_type);
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }
        values.order_status = typeof values.order_status == 'string' ? '' : Number(values.order_status);

        this.setState({
          formValues: values,
        });
        let params = Object.assign(pagination, values);
        dispatch({
          type: 'entrustList/getList',
          payload: params,
        });
      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('city_dep')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('city_arr')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('order_status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value=''>全部</Option>
                  {
                    status.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('start_time')(
                <RangePicker style={{width: '100%'}} onChange={::this.selectTime}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contact')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('mobile')(
                <Input placeholder="请输入" type="tel"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('group_type', {
                initialValue: '0'
              })}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" onClick={::this.handleSearch}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={::this.handleFormReset}>重置</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {entrustList: {loading, list, total}} = this.props;
    const {id} = this.state;

    const columns = [{
        title: '订单号',
        dataIndex: 'id',
        render: (text, record) => {
          return <Link to={`/order/entrust/${record.id}`}>{text}</Link>
        }
      }, {
        title: '订单状态',
        dataIndex: 'order_status',
        render: (text) => {
          return status[text];
        },
      }, {
        title: '联系人',
        dataIndex: 'contact',
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
      }, {
        title: '出发城市',
        dataIndex: 'city_dep',
      }, {
        title: '到达城市',
        dataIndex: 'city_arr'
      },{
        title: '出发日期(发布)',
        dataIndex: 'dep_yyyymm',
        render: (text, record) => {
          let date1 = String(text).substr(0, 4) || '', date2 = String(text).substr(4, 2) || '', day = '';
          switch (record.dep_dd) {
            case 0:
              day = '(不限)';
              break;
            case -1:
              day = '(上旬)';
              break;
            case -2:
              day = '(中旬)';
              break;
            case -3:
              day = '(下旬)';
              break;
            default:
              day = '-' + record.dep_dd;
          }
          return date1 + '-' + date2 + day;
        }
      }, {
        title: '出发航班号',
        dataIndex: 'flight_no',
        render: (text) => {
          let flightArr = text.split('/');
          return flightArr[0] || '';
        }
      }, {
        title: '人数',
        dataIndex: 'adult_count',
      }, {
        title: '已付金额',
        dataIndex: 'payAmount',
      }, {
        title: '下单时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, {
        title: '操作',
        render: (text, record) => {
          const title = record.status == 0 ? '出票' : '查看';
          return <Link to={`/order/entrust/${record.id}`}>{title}</Link>
        }
      }];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <Table
              dataSource={list}
              columns={columns}
              pagination={{showSizeChanger: true, showQuickJumper: true, total}}
              loading={loading}
              onChange={::this.handleTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
