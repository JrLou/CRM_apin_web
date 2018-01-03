import React, { Component } from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';
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
      <div>
        供应商资源
        <Link to={'/supplier/typeIn'}>
          <Button>录入资源</Button>
        </Link>
      </div>
    );
  }
}
