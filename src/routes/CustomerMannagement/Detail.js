import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import BasicDetailForm from './components/BasicDetailForm';
import DetailStandardTable from './components/DetailTableList';
import LogTableList from './components/LogTableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SingleBlock from './components/SingleBlock';
// import { getPar } from '../../utils/utils';

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
    // this.data = getPar(this, 'data');
  }

  componentDidMount() {
    const { id, customerName } = this.props.data;
    this.props.dispatch({
      type: 'customerMannagement/fetchQueryOne',
      payload: { id },
    });
    this.props.dispatch({
      type: 'customerMannagement/fetchCustomerList',
      payload: { customerName },
    });
    this.props.dispatch({
      type: 'customerMannagement/fetchRecordQuery',
      payload: { id },
    });
  }

  componentWillUnmount() {
    //还原redux中相关数据
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/clearDetailTableData',
    });
  }

  handleStandardTableChange = pagination => {
    const { customerName } = this.props.data;
    //分页、排序、筛选变化时触发
    const { dispatch } = this.props;

    Object.assign(this.page, {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });

    dispatch({
      type: 'customerMannagement/fetchCustomerList',
      payload: {
        ...this.page,
        customerName,
      },
    });
  };

  render() {
    const forBasicDetailFormProps = {
      needOperateBtn: false,
      isReadOnly: true,
    };

    const { customerMannagement: { detailTableData: { option } } } = this.props;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button
            type="primary"
            onClick={() => {
              //history.go(-1)
              this.props.toggleCurrPage({ action: 'mainPage' });
            }}
          >
            返回
          </Button>
        </Card>
        <BasicDetailForm {...forBasicDetailFormProps} />
        <SingleBlock tab="订单信息">
          {/* {totalCount: 0, ticketCount: 0} */}
          <p>
            共计{option.totalCount}个订单，其中出票订单{option.ticketCount}个
          </p>
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
