import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Button } from 'antd';
import { Base64 } from 'js-base64';
import CookieHelp from '../../utils/cookies';
import styles from './TableList.less';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  constructor() {
    super();
    this.currentUser = CookieHelp.getCookieInfo('_r')
      ? Base64.decode(CookieHelp.getCookieInfo('_r'))
      : null;
  }

  getPageName = () => {
    const { customerMannagement: { pageType } } = this.props;
    return pageType === 's' ? '供应商' : '客户';
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  //1-沉积客户、2-激活客户、3-活跃客户',
  transferCustomType = typeNum => {
    let result = '';
    switch (typeNum) {
      case 1:
        result = '沉积客户';
        break;
      case 2:
        result = '激活客户';
        break;
      case 3:
        result = '活跃客户';
        break;
      default:
        result = '未知的客户类型';
        break;
    }
    return result;
  };

  render() {
    const {
      customerMannagement: { pageType, loading, data: { data, option } },
      handleShowModalSwitch,
      page,
      dispatch,
    } = this.props;
    const isLeader =
      !!this.currentUser &&
      this.currentUser
        .split(',')
        .indexOf('716103936e1a461ab79dcb7283a979b8') !== -1;

    const columns = [
      //客户（旅行社）
      {
        title: `${this.getPageName()}名称`,
        dataIndex: 'name',
        width: '12%',
        render: (text, record) => {
          const jsonData = {
            id: record.id,
            customerName: record.name,
          };
          const params = JSON.stringify(jsonData);
          return (
            <Link to={`/offline/customerMannagement/detail/${params}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: '客户类型',
        dataIndex: 'type',
        width: '5%',
        render: text => (
          <span style={{ whiteSpace: 'nowrap' }}>
            {this.transferCustomType(text)}
          </span>
        ),
      },
      {
        title: '负责人',
        dataIndex: 'charge',
        width: '5%',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '地址',
        dataIndex: 'address',
        width: '24%',
      },
      {
        title: '主要联系人',
        dataIndex: 'contacts',
        width: '12%',
      },
      {
        title: '电话号码',
        dataIndex: 'mobile',
        width: '14%',
      },
      {
        title: '微信/QQ',
        dataIndex: 'wxqq',
        width: '11%',
      },
      {
        title: '操作日期',
        dataIndex: 'updateTime',
        render: text => (
          <span style={{ whiteSpace: 'nowrap' }}>
            {typeof text === 'string' && text.substring(0, 10)}
          </span>
        ),
      },
      {
        title: '操作人',
        dataIndex: 'updateUserName',
        render: text => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>,
      },
      {
        title: '编辑',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <Link to={`/offline/customerMannagement/edit/${record.id}`}>
                <Button
                  type="primary"
                  onClick={() => {
                    // handleShowModalSwitch('edit');
                    // dispatch({
                    //   type: 'customerMannagement/fetchQueryOne',
                    //   payload: { id: record.id },
                    // });
                  }}
                >
                  修改
                </Button>
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Button
                disabled={!isLeader}
                type="primary"
                onClick={() => {
                  handleShowModalSwitch('delete');
                  dispatch({
                    type: 'customerMannagement/extendAll',
                    payload: { deleteItemId: record.id },
                  });
                }}
              >
                删除
              </Button>
            </div>
          );
        },
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
