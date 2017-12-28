import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Divider } from 'antd';
import styles from './FinancePayment.less';
class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };
  render() {
    const { data: { list, pagination }, loading } = this.props;
    const columns = [
      {
        title: '账号名称',
        dataIndex: 'companyName',
      },
      {
        title: '支付单号',
        dataIndex: 'recordId',
      },
      {
        title: '支付金额',
        dataIndex: 'amount',
        // sorter: true,
        // align: 'right',
        // render: val => `${val} 万`,
        //render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '上传凭证时间',
        dataIndex: 'payTime',
      },

    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
