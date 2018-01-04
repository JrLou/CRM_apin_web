import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Divider } from 'antd';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './UserList.less';
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
    const { data: { data, option }, loading } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '微信昵称',
        dataIndex: 'no',
      },
      {
        title: '头像',
        render:(text, record, index) => {
          // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          if (!record.img_url) {
              return <ImageWrapper className={styles.picTable} src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png" desc="示意图"/>
          } else {
              return <span>无</span>
          }
        }
      },
      {
        title: '绑定手机号',
        dataIndex: 'iphone',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
      },
      {
        title: '最近登录时间',
        dataIndex: 'loginTime',
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...option,
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

export default StandardTable;
