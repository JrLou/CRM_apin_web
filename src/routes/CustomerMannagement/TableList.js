import React, {PureComponent} from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {Table, Input, Popconfirm} from 'antd';
import styles from './TableList.less';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const {customerMannagement: {loading, data: {data, option},}} = this.props;
    const columns = [
      {
        title: '微信昵称',
        dataIndex: 'name',
      },
      {
        title: '头像',
        dataIndex: 'avatar',
      },
      {
        title: '绑定手机号',
        dataIndex: 'mobile',
      },
      {
        title: '注册时间',
        dataIndex: 'created_time',
      },
      {
        title: '最近打开时间',
        dataIndex: 'last_open_time',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '140px',
        render: (text, record) => {
          const {editable, isEditing} = record;
          return (
            <div className="editable-row-operations">
              <a onClick={() => {}}>
                修改
              </a>
              <a
                style={{position: "absolute",right: "20px"}}
                onClick={()=>{

                }}
              >
                删除
              </a>
            </div>
          );
        }
      },
    ];
    const page = {
      current: option.current,
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
