//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Demand.less';
import { getPar, formatPar } from '../../utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
@connect(state => ({
  demand: state.demand,
}))
@Form.create()
export default class Demand extends PureComponent {
  constructor() {
    super()
    this.page = {
      page: 1,
      pageSize: 12,
    }
    this.searchValues = {
      fromAddr: '',
      tooAddr: '',
      status: ''
    }
  }
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch(e) {
    if(e){
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
      type: 'demand/fetch',
      payload: params,
    });
  };
  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.handleSearch();
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
            <Button type="primary" style={{ marginRight: 6 }}  htmlType="submit">查询</Button>
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
    const { demand: { list, loading } } = this.props;
    const pagination = {
      pageSize: this.page.pageSize,
      current: this.page.page,
      total: list && list.option && list.option.total,
      onChange: ((page, pageSize) => {
        this.page = {
          page: page,
          pageSize: pageSize,
        }
        this.getData()
      }),
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false} className="poolListBox">
          <Card bordered={false}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
          </Card>
          <p style={{ padding: '10px 0 0' }}>共有{list.option && list.option.total}个需求池</p>
          <div className={styles.cardList}>
            <List
              rowKey="id"
              loading={loading}
              pagination={pagination}
              grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
              dataSource={list.data}
              renderItem={item => (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card}
                    actions={[
                      <Link
                        to={'/fightgroups/demand/viewDemand/' + formatPar({ cityArr: item.city_arr, cityDep: item.city_dep })}>
                        查看历史拼团</Link>,
                      <Link to={'/fightgroups/demand/choose/' + formatPar({ cityArr: item.city_arr, cityDep: item.city_dep })} >
                        <Button type="primary">方案推送</Button>
                      </Link>
                    ]}
                    title={<span className={styles.titleBox} title={item.city_dep + '-' + item.city_arr}><b className={styles.cardTitle}></b>{item.city_dep + '-' + item.city_arr}</span>}
                    extra={item.total + '人'}>
                    <Card.Meta
                      description={(
                        <div>
                          <p>3天内需要处理的订单数：<span style={{ color: '#f00' }}>{item.emergency}</span></p>
                          <p>待推方案订单数：{item.wait}</p>
                          <p>待推方案总人数：{item.wait_people}</p>
                          <p>已成团订单数：{item.finish}</p>
                        </div>
                      )}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
