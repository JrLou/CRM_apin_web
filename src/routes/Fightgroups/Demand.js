//需求池页面
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Button, List, Form, Input, Select, DatePicker, Row, Col} from 'antd';
import {Link} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Demand.less';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
// @connect(state => ({
//   demand: state.demand,
// }))
@Form.create()
export default class Demand extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'demand/fetch',
    //   payload: {
    //     count: 8,
    //   },
    // });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      // dispatch({
      //   type: 'refund/fetch',
      //   payload: values,
      // });
    });
  }

  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.setState({
      formValues: param,
    });
    // dispatch({
    //   type: 'refund/fetch',
    //   payload: values,
    // });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('id')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="需求池类型">
              {getFieldDecorator('status', {
                initialValue: '',
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="">全部</Option>
                  <Option value="1">国内</Option>
                  <Option value="2">国际</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right'}}>
            <Button type="primary" htmlType="submit" style={{marginRight: 6}}>查询</Button>
            <Button type="default" onClick={::this.resetValue}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    // const { demand: { list, loading } } = this.props;
    let data = [
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
    ];
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
        {/*<Link to={'/fightgroups/demand/result'}>*/}
        {/*< Button>查看拼团</Button>*/}
        {/*</Link>*/}
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>

        <div className={styles.cardList}>
          <List
            rowKey="id"
            // loading={loading}
            grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card}
                      actions={[<Link to='/fightgroups/demand/id'>查看历史拼团</Link>,
                        <Link to={'/fightgroups/demand/choose'}><Button type="primary">方案推送</Button></Link>]}
                      title={<span><b className={styles.cardTitle}></b>杭州 - 曼谷323</span>}
                      extra={30}>
                  <Card.Meta
                    description={(
                      <div>
                        <p>3天内需要处理的订单数：12</p>
                        <p>待推方案订单数：12</p>
                        <p>待推方案总人数：12</p>
                        <p>已成团订单数：12</p>
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
