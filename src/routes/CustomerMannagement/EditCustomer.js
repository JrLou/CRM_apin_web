import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BasicDetailForm from './components/BasicDetailForm';
import { getPar } from '../../utils/utils';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class EditCustomer extends PureComponent {
  componentDidMount() {
    this.id = getPar(this, 'id');
    this.props.dispatch({
      type: 'customerMannagement/fetchQueryOne',
      payload: { id: this.id },
    });
  }
  render() {
    const { loading } = this.props.customerMannagement;
    return (
      <Spin spinning={loading}>
        <PageHeaderLayout>
          <BasicDetailForm isEdit id={this.id} />
        </PageHeaderLayout>
      </Spin>
    );
  }
}

export default EditCustomer;
