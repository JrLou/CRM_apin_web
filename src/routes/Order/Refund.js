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
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'refund/fetch',
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

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
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

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="退款单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
          <Col md={6} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('lianxi')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="退款时间">
              {getFieldDecorator('time')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="供应商名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
    const { rule: { loading: ruleLoading, list, total } } = this.props;
    const { modalVisible } = this.state;

    const columns = [{
      title: '退款单号',
      dataIndex: 'id',
    }, {
      title: '退款状态',
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
      render: () => <a onClick={() => this.handleModalVisible(true)}>查看</a>,
    }];

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>

            <Table
              dataSource={list}
              columns={columns}
              pagination={{ showSizeChanger: true, showQuickJumper: true, total }}
              loading={ruleLoading}
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
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="描述"
          >
            <Input placeholder="请输入" />
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
