//查看需求池
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Card, Table, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import moment from 'moment';
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
    const { cityArr, cityDep } = this.par;
    const params = {
      ...this.page,
      cityDep: cityDep, cityArr: cityArr,
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
      dataIndex: 'group_status',
      render: (text) => {
        const status = ['拼团关闭', '拼团中', '已完成', '拼团成功'];
        return status[text];
      },
    }, {
      title: '推送时间',
      dataIndex: 'create_time',
      render: (text) => {
        return moment(text).format('YYY-MM-DD HH:mm:ss');
      },
    }, {
      title: '出发机场',
      render: (text, record) => {
        let obj = record.airPortInfo[0] ? record.airPortInfo[0] : {};
        return obj.airport_dep_name;
      },
    }, {
      title: '到达机场',
      render: (text, record) => {
        let obj = record.airPortInfo[0] ? record.airPortInfo[0] : {};
        return obj.airport_arr_name;
      },
    }, {
      title: '航班号',
      render: (text, record) => {
        let obj1 = record.airPortInfo[0] ? record.airPortInfo[0] : {};
        let obj2 = record.airPortInfo[1] ? record.airPortInfo[1] : {};
        return obj1.flight_no && obj2.flight_no ? obj1.flight_no + '/' + obj2.flight_no : '';
      },
    }, {
      title: '拼团人数',
      dataIndex: 'paidMan',
    }, {
      title: '销售价格',
      dataIndex: 'sell_price',
      render: (text, record) => {
        return +text / 100;
      },
    }, {
      title: '是否成团',
      render: (text, record) => {
        return record.group_status == 3 ? '是' : '否';
      },
    }, {
      title: '操作',
      render: (text, record) => <Link to={'/fightgroups/demand/checkFightGroups/' + record.id}>查看</Link>,
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
