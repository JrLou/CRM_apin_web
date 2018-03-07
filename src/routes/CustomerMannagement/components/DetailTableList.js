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
      customerMannagement: { loading, detailTableData: { data, option } },
      page,
    } = this.props;
    /* cityArr
:
"1"
cityDep
:
null
createUserName
:
"普通客服"
customerName
:
"1"
depDate
:
null
flight
:
""
id
:
"f3c0b2e6a9904896afc21b69cd42da7d"
inquiryDate
:
"2018-01-19"
isPrintStr
:
null
numbers
:
2
printDate
:
"2018-01-19"
profit
:
0
serialNo
:
"2018011812160201"
settlePrice
:
4
supplierName
:
null
ticketStatus
:
1
totalPrice
:
4 */
    const columns = [
      {
        title: `订单号`,
        dataIndex: 'id',
        //width: '12%',
      },
      {
        title: '联系人',
        dataIndex: 'charge',
        //width: '5%',
      },
      {
        title: '客服',
        dataIndex: 'createUserName',
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
        dataIndex: 'wxqq1',
        //width: '11%',
      },
      {
        title: '人数',
        dataIndex: 'wxqq2',
        //width: '11%',
      },
      {
        title: '订单状态',
        dataIndex: 'wxqq3',
        //width: '11%',
      },
      {
        title: '出票日期',
        dataIndex: 'wxqq4',
        //width: '11%',
      },
      {
        title: '卖价总价',
        dataIndex: 'wxqq5',
        //width: '11%',
      },
      {
        title: '结算总价',
        dataIndex: 'totalPrice',
        //width: '11%',
      },
      {
        title: '利润',
        dataIndex: 'profit',
        //width: '11%',
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
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
      total: option.totalCount,
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
