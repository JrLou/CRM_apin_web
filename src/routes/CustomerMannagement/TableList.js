import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Table} from 'antd';
import ImageWrapper from '../../components/ImageWrapper';
import TimeHelp from '../../utils/TimeHelp.js';
import logo from '../../assets/logo.png';
import styles from './TableList.less';


@connect(state => ({
  userList: state.userList,
}))
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
    const {data: {data, option}, loading} = this.props;
    const columns = [
      {
        title: '微信昵称',
        dataIndex: 'name',
      },
      {
        title: '头像',
        render: (text, record, index) => {// 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          if (!record.avatar) {
            return <ImageWrapper className={styles.picTable} src={logo} desc="示意图"/>
          } else {
            return <ImageWrapper className={styles.picTable} src={text.avatar} desc="用户头像"/>
          }
        }
      },
      {
        title: '绑定手机号',
        dataIndex: 'mobile',
      },
      {
        title: '注册时间',
        dataIndex: 'created_time',
        render: (text, record, index) => {
          return <span>{TimeHelp.getYMDHMS(text)}</span>
        }
      },
      {
        title: '最近打开时间',
        dataIndex: 'last_open_time',
        render: (text, record, index) => {
          return <span>{TimeHelp.getYMDHMS(text)}</span>
        }
      },
    ];
    const page = {
      current:option.current,
      pageSize: option.size,
      total: option.total,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...page,
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
