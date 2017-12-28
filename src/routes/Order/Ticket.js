import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, DatePicker, Menu, Dropdown, Button, Upload, Form } from 'antd';
// import numeral from 'numeral';
import Trend from '../../components/Trend';
import NumberInfo from '../../components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import fetch from 'dva/fetch';
import styles from './Analysis.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;


@connect(state => ({
  chart: state.chart,
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }
  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  }
  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  }
  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });
    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  }
  upload = (originData) => {
    let formData = new FormData();
    let a = 'yFnb1L-yqxkEjfjOwiQzb5wsRcIQRoaZUbrhFupD:jQTK9TU-kbECRBHD6k8JxopBDtc=:eyJzY29wZSI6ImFwaW4tdm91Y2hlciIsImRlYWRsaW5lIjoxNTE0NDY3MzU1fQ=='
    formData.append("token", a);
    formData.append('accept', "")
    formData.append("file", originData.file,originData.file.name);
    fetch('http://upload.qiniu.com/', {
      method: "POST",
      // headers: {
      //   // 'Content-Type': `multipart/form-data; boundary=----${}`,
      // },
      body: formData
    }).then((response) => {
        return response.json();
      });
  }
  beforeUpload(file) {
    // var fileURL = file.name.split('.');
    // const isElexce = fileURL[fileURL.length - 1] === 'xlsx' || fileURL[fileURL.length - 1] === "xls"
    // if (!isElexce) {
    //     message.error('只能上传excel文件，格式xlsx与xls');
    // }
    // return isElexce;
  }
  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
      loading,
    } = chart;

    const salesPieData = salesType === 'all' ?
      salesTypeData
      :
      (salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline);

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);


    // const topColResponsiveProps = {
    //   xs: 24,
    //   sm: 12,
    //   md: 12,
    //   lg: 12,
    //   xl: 6,
    //   style: { marginBottom: 24 },
    // };

    return (
      <div>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{ padding: '20px 0 32px 0' }}
          style={{ marginTop: 32 }}
        >

            <Upload
              showUploadList={false}
              beforeUpload={this.beforeUpload}
              customRequest={this.upload}
            >
             <Button type="primary">
              <Icon type="upload" /> 上传
                                    </Button>
            </Upload>
          {/* <Upload
            className="avatar-uploader"
            name="file"
            showUploadList={false}
            beforeUpload={this.beforeUpload.bind(this)}
            onChange={this.handleChange.bind(this)}
          >
            <Button type="primary">
              <Icon type="upload" /> 导入票号
                                    </Button>
          </Upload> */}
          <input id="fileId2" type="file" multiple="multiple" name="file" />
          <Button>
            上传文件
          </Button>
        </Card>
      </div>
    );
  }
}
