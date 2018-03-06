import { connect } from 'dva';
import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BasicDetailForm from './components/BasicDetailForm';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class EditCustomer extends PureComponent {
  render() {
    return (
      <PageHeaderLayout>
        <BasicDetailForm />
      </PageHeaderLayout>
    );
  }
}

export default EditCustomer;
