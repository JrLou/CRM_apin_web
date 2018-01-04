import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const status = ['待出票', '已出票', '出票失败'];
const source = ['飞猪', '供应商'];

@connect(state => ({
  rule: state.flyingpig,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
    pagination: {
      currentPage: 1,
      pageSize: 10,
    },
    id: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'flyingpig/fetch',
      payload: pagination
    });
  }

  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'flyingpig/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;

    form.resetFields();
    dispatch({
      type: 'flyingpig/fetch',
      payload: pagination,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { pagination } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        ...pagination
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'flyingpig/fetch',
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
                  {
                    status.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
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
                  {
                    source.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
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
    const { id } = this.state;

    const columns = [{
      title: '订单号',
      dataIndex: 'id',
    }, {
      title: '订单状态',
      dataIndex: 'status',
      render: (text) => {
        return status[text];
      },
    }, {
      title: '联系人',
      dataIndex: 'lianxi',
    }, {
      title: '联系电话',
      dataIndex: 'tel',
    }, {
      title: '出发城市',
      dataIndex: 'startCity',
    }, {
      title: '到达城市',
      dataIndex: 'arrCity'
    }, {
      title: '出发日期',
      dataIndex: 'time',
    }, {
      title: '出发航班号',
      dataIndex: 'no',
    }, {
      title: '人数',
      dataIndex: 'num',
    }, {
      title: '已付金额',
      dataIndex: 'money',
    }, {
      title: '订单来源',
      dataIndex: 'source',
      render: (text) => {
        return source[text];
      },
    }, {
      title: '下单时间',
      dataIndex: 'createTime',
    }, {
      title: '操作',
      render: (text, record) => {
        const title = record.status == 0 ? '出票' : '查看';
        return <Link to={`/order/flyingpigDetail/${record.id}`}>{title}</Link>
      }
    }];

    return (<PageHeaderLayout>
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
