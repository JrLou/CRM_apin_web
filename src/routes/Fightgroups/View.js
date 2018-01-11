//查看需求池
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Card, Table, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { getPar, formatPar } from '../../utils/utils';

@connect(state => ({
  view: state.view,
}))
export default class View extends PureComponent {
  constructor(props) {
    super(props)
    this.page = {
      p: 1,
      pc: 10,
    };
    this.par = getPar(this, 'data')
  }

  componentWillMount() {
    const { dispatch } = this.props;
    if (!this.par.cityArr) {
      dispatch(routerRedux.push('/fightgroups/demand/'));
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { cityArr, cityDep } = this.par;
    dispatch({
      type: 'view/fetch',
      payload: { ...this.page, cityDep: cityDep, cityArr: cityArr },
    });
  }

  handleTableChange = (pagination) => {
    const { dispatch } = this.props;
    const params = {
      ...this.page,
      p: pagination.current,
      pc: pagination.pageSize,
    };
    dispatch({
      type: 'view/fetch',
      payload: params,
    });
  };
  render() {
    // const { rule: { loading, list, total } } = this.props;
    // const { modalVisible, record } = this.state;

    const columns = [{
      title: '拼团编号',
      dataIndex: 'id',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text) => {
        const status = ['拼团中', '拼团成功', '拼团完成', '拼团关闭'];
        return status[text];
      },
    }, {
      title: '推送时间',
      dataIndex: 'createTime',
    }, {
      title: '出发机场',
      dataIndex: 'depAirport',
    }, {
      title: '到达机场',
      dataIndex: 'arrAirport',
    }, {
      title: '航班号',
      dataIndex: 'flightNo',
    }, {
      title: '成交人数',
      dataIndex: 'groupCount',
    }, {
      title: '销售价格',
      dataIndex: 'price',
    }, {
      title: '是否成团',
      dataIndex: 'is',
      render: (text, record) => text ? '是' : '否',
    }, {
      title: '操作',
      render: (text, record) => <Link to={'/fightgroups/demand/result/' + record.id}>查看</Link>,
    }];
    const { line } = this.par;
    const { view: { tableData, loading } } = this.props;
    return (
      <PageHeaderLayout>
        <Spin spinning={loading}>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <p style={{ fontSize: 18 }}>{line}</p>
              <p>推荐方案历史:</p>
              <Table
                // dataSource={list}
                dataSource={tableData.data}
                columns={columns}
                pagination={{ showSizeChanger: true, showQuickJumper: true, total: tableData.option && tableData.option.total }}
                onChange={this.handleTableChange}
                rowKey="id"
              />
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
