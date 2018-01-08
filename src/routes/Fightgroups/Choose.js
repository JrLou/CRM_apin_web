import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Modal, Table,Checkbox  } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import {Link} from 'dva/router';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
// @connect(state => ({
//   rule: state.refund,
// }))
@Form.create()
export default class Choose extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    record: {},
    selectedRowKeys: [],
    selectRows:[],
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'refund/fetch',
    // });
  }

  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    // dispatch({
    //   type: 'refund/fetch',
    //   payload: params,
    // });
  };

  handleSearch(){
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      console.log("sss",values);
      // dispatch({
      //   type: 'refund/fetch',
      //   payload: values,
      // });
    });
  }

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record
    });
  }
   onChange=(date, dateString) =>{
    console.log(date, dateString);
  }
  selectChange(selectedRowKeys, selectedRows) {
    let rows = selectedRows.map(row => row.id);
    this.setState({
      selectRows: rows,
      selectedRowKeys: selectedRowKeys
    })
  }
  getCheckBox(){
    let checkBoxArr=[];
    for(let i=0;i<13;i++){
      checkBoxArr.push(<Checkbox key={i} value={i===12?'13-20':i+1}>{i===12?'13-20':i+1}天</Checkbox>);
    }
    return checkBoxArr
  }
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    return (
      <Form layout="inline">
        <Row gutter={20}>
          <Col span={8}>
            <FormItem label="订单号" {...formItemLayout}>
              {getFieldDecorator('id')(
                <Input placeholder="请输入" style={{ width: '100%' }}/>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="起飞时间" {...formItemLayout}>
              {getFieldDecorator('orderId')(
                <RangePicker onChange={this.onChange}  style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem >
          {getFieldDecorator('status', {
            initialValue: '',
          })(
            <span>
                  <Checkbox value={this.state.checkNick}>不限</Checkbox>
                   <Checkbox value={this.state.checkNick}>上午航班(6:00-12:00)</Checkbox>
                   <Checkbox value={this.state.checkNick}>下午航班(12:00-19:00)</Checkbox>
                   <Checkbox value={this.state.checkNick}>晚间航班(19:00-6:00)</Checkbox>
                </span>
          )}
        </FormItem>
        <FormItem label="出行天数" {...formItemLayout}>
          {getFieldDecorator('day', {
            initialValue: '',
          })(
            <span>
                  <Checkbox value={this.state.checkNick}>全选</Checkbox>
                  {this.getCheckBox()}
                </span>
          )}
        </FormItem>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" onClick={::this.handleSearch}>查询</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    // const { rule: { loading, list, total } } = this.props;
    const { modalVisible, record } = this.state;
    let data = [
      {id: 1, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 2, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 3, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 4, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 5, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 6, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
    ];
    const columns = [{
      title: '拼团编号',
      dataIndex: 'id',
    }, {
      title: '推送时间',
      dataIndex: 'status',
      render: (text) => {
        const status = ['已退款', '退款失败'];
        return status[text];
      },
    }, {
      title: '出发机场',
      dataIndex: 'money',
    }, {
      title: '到达机场',
      dataIndex: 'orderId',
    }, {
      title: '航班号',
      dataIndex: 'time',
    }, {
      title: '成交人数',
      dataIndex: 'num',
    }, {
      title: '销售价格',
      dataIndex: 'price',
    }, {
      title: '是否成团',
      dataIndex: 'is',
    }, {
      title: '操作',
      render: (text, record) => <Link to={'/fightgroups/demand/checkFightGroups'}>查看</Link>,
    }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.selectChange.bind(this)
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>

            <Table
              // dataSource={list}
              dataSource={data}
              columns={columns}
              pagination={{ showSizeChanger: true, showQuickJumper: true, }}
              // loading={loading}
              onChange={this.handleTableChange}
              rowKey="id"
              rowSelection={rowSelection}
            />
          </div>
        </Card>
        <Modal
          title="退款申请"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible()}
          footer={null}
        >
          {record && <Form layout="inline">
            <Row>
              <Col span={12}>
                <FormItem label="订单号">
                  {record.orderId}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="退款单号">
                  {record.id}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="退款金额">
                  {record.money}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="处理客服">
                  {record.kefu}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="备注">
                  {record.beizhu}
                </FormItem>
              </Col>
            </Row>
          </Form>}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
