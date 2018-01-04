import React, { PureComponent } from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './TableList.less';

const statusMap = ['default', 'processing', 'success', 'error'];
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

  // handleRowSelectChange = (selectedRowKeys, selectedRows) => {
  //   const totalCallNo = selectedRows.reduce((sum, val) => {
  //     return sum + parseFloat(val.callNo, 10);
  //   }, 0);

  //   if (this.props.onSelectRow) {
  //     this.props.onSelectRow(selectedRows);
  //   }

  //   this.setState({ selectedRowKeys, totalCallNo });
  // }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  // cleanSelectedKeys = () => {
  //   this.handleRowSelectChange([], []);
  // }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['运行中', '选择方案中', '待出票', '已出票', '委托取消', '出票失败', '委托过期'];

    const columns = [
      {
        title: '订单号',
        dataIndex: 'no',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '联系人',
        dataIndex: 'contact',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '出发城市',
        dataIndex: 'goCity',
      },
      {
        title: '到达城市',
        dataIndex: 'backCity',
      },
      {
        title: '出发时间(下单)',
        dataIndex: 'startOff',
        render: val => <span>{moment(val).format('YYYY年MM月DD日')}</span>,
      },
      {
        title: '人数',
        dataIndex: 'money',
        dataIndex: 'numPeople',
      },
      {
        title: '已付金额',
        dataIndex: 'money',
        // sorter: true,
        align: 'right',
        render: val => `￥${val}`,
      },
      {
        title: '下单时间',
        dataIndex: 'updatedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render:(text, record, val) => {
          // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          if (val != '3') {
              return <Link to="/order/entrustProfile/:id">查看</Link>
          } else {
              return <a href="">出票</a>
          }
        }
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: record => ({
    //     disabled: record.disabled,
    //   }),
    // };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          // rowSelection={rowSelection}
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
