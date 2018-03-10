import { connect } from 'dva';
import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BasicDetailForm from './components/BasicDetailForm';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class AddCustomer extends PureComponent {
  componentWillUnmount() {
    //还原redux中modal的数据
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/clearFormData',
    });
  }

  render() {
    return (
      <PageHeaderLayout>
        <BasicDetailForm {...this.props} />
      </PageHeaderLayout>
    );
  }
}

export default AddCustomer;
