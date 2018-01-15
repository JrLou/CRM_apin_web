//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar, formatPar } from '../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
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
            <FormItem label="订单号">
              {getFieldDecorator('cityDep', {
                rules: [{ max: 15, message: "输入位数过长" }],
              })(
                <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="需求池类型">
              {getFieldDecorator('status', {
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
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('customer', {
                initialValue: '-1',
              })(
                <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="是否出票">
              {getFieldDecorator('cityDep', {
                rules: [{ max: 15, message: "输入位数过长" }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="-1">全部</Option>
                  <Option value="0">国内</Option>
                  <Option value="1">国际</Option>
                </Select>
                )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="是否账清">
              {getFieldDecorator('isEmpty', {
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
          <Col md={6} sm={24}>
            <FormItem label="发票是否寄出">
              {getFieldDecorator('isPush', {
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
          <Col md={6} sm={24}>
            <FormItem label="是否退改">
              {getFieldDecorator('isBack', {
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="询价日期">
              {getFieldDecorator('askDate', {
              })(
                <RangePicker />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出票日期">
              {getFieldDecorator('tiketTiket', {
              })(
                <RangePicker />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退改日期">
              {getFieldDecorator('changeTime', {
              })(
                <RangePicker />
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
        title: '客户',
        dataIndex: 'customer',
      },
      {
        title: '客服',
        dataIndex: 'server',
      },
      {
        title: '航线',
        dataIndex: 'line',
      },
      {
        title: '询价日期',
        dataIndex: 'create_time',
        render: (text, record) => {
          // return moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '去程日期',
        dataIndex: 'back_time',
        render: (text, record) => {
          // return moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '人数',
        dataIndex: 'count'
      },
      {
        title: '是否出票',
        dataIndex: 'is_adjust',
        render: (text, record) => {
          let innerText = ['否', ' 是']
          return innerText[text]
        },
      },
      {
        title: '出票日期',
        dataIndex: 'tiket_time',
        render: (text, record) => {
          // return moment(text).format('YYYY-MM-DD');
        }
      },
      {
        title: '卖价总价',
        dataIndex: 'adult_count',
      },
      {
        title: '结算总价',
        dataIndex: 'trip_days',
      },
      {
        title: '利润',
        // render: (text, record) => <a href="javascript:;" onClick={this.getLogs.bind(this, record.id)}>推送日志</a>,
      },
      {
        title: '供应商',
        // render: (text, record) => <a href="javascript:;" onClick={this.getLogs.bind(this, record.id)}>推送日志</a>,
      },
      {
        title: '操作',
        render: (text, record) => {
          return <div className={styles.handleBtn}>
            <Button type='primary'>查看</Button>
            <Button type='primary'>修改</Button>
            <Button type='primary'>删除</Button>
          </div>
        }
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <div className={styles.btnGroup}><Button type={'default'}><Link to='/offline/order/addOrder'>新增订单</Link></Button></div>
          <div className={styles.titleGroup}>共搜索到{list.option && list.option.total}条数据</div>
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
