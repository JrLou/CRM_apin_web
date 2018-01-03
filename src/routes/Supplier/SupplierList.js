import React, { Component } from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker,
  message
} from 'antd';
export default class Analysis extends Component {
  render() {
    return (
      <PageHeaderLayout>
        供应商资源
        <Link to={'/supplier/supplierList/typeIn'}>
          <Button>录入资源</Button>
        </Link>
        <Link to={'/supplier/supplierList/edit'}>
          <Button>编辑资源</Button>
        </Link>
        <Link to={'/supplier/supplierList/price'}>
          <Button>航班库存价格</Button>
        </Link>
      </PageHeaderLayout>
    );
  }
}
