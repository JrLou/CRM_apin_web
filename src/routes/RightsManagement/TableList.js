import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Divider, Popconfirm } from 'antd';
import styles from './RoleManage.less';
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
    const TableList = [{
      key: '1',
      id: '24234022342322324234201',
      name: '胡彦斌',
      createdTime: '2017-12-28 00:00:00'
    }, {
      key: '2',
      id: '24234022342322324234202',
      name: '1111',
      createdTime: '2017-12-28 00:00:00'
    }, {
      key: '3',
      id: '24234022342322324234892',
      name: '3333',
      createdTime: '2017-12-28 00:00:00'
    }, {
      key: '4',
      id: '24234022342322324234567',
      name: '7777',
      createdTime: '2017-12-28 00:00:00'
    }];
    const columns = [
      {
        title: '角色ID',
        dataIndex: 'id',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        // sorter: true,
        // align: 'right',
        // render: val => `${val} 万`,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="">编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要配置此角色？" onConfirm={() => this.remove()}>
              <a>配置</a>
            </Popconfirm>
          </div>
        ),
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
          dataSource={TableList}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
