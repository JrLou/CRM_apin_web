//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar, formatPar } from '../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
@connect(state => ({
  offline: state.offline,
}))
@Form.create()
export default class OfflineList extends PureComponent {
  constructor() {
    super()
    this.page = {
      page: 1,
      pageSize: 12,
    }
    this.searchValues = {

    }
  }
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch() {
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }
        // 保留搜索参数
        this.searchValues = values;
        // 搜索或重置置为第1页
        this.page.page = 1
        this.getData(values)
      }
    });
  };
  getData(values = this.searchValues) {
    const { dispatch } = this.props;
    let params = { ...values, p: this.page.page, pc: this.page.pageSize };
    console.log(params)
    dispatch({
      type: 'offline/fetch',
      payload: params,
    });
  };
  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.handleSearch();
  }
  tableChage() {

  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch.bind(this)}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('cityDep', {
                rules: [{ max: 15, message: "输入位数过长" }],
              })(
                <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('cityArr', {
                rules: [{ max: 15, message: "输入位数过长" }],
              })(
                <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="需求池类型">
              {getFieldDecorator('poolType', {
                initialValue: '-1',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="0">国内</Option>
                  <Option value="1">国际</Option>
                </Select>
                )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right' }}>
            <Button type="primary" style={{ marginRight: 6 }} onClick={this.handleSearch.bind(this)} htmlType="submit">查询</Button>
            <Button type="default" onClick={this.resetValue.bind(this)}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }
  pageChange(page, pageSize) {
    this.handleSearch(page, pageSize);
  }
  render() {
    const { offline: { list, loading } } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.page.pageSize,
      current: this.page.page,
      total: list.option && list.option.total,
      onChange: ((page, pageSize) => {
        this.page = {
          page: page,
          pageSize: pageSize,
        }
        this.getData()
      }),
      onShowSizeChange: ((page, pageSize) => {
        this.page = {
          page: page,
          pageSize: pageSize,
        }
        this.getData()
      }),
    };
    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        render: (text, record) => <Link target="_blank" to={{ pathname: '/order/entrust/detail/' + formatPar({ id: text }) }}>{text}</Link>,
      },

      {
        title: '出发城市',
        dataIndex: 'city_dep',
      },
      {
        title: '到达城市',
        dataIndex: 'city_arr',
      },
      {
        title: '下单时间',
        dataIndex: 'create_time',
        render: (text, record) => {
          return moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '起飞时间',
        dataIndex: 'dep_yyyymm',
        render: (text, record) => {
          // return text.toString().substring(0, 4) + "-" + text.toString().substring(4);
        }
      },
      {
        title: '订单状态',
        dataIndex: 'order_status',
        render: (text, record) => {
          return '委托中';
        }
      },
      {
        title: '是否接受微调',
        dataIndex: 'is_adjust',
        render: (text, record) => {
          let innerText = ['否', ' 是']
          return innerText[text]
        },
      },
      {
        title: '订单人数',
        dataIndex: 'adult_count',
      },
      {
        title: '出行天数',
        dataIndex: 'trip_days',
      },
      {
        title: '推送记录',
        // render: (text, record) => <a href="javascript:;" onClick={this.getLogs.bind(this, record.id)}>推送日志</a>,
      }];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <Table
            dataSource={list && list.data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
