//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  Table,
  DatePicker,
  Modal,
} from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import { Base64 } from 'js-base64';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import CookieHelp from '../../utils/cookies';

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
@connect(state => ({
  offline: state.offline,
}))
@Form.create()
export default class OfflineList extends PureComponent {
  constructor() {
    super();
    this.page = {
      page: 1,
      pageSize: 10,
    };
    this.searchValues = {};
    this.currentUser = CookieHelp.getCookieInfo('_r')
      ? Base64.decode(CookieHelp.getCookieInfo('_r'))
      : null;
  }
  componentDidMount() {
    this.handleSearch();
  }
  // eslint-disable-next-line
  _handleDate(values, idsArr) {
    idsArr.map((v, k) => {
      if (values[v]) {
        values[v + 'Start'] = values[v][0]
          ? moment(values[v][0]).format('YYYY-MM-DD')
          : '';
        values[v + 'End'] = values[v][1]
          ? moment(values[v][1]).format('YYYY-MM-DD')
          : '';
        delete values[v];
      }
    });
    return values;
  }
  handleSearch(e) {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }
        values = this._handleDate(values, [
          'endorseDate',
          'inquiryDate',
          'printDate',
          'receiptDate',
          'payoffDate',
        ]);
        // 保留搜索参数
        this.searchValues = values;
        // 搜索或重置置为第1页
        this.page.page = 1;
        this.getData(values);
      }
    });
  }
  getData(values = this.searchValues) {
    const { dispatch } = this.props;
    let params = {
      ...values,
      pageNum: this.page.page,
      pageSize: this.page.pageSize,
    };
    console.log(params);
    dispatch({
      type: 'offline/fetch',
      payload: params,
    });
  }
  delOrder(id) {
    let listParams = {
      ...this.searchValues,
      pageNum: this.page.page,
      pageSize: this.page.pageSize,
    };
    const { dispatch } = this.props;
    const { offline: { list } } = this.props;
    confirm({
      title: '注意',
      content: '你确定要删除本条订单吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '返回',
      onOk: () => {
        dispatch({
          type: 'offline/delOrder',
          payload: {
            id: id,
            listParams: listParams,
            currentCount: list.data && list.data.length,
          },
        });
        // 请求数据
        // this.getData()
      },
    });
  }
  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.handleSearch();
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    let isLeader =
      !!this.currentUser &&
      this.currentUser
        .split(',')
        .indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;
    return (
      <Form layout="inline" onSubmit={this.handleSearch.bind(this)}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('serialNo', {
                rules: [{ max: 32, message: '长度不超过32' }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">国内散客</Option>
                  <Option value="1">国内团队</Option>
                  <Option value="2">国际散客</Option>
                  <Option value="3">国际团队</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="客户">
              {getFieldDecorator('customerName', {
                rules: [{ max: 32, message: '长度不超过32' }],
                initialValue: '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('ticketStatus', {
                rules: [],
                initialValue: '0',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">出票</Option>
                  <Option value="0">等待</Option>
                  <Option value="2">失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否账清">
              {getFieldDecorator('isPayoff', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发票是否寄出">
              {getFieldDecorator('isSendoff', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否退改">
              {getFieldDecorator('isEndorse', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="询价日期">
              {getFieldDecorator('inquiryDate', {})(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出票日期">
              {getFieldDecorator('printDate', {})(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退改日期">
              {getFieldDecorator('endorseDate', {})(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="打款日期">
              {getFieldDecorator('payoffDate', {})(<RangePicker />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="收款日期">
              {getFieldDecorator('receiptDate', {})(<RangePicker />)}
            </FormItem>
          </Col>
          {//【客服】支持模糊搜索，只在总监权限下能看到，客服权限不能看到。
          isLeader ? (
            <Col md={8} sm={24}>
              <FormItem label="客服">
                {getFieldDecorator('createUserName', {
                  rules: [{ max: 32, message: '长度不超过32' }],
                })(<Input />)}
              </FormItem>
            </Col>
          ) : null}
          <Col md={8} sm={24}>
            <FormItem label="客户类型">
              {getFieldDecorator('customerType', {
                initialValue: -1,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={-1}>全部</Option>
                  <Option value={2}>激活客户</Option>
                  <Option value={3}>活跃客户</Option>
                  <Option value={1}>沉积客户</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right' }}>
            <Button type="primary" style={{ marginRight: 6 }} htmlType="submit">
              查询
            </Button>
            <Button type="default" onClick={this.resetValue.bind(this)}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }
  pageChange(page, pageSize) {
    this.handleSearch(page, pageSize);
  }
  outExcel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'offline/outExcel',
      payload: this.searchValues,
    });
  };
  transferType = type => {
    //'类型，1-沉积客户、2-激活客户、3-活跃客户',
    let result = '';
    switch (type) {
      case 1:
        result = '沉积客户';
        break;
      case 2:
        result = '激活客户';
        break;
      case 3:
        result = '活跃客户';
        break;
      default:
        break;
    }
    return result;
  };
  render() {
    const { offline: { list, loading } } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.page.pageSize,
      current: this.page.page,
      total: list && list.option,
      onChange: (page, pageSize) => {
        this.page = {
          page: page,
          pageSize: pageSize,
        };
        this.getData();
      },
      onShowSizeChange: (page, pageSize) => {
        this.page = {
          page: page,
          pageSize: pageSize,
        };
        this.getData();
      },
    };
    const columns = [
      {
        title: '订单号',
        dataIndex: 'serialNo',
        width: 150,
        render: (text, record) => (
          <Link to={'/offline/order/ViewOrder/' + record.id}>{text}</Link>
        ),
      },
      {
        title: '客户类型',
        dataIndex: 'type',
        width: 100,
        render: text => this.transferType(text),
      },

      {
        title: '客户',
        width: 120,
        dataIndex: 'customerName',
      },
      {
        title: '客服',
        dataIndex: 'createUserName',
      },
      {
        title: '航线',
        dataIndex: 'flight',
        width: 150,
      },
      {
        title: '询价日期',
        dataIndex: 'inquiryDate',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '去程日期',
        dataIndex: 'depDate',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '人数',
        dataIndex: 'numbers',
      },
      {
        title: '订单状态',
        dataIndex: 'ticketStatus', // 0 等待 1已出票  2 拒绝
        render: (text, record) => {
          let inner_text = ['等待', '出票', '失败'];
          return inner_text[text];
        },
      },
      {
        title: '出票日期',
        dataIndex: 'printDate',
      },
      {
        title: '卖价总价',
        dataIndex: 'totalPrice',
      },
      {
        title: '结算总价',
        dataIndex: 'settlePrice',
      },
      {
        title: '利润',
        dataIndex: 'profit',
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 130,
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div className={styles.handleBtn}>
              <Link to={'/offline/order/ViewOrder/' + record.id}> 查看 </Link>
              <Link to={'/offline/order/EditOrder/' + record.id}> 修改 </Link>
              {isLeader ? (
                <a
                  href="javascript:;"
                  type="primary"
                  onClick={this.delOrder.bind(this, record.id)}
                >
                  删除
                </a>
              ) : null}
            </div>
          );
        },
      },
    ];
    let isLeader =
      !!this.currentUser &&
      this.currentUser
        .split(',')
        .indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;
    // console.log('总监？', isLeader);
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.btnGroup}>
            <Link to="/offline/order/addOrder">
              <Button type={'primary'}>新增订单</Button>
            </Link>
          </div>
          <div className={styles.titleGroup}>
            共搜索到{list && list.option}条数据
          </div>
          <Table
            className={styles.tableOutter}
            dataSource={list && list.data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            rowKey="id"
          />
          <Button
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={this.outExcel}
          >
            导出EXCEL表格
          </Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
