import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import styles from '../TableList.less';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class DetailStandardTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const {
      customerMannagement: { pageType, loading, data: { data, option } },
      page,
      dispatch,
    } = this.props;

    const columns = [
      {
        title: `订单号`,
        dataIndex: 'name',
        //width: '12%',
        render: (text, record) => (
          <Link to={`/offline/customerMannagement/detail/${record.id}`}>
            {text}
          </Link>
        ),
      },
      {
        title: '联系人',
        dataIndex: 'charge',
        //width: '5%',
      },
      {
        title: '客服',
        dataIndex: 'address',
        //width: '24%',
      },
      {
        title: '航线',
        dataIndex: 'contacts',
        //width: '12%',
      },
      {
        title: '询价日期',
        dataIndex: 'mobile',
        //width: '14%',
      },
      {
        title: '去程日期',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '人数',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '订单状态',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '出票日期',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '卖价总价',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '结算总价',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '利润',
        dataIndex: 'wxqq',
        //width: '11%',
      },
      {
        title: '供应商',
        dataIndex: 'wxqq',
        //width: '11%',
      },
    ];

    const pageProps = {
      current: page.pageNum,
      pageSize: page.pageSize,
    };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pageProps,
      total: option,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default DetailStandardTable;
