import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import StandardTable from './EntrustList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  entrust: state.entrust,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    // expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'entrust/fetch',
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
      type: 'entrust/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'entrust/fetch',
      payload: {},
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
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
        type: 'entrust/fetch',
        payload: values,
      });
    });
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('goCity')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('backCity')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status')(
                <Select placeholder="全部" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">运行中</Option>
                  <Option value="2">选择方案中</Option>
                  <Option value="3">待出票</Option>
                  <Option value="4">已出票</Option>
                  <Option value="5">委托取消</Option>
                  <Option value="6">出票失败</Option>
                  <Option value="7">委托过期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contacts')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('phone')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </div>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { entrust: { loading: ruleLoading, data } } = this.props;
    const { selectedRows, modalVisible, addInputValue } = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
