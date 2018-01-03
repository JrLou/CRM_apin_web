import React, { Component } from 'react';
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
         飞猪资源
      </PageHeaderLayout>
    );
  }
}
