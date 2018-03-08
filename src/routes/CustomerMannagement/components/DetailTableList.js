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

  transferState = ticketStatus => {
    let result = '';
    switch (ticketStatus) {
      case 0:
        result = '等待';
        break;
      case 1:
        result = '成功';
        break;
      case 2:
        result = '失败';
        break;
      default:
        break;
    }
    return result;
  };

  render() {
    const {
      customerMannagement: { loading, detailTableData: { data, option } },
      page,
    } = this.props;
    /*
    订单号            "serialNo": "2018011615425201",
    联系人            "contacts": "aaa",
    客服              "createUserName": "变态管理员",
    航线              "flight": "北京 - 上海",
    询价日期          "inquiryDate": "2018-01-16",
    去程日期          "depDate": "2018-01-16",
    人数              "numbers": 2,
    订单状态          "ticketStatus": 1,    状态，0等待，1成功，2失败
    出票日期          "printDate": "2018-01-16",
    卖价总价          "totalPrice": 1,
    结算总价          "settlePrice": 1,
    利润              "profit": 1,
    供应商            "supplierName": null
    */
    const columns = [
      {
        title: `订单号`,
        dataIndex: 'serialNo',
        //width: '12%',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
        //width: '5%',
      },
      {
        title: '客服',
        dataIndex: 'createUserName',
        //width: '24%',
      },
      {
        title: '航线',
        dataIndex: 'flight',
        //width: '12%',
      },
      {
        title: '询价日期',
        dataIndex: 'inquiryDate',
        //width: '14%',
      },
      {
        title: '去程日期',
        dataIndex: 'depDate',
        //width: '11%',
      },
      {
        title: '人数',
        dataIndex: 'numbers',
        //width: '11%',
      },
      {
        title: '订单状态',
        dataIndex: 'ticketStatus',
        render: record => this.transferState(record),
      },
      {
        title: '出票日期',
        dataIndex: 'printDate',
        //width: '11%',
      },
      {
        title: '卖价总价',
        dataIndex: 'totalPrice',
        //width: '11%',
      },
      {
        title: '结算总价',
        dataIndex: 'settlePrice',
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
