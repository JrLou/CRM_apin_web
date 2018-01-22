//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col, Table, DatePicker, Modal } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Offline.less';
import moment from 'moment';
import { getPar, formatPar } from '../../utils/utils';
import CookieHelp from '../../utils/cookies';
import { Base64 } from 'js-base64'
const FormItem = Form.Item;
const confirm = Modal.confirm;
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
      pageSize: 10,
    }
    this.searchValues = {
    }
    this.currentUser = CookieHelp.getCookieInfo('_r') ? Base64.decode(CookieHelp.getCookieInfo('_r')) : null;
  }
  componentDidMount() {
    this.handleSearch();
  }
  _handleDate(values, idsArr) {
    idsArr.map((v, k) => {
      if (values[v]) {
        values[v + 'Start'] = moment(values[v][0]).format('YYYY-MM-DD');
        values[v + 'End'] = moment(values[v][1]).format('YYYY-MM-DD');
        delete values[v];
      }
    })
    return values
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
        values = this._handleDate(values, ['endorseDate', 'inquiryDate', 'printDate'])
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
    let params = { ...values, pageNum: this.page.page, pageSize: this.page.pageSize };
    console.log(params)
    dispatch({
      type: 'offline/fetch',
      payload: params,
    });
  }
  delOrder(id) {
    let listParams = { ... this.searchValues, pageNum: this.page.page, pageSize: this.page.pageSize };
    const { dispatch } = this.props;
    confirm({
      title: '注意',
      content: '你确定要删除本条订单吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '返回',
      onOk: () => {
        dispatch({
          type: 'offline/delOrder',
          payload: { id: id, listParams: listParams },
        });
        // 请求数据
        // this.getData()
      }
    });
  }
  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.handleSearch();
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSearch.bind(this)} >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('serialNo', {
                rules: [{ max: 32, message: "长度不超过32" }],
              })(
                <Input placeholder="请输入" />
                )}
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
                rules: [{ max: 32, message: "长度不超过32" }],
                initialValue: '',
              })(
                <Input placeholder="请输入" />
                )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否出票">
              {getFieldDecorator('isPrint', {
                rules: [{ max: 32, message: "长度不超过32" }],
                initialValue: ''
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
              {getFieldDecorator('inquiryDate', {
              })(
                <RangePicker allowClear={false} />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出票日期">
              {getFieldDecorator('printDate', {
              })(
                <RangePicker allowClear={false} />
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退改日期">
              {getFieldDecorator('endorseDate', {
              })(
                <RangePicker allowClear={false} />
                )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right' }}>
            <Button type="primary" style={{ marginRight: 6 }} htmlType="submit">查询</Button>
            <Button type="default" onClick={this.resetValue.bind(this)}>重置</Button>
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
  }
  render() {
    const { offline: { list, loading } } = this.props;
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: this.page.pageSize,
      current: this.page.page,
      total: list && list.option,
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
        dataIndex: 'serialNo',
        width: 150,
        render: (text, record) => <Link to={"/offline/order/ViewOrder/" + record.id}>{text}</Link>,
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
        width: 150
      },
      {
        title: '询价日期',
        dataIndex: 'inquiryDate',
      },
      {
        title: '去程日期',
        dataIndex: 'depDate',
      },
      {
        title: '人数',
        dataIndex: 'numbers'
      },
      {
        title: '是否出票',
        dataIndex: 'isPrintStr'
      },
      {
        title: '出票日期',
        dataIndex: 'printDate'
      },
      {
        title: '卖价总价',
        dataIndex: 'totalPrice',
        render: (text, record) => {
          return +text / 100
        },
      },
      {
        title: '结算总价',
        dataIndex: 'settlePrice',
        render: (text, record) => {
          return +text / 100
        },
      },
      {
        title: '利润',
        dataIndex: 'profit',
        render: (text, record) => {
          return +text / 100
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 130
      },
      {
        title: '操作',
        render: (text, record) => {
          return <div className={styles.handleBtn}>
            <Link to={"/offline/order/ViewOrder/" + record.id}><a href="javascript:;" type='primary'>查看</a></Link>
            <Link to={"/offline/order/EditOrder/" + record.id}><a href="javascript:;" type='primary'>修改</a></Link>
            <a href="javascript:;" type='primary' disabled={!isLeader} onClick={this.delOrder.bind(this, record.id)}>删除</a>
          </div>
        }
      },
    ];
    let isLeader = !!this.currentUser && this.currentUser.split(',').indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;
    // console.log('总监？', isLeader);
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <div className={styles.btnGroup}><Link to='/offline/order/addOrder'><Button type={'primary'}>新增订单</Button></Link></div>
          <div className={styles.titleGroup}>共搜索到{list && list.option}条数据</div>
          <Table
            className={styles.tableOutter}
            dataSource={list && list.data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            rowKey="id"
          />
          <Button type="primary" style={{ marginTop: '10px' }} onClick={this.outExcel}>导出EXCEL表格</Button>
        </Card>
      </PageHeaderLayout>
    );
  }
}
