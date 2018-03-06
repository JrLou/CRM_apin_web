import { connect } from 'dva';
import React, { PureComponent } from 'react';
import BasicDetailForm from './components/BasicDetailForm';
import DetailStandardTable from './components/DetailTableList';
import LogTableList from './components/LogTableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SingleBlock from './components/SingleBlock';
import { getPar } from '../../utils/utils';

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

  componentDidMount() {
    this.id = getPar(this, 'id');
    this.props.dispatch({
      type: 'customerMannagement/fetchQueryOne',
      payload: { id: this.id },
    });
    this.props.dispatch({
      type: 'customerMannagement/fetchCustomerList',
      payload: { id: this.id },
    });
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
    const forBasicDetailFormProps = {
      needOperateBtn: false,
      isReadOnly: true,
    };
    return (
      <PageHeaderLayout>
        <BasicDetailForm {...forBasicDetailFormProps} />
        <SingleBlock tab="订单信息">
          <p>共搜索到{3}条数据</p>
          <DetailStandardTable
            onChange={this.handleStandardTableChange}
            page={this.page}
          />
        </SingleBlock>
        <SingleBlock tab="日志信息">
          <LogTableList />
        </SingleBlock>
      </PageHeaderLayout>
    );
  }
}

export default Detail;
