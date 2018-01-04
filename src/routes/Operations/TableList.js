import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Divider } from 'antd';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './Banner.less';
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
    const columns = [
      {
        title: '显示顺序',
        dataIndex: 'id',
      },
      {
        title: '图片名称',
        dataIndex: 'imgName',
      },
      {
        title: '图片',
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
        title: '跳转链接',
        dataIndex: 'goLink',
      },
      {
        title: '有效期',
        dataIndex: 'validity',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '更新时间',
        dataIndex: 'updataTime',
      },
      {
        title: '操作',
        dataIndex: 'do',
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
