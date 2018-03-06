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
    const { customerMannagement: { loading, data: { data } } } = this.props;

    const columns = [
      {
        title: '操作时间',
        dataIndex: 'address',
      },
      {
        title: '操作人',
        dataIndex: 'contacts',
      },
      {
        title: '操作内容',
        dataIndex: 'mobile',
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
        />
      </div>
    );
  }
}

export default LogTableList;
