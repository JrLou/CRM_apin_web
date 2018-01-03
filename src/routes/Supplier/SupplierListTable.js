import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';

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

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '机票资源号',
        dataIndex: 'no',
      },
      {
        title: '供应商名称',
        dataIndex: 'description',
      },
      {
        title: '出发/回程城市',
        dataIndex: 'callNo',
        align: 'right',
      },
      {
        title: '出发/回程航班',
        dataIndex: 'status',
      },
      {
        title: '航班周期',
        dataIndex: 'updatedAt1',

        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '往返天数',
        dataIndex: 'updatedAt2',

        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '资源负责人',
        dataIndex: 'updatedAt3',

        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'updatedAt4',

        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'updatedAt5',

        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="">配置</a>
            <Divider type="vertical" />
            <a href="">订阅警报</a>
            <Divider type="vertical" />
            <a href="">日志</a>
            <Divider type="vertical" />
            <a href="">上架</a>
          </div>
        ),
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
      <div>
        <div>
        </div>
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
