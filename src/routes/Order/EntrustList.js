import React, { PureComponent } from 'react';
import moment from 'moment';
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
    const { data: { data, option }, loading } = this.props;
    const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '订单号',
        dataIndex: 'no',
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          },
          {
            text: status[2],
            value: 2,
          },
          {
            text: status[3],
            value: 3,
          },
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '联系人',
        dataIndex: 'name',
      },
      {
        title: '联系电话',
        dataIndex: 'tel',
      },
      {
        title: '出发城市',
        dataIndex: 'gocity',
      },
      {
        title: '到达城市',
        dataIndex: 'backcity',
      },
      {
        title: '出发时间(下单)',
        dataIndex: 'createdAt',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY年MM月DD日')}</span>,
      },
      {
        title: '人数',
        dataIndex: 'money',
        dataIndex: 'numPeople',
      },
      {
        title: '已付金额',
        dataIndex: 'price',
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
        render:(text, record, index) => {
          // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          if (!record.img_url) {
              return <a href="">查看</a>
          } else {
              return <a href="">出票</a>
          }
        }
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...option,
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
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
