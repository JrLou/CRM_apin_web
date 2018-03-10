import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BasicDetailForm from './components/BasicDetailForm';
// import { getPar } from '../../utils/utils';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class EditCustomer extends PureComponent {
  componentDidMount() {
    // this.id = getPar(this, 'id');
    this.props.dispatch({
      type: 'customerMannagement/fetchQueryOne',
      payload: { id: this.props.id },
    });
  }

  componentWillUnmount() {
    //还原redux中modal的数据
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/clearFormData',
    });
  }

  render() {
    const { loading } = this.props.customerMannagement;
    return (
      <PageHeaderLayout>
        <Spin spinning={loading}>
          <BasicDetailForm isEdit {...this.props} />
        </Spin>
      </PageHeaderLayout>
    );
  }
}

export default EditCustomer;
