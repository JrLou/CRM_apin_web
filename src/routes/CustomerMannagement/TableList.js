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
    const {customerMannagement: {loading, data: {data, option},}, handleShowModalSwitch, page, dispatch} = this.props;
    const columns = [
      {
        title: '旅行社名称',
        dataIndex: 'name',
      },
      {
        title: '地址',
        dataIndex: 'address',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
      },
      {
        title: '电话号码',
        dataIndex: 'mobile',
      },
      {
        title: '微信/QQ',
        dataIndex: 'wxqq',
      },
      {
        title: '新增日期',
        dataIndex: 'createTime',
      },
      {
        title: '操作人',
        dataIndex: 'updateUserName',
      },
      {
        title: '编辑',
        dataIndex: 'operation',
        width: '140px',
        render: (text, record) => {
          const {editable, isEditing} = record;
          return (
            <div className="editable-row-operations">
              <a
                onClick={() => {
                  handleShowModalSwitch('edit');
                  dispatch({
                    type: 'customerMannagement/fetchQueryOne',
                    payload: {id: record.id}
                  })
                }}>
                修改
              </a>
              <a
                style={{position: "absolute", right: "20px"}}
                onClick={() => {
                  handleShowModalSwitch('delete');
                  dispatch({
                    type: 'customerMannagement/extendAll',
                    payload: {deleteItemId: record.id}
                  })
                }}>
                删除
              </a>
            </div>
          );
        }
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...page,
      total: option,
    };
    console.log("page", page);
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
