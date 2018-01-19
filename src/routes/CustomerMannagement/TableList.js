import React, {PureComponent} from 'react';
import {connect} from 'dva';
import CookieHelp from '../../utils/cookies';
import {Table, Button} from 'antd';
import styles from './TableList.less';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  constructor(){
    super();
    this.currentUser = CookieHelp.getCookieInfo('_r') ? Base64.decode(CookieHelp.getCookieInfo('_r')) : null;
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  getPageName = () => {
    const {customerMannagement: {pageType}} = this.props;
    return pageType === 's' ? '供应商' : '客户';
  };

  render() {
    const {customerMannagement: {loading, data: {data, option}}, handleShowModalSwitch, page, dispatch} = this.props;
    const isLeader = !!this.currentUser && this.currentUser.split(',').indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;
    const columns = [
      {
        title: `${this.getPageName()}名称`,
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
        title: '操作日期',
        dataIndex: 'updateTime',
        render: text => typeof text === 'string' && text.substring(0, 10)
      },
      {
        title: '操作人',
        dataIndex: 'updateUserName',
      },
      {
        title: '编辑',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div style={{whiteSpace: "nowrap"}}>
              <Button
                disabled={!isLeader}
                type='primary'
                onClick={() => {
                  handleShowModalSwitch('edit');
                  dispatch({
                    type: 'customerMannagement/fetchQueryOne',
                    payload: {id: record.id}
                  })
                }}>
                修改
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                disabled={!isLeader}
                type='primary'
                onClick={() => {
                  handleShowModalSwitch('delete');
                  dispatch({
                    type: 'customerMannagement/extendAll',
                    payload: {deleteItemId: record.id}
                  });
                }}>
                删除
              </Button>
            </div>
          );
        }
      },
    ];
    const pageProps = {
      current: page.pageNum,
      pageSize: page.pageSize,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pageProps,
      total: option,
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