import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import BasicDetailForm from './components/BasicDetailForm';
import DetailStandardTable from './components/DetailTableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SingleBlock from './components/SingleBlock';

const { TabPane } = Tabs;
@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class Detail extends PureComponent {
  constructor(props) {
    super(props);
    this.page = {
      pageNum: 1,
      pageSize: 10,
    };
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    //分页、排序、筛选变化时触发
    const { dispatch } = this.props;

    Object.assign(this.page, {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });

    dispatch({
      type: 'customerMannagement/fetch',
      payload: {
        ...this.page,
        ...this.state.formValues,
      },
    });
  };

  render() {
    return (
      <PageHeaderLayout>
        <BasicDetailForm />
        <SingleBlock tab="订单信息">
          <p>共搜索到{3}条数据</p>
          <DetailStandardTable
            onChange={this.handleStandardTableChange}
            page={this.page}
          />
        </SingleBlock>
      </PageHeaderLayout>
    );
  }
}

export default Detail;
