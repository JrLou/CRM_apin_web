import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  rule: state.flyingpig,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('startCity')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('arrCity')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">待出票</Option>
                  <Option value="2">已出票</Option>
                  <Option value="3">出票失败</Option>
                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单来源">
              {getFieldDecorator('source', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">飞猪</Option>
                  <Option value="2">供应商</Option>
                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('time')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('lianxi')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('tel')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const { rule: { loading, list, total } } = this.props;
    const { modalVisible } = this.state;

    const columns = [{
      title: '订单号',
      dataIndex: 'id',
    }, {
      title: '订单状态',
      dataIndex: 'status',
      render: (text) => {
        switch (text) {
          case '1':
            return '已退款';
          case '2':
            return '退款失败';
          default:
            break;
        }
      },
    }, {
      title: '联系人',
      dataIndex: 'money',
    }, {
      title: '联系电话',
      dataIndex: 'orderId',
    }, {
      title: '出发城市',
      dataIndex: 'time',
    }, {
      title: '到达城市',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '出发日期',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '到达城市',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '出发航班号',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '到达城市',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '人数',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '已付金额',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '订单来源',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '下单时间',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
    }, {
      title: '操作',
      render: (text, record) => <a onClick={() => this.handleModalVisible(true, record)}>查看</a>,
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
              pagination={{ showSizeChanger: true, showQuickJumper: true, total }}
              loading={loading}
              onChange={this.handleTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
