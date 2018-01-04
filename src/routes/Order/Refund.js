import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  rule: state.refund,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    record: {},
    pagination: {
      currentPage: 1,
      pageSize: 10
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    dispatch({
      type: 'refund/fetch',
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
      type: 'refund/fetch',
      payload: params,
    });
  };

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
        type: 'refund/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="退款单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退款状态">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">已退款</Option>
                  <Option value="2">退款失败</Option>
                </Select>
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
            <FormItem label="退款时间">
              {getFieldDecorator('time')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供应商名称">
              {getFieldDecorator('name')(
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
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const { rule: { loading, list, total } } = this.props;
    const { modalVisible, record } = this.state;

    const columns = [{
      title: '退款单号',
      dataIndex: 'id',
    }, {
      title: '退款状态',
      dataIndex: 'status',
      render: (text) => {
        const status = ['已退款', '退款失败'];
        return status[text - 1];
      },
    }, {
      title: '退款金额',
      dataIndex: 'money',
    }, {
      title: '订单号',
      dataIndex: 'orderId',
    }, {
      title: '退款时间',
      dataIndex: 'time',
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
        <Modal
          title="退款申请"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
          footer={null}
        >
          {record && <Form layout="inline">
            <Row>
              <Col span={12}>
                <FormItem label="订单号">
                  {record.orderId}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="退款单号">
                  {record.id}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="退款金额">
                  {record.money}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="处理客服">
                  {record.kefu}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="备注">
                  {record.beizhu}
                </FormItem>
              </Col>
            </Row>
          </Form>}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
