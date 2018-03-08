import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from '../TableList.less';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class LogTableList extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const {
      customerMannagement: { recordData: { data, loading } },
    } = this.props;

    const columns = [
      {
        title: '操作时间',
        dataIndex: 'createTime',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'createUserName',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '操作内容',
        dataIndex: 'record',
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

export default LogTableList;
