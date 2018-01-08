//需求池页面
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, List, Form, Input, Select, Row, Col } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Demand.less';
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
    let params = { ...values, page: this.page.page, pageSize: this.page.pageSize };
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
      <Form layout="inline" onSubmit={this.handleSearch.bind(this)}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="需求池类型">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="1">国内</Option>
                  <Option value="2">国际</Option>
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
    const { demand: { list, loading } } = this.props;
    const pagination = {
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
    };
    return (
      <PageHeaderLayout>
        {/*跳转三级页面*/}
        {/*<Link to={'/fightgroups/demand/id'}>*/}
        {/*<Button>查看需求池</Button>*/}
        {/*</Link>*/}
        {/*<Link to={'/fightgroups/demand/choose'}>*/}
        {/*<Button>推送方案-选择订单</Button>*/}
        {/*</Link>*/}
        {/*<Link to={'/fightgroups/demand/push'}>*/}
        {/*< Button>方案推送</Button>*/}
        {/*</Link>*/}
        <Link to={'/fightgroups/demand/result'}>
          < Button>查看拼团</Button>
        </Link>
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
                      to={{ pathname: '/fightgroups/demand/viewDemand', state: { id: item.id, line: item.fromAddr + '-' + item.toAddr } }}>
                      查看历史拼团</Link>,
                    <Link to={'/fightgroups/demand/choose'}><Button type="primary">方案推送</Button></Link>]}
                  title={<span><b className={styles.cardTitle}></b>{item.fromAddr + '-' + item.toAddr}</span>}
                  extra={item.peopleCounts + '人'}>
                  <Card.Meta
                    description={(
                      <div>
                        <p>3天内需要处理的订单数：<span style={{ color: '#f00' }}>{item.threeOrders}</span></p>
                        <p>待推方案订单数：{item.waitOrders}</p>
                        <p>待推方案总人数：{item.waitPeopleCounts}</p>
                        <p>已成团订单数：{item.alreadyOrders}</p>
                      </div>
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
