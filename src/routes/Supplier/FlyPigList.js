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
const status = ['有效', '无效' ];
@connect(state => ({
  flyPiglist: state.flyPiglist,
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
        };
        values.state = Number(values.state);
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }

        this.setState({
          formValues: values,
        });
        let params = Object.assign(pagination, values);
        dispatch({
          type: 'flyPiglist/fetch',
          payload: params,
        });
      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('cityDep')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('cityArr')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="去程航班号">
              {getFieldDecorator('airLineGo')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="返程航班号">
              {getFieldDecorator('airLineBack')(
                <Input placeholder="请输入" type="tel"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="资源状态">
              {getFieldDecorator('state', {
                initialValue: '-1'
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value='-1' key='-1'>全部</Option>
                  {
                    status.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="资源ID">
              {getFieldDecorator('id')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    const {flyPiglist: {loading, list, total}} = this.props;
    const {id} = this.state;

    const columns = [{
        title: '资源ID',
        dataIndex: 'id',
      }, {
        title: '出发/回程城市',
        dataIndex: 'voyage',
      }, {
        title: '航空公司',
        dataIndex: 'city_arr'
      }, {
        title: '出发/回程航班号',
        dataIndex: 'flight_no',
      }, {
        title: '出发日期',
        dataIndex: 'dep_yyyymm',
      }, {
        title: '出发时刻',
        dataIndex: 'time_dep',
      }, {
        title: '回程日期',
        dataIndex: 'dep_yyyymm',
      }, {
        title: '回程时刻',
        dataIndex: 'time_arr',
      }, {
        title: '含税价',
        dataIndex: 'sell_price',
        render: val => `￥${val}`,
      }, {
        title: '折扣',
        dataIndex: 'discount',
        render: val => `${val}`,
      }, {
        title: '状态',
        dataIndex: 'is_invalid',
        render: (text) => {
          return status[text];
        },
      }, {
        title: '更新时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
