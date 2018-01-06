//需求池页面
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Button, List, Form, Input, Select, Row, Col,Pagination } from 'antd';
import {Link} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Demand.less';
const FormItem = Form.Item;
const {Option} = Select;
@connect(state => ({
  demand: state.demand,
}))
@Form.create()
export default class Demand extends PureComponent {
  state = {
    formValues: {},
    page:{
      p:1,
      pageSize:10,
    }
  };
  componentDidMount() {
    this.handleSearch(1,10);
  }
  handleSearch(page,pageSize){
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
        };
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }
        this.setState({
          formValues: values,
        });
        let params=Object.assign({page:page,pageSize:pageSize},values);
        console.log("参数",params);
        dispatch({
          type: 'refund/fetch',
          payload: params,
        });
      }
    });
  };
  resetValue() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.setState({
      formValues: param,
    });
    this.handleSearch(1,10);
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form  layout="inline">
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
            <Button type="primary" style={{marginRight: 6}} onClick={::this.handleSearch}>查询</Button>
            <Button type="default" onClick={::this.resetValue}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }
  pageChange(page,pageSize){
      this.handleSearch(page,pageSize);

  }
  render() {
    const { demand: { list, loading } } = this.props;
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
        <Link to={'/fightgroups/demand/result'}>
        < Button>查看拼团</Button>
        </Link>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </Card>
        <p>共有9个需求池</p>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card}
                      actions={[<Link to='/fightgroups/demand/id'>查看历史拼团</Link>,
                        <Link to={'/fightgroups/demand/choose'}><Button type="primary">方案推送</Button></Link>]}
                      title={<span><b className={styles.cardTitle}></b>杭州 - 曼谷323</span>}
                      extra={30+'人'}>
                  <Card.Meta
                    description={(
                      <div>
                        <p>3天内需要处理的订单数：<span style={{color:'#f00'}}>12</span></p>
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
          <div style={{textAlign:'center'}}>
            <Pagination showSizeChanger onShowSizeChange={::this.pageChange} onChange={::this.pageChange} defaultCurrent={1} total={500} />
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
