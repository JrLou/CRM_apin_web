//查看需求池
import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';


// @connect(state => ({
//   rule: state.refund,
// }))
export default class View extends PureComponent {
  state = {
    modalVisible: false,
    formValues: {},
    record: {},
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'refund/fetch',
    // });
  }

  handleTableChange = (pagination) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

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

  render() {
    // const { rule: { loading, list, total } } = this.props;
    // const { modalVisible, record } = this.state;

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
    let data = [
      {id: 1, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 2, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 3, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 4, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 5, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
      {id: 6, status: 0, money: 100, orderId: '11111111', time: '2017-1-1', num: 10, price: 200, is: 0},
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <p style={{fontSize: 18}}>杭州 - 北京</p>
            <p>推荐方案历史:</p>
            <Table
              // dataSource={list}
              dataSource={data}
              columns={columns}
              pagination={{showSizeChanger: true, showQuickJumper: true,}}
              // loading={loading}
              onChange={this.handleTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
