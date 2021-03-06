import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Table} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import moment from 'moment';
import timeHelp from '../../utils/TimeHelp.js';


const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
const status = ['有效', '失效' ];
@connect(state => ({
  flyPiglist: state.flyPiglist,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props){
    super(props);
    this.getFlight = this.getFlight.bind(this);
  }
  state = {
    formValues: {},
    pagination: {
      p: 1,
      pc: 10,
    },
    id: '',
    timeArr: [],
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleTableChange(pagination) {
    this.page = {
      p: pagination.current,
      pc: pagination.pageSize,
    };
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const params = {
      ...this.page,
      ...formValues,
    };

    dispatch({
      type: 'flyPiglist/fetch',
      payload: params,
    });
    // this.setState({
    //   pagination: {
    //     p: pagination.current,
    //     pc: pagination.pageSize,
    //   }
    // }, () => {
    //   this.handleSearch();
    // });
  }

  handleFormReset() {
    if(this.props.flyPiglist.double){
      return null
    }
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.setState({
      formValues: param,
      pagination: {
        p: 1,
        pc: 10,
      }
    }, () => {
      this.handleSearch();
    });
  };

  selectTime(date, dateString) {
    this.setState({
      timeArr: dateString,
    });
  }

  handleSearch() {
    if(this.props.flyPiglist.double){
      return null
    }
    const {dispatch, form} = this.props, {pagination, timeArr} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
        };
        values.state = Number(values.state);
        for (let item in values) {
          if (values[item] === undefined) {
            values[item] = '';
          }
        }

        this.setState({
          formValues: values,
        });
        let params = Object.assign(pagination, values);
        dispatch({
          type: 'flyPiglist/fetch',
          payload: params,
        });
      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline">
        <Row gutter={{md:8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('cityDep',{rules: [{ max: 32, message: '最长32位' }]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('cityArr',{rules: [{ max: 32, message: '最长32位' }]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="去程航班号">
              {getFieldDecorator('airLineGo',{rules: [{ max: 32, message: '最长32位' }]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="返程航班号">
              {getFieldDecorator('airLineBack',{rules: [{ max: 32, message: '最长32位' }]})
              (
                <Input placeholder="请输入" type="tel"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="资源状态">
              {getFieldDecorator('state', {
                initialValue: '-1'
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value='-1' key='-1'>全部</Option>
                  {
                    status.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="资源ID">
              {getFieldDecorator('id',{rules: [{ max: 32, message: '最长32位' }]})
              (
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" onClick={::this.handleSearch}>查询</Button>
            <Button style={{marginLeft: 8}} onClick={::this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  getFlight(data){
    if(data.flightInfo){
      data.flightInfo.map((item,index)=>{
        if(item.trip_index==0){
          data={
            ...data,
            'time_dep_0':item.time_dep,
            'time_arr_0':item.time_arr,
            'flight_no_0':item.flight_no,
            'flight_company_0':item.flight_company,
          }
        }else{
          data={
            ...data,
            'time_dep_1':item.time_dep,
            'time_arr_1':item.time_arr,
            'flight_no_1':item.flight_no,
            'flight_company_1':item.flight_company,
          }
        }
      });
    }
    return data;
  }

  render() {
    const {flyPiglist: {loading, data: {data, option}}} = this.props;

    const columns = [{
        title: '资源ID',
        dataIndex: 'id',
      }, {
        title: '出发/回程城市',
        dataIndex: 'voyage',
      }, {
        title: '航空公司',
        dataIndex: 'flight_company',
        render:(text,data)=>{
          let record = this.getFlight(data);
          return `${record.flight_company_0}/${record.flight_company_1}`
        }
      }, {
        title: '出发/回程航班号',
        dataIndex: 'flight_no',
        render:(text,data)=>{
          let record = this.getFlight(data);
          return `${record.flight_no_0}/${record.flight_no_1}`
        }
      }, {
        title: '出发日期',
        dataIndex: 'flight_date',
        render:(text,data)=>{
          let record=this.getFlight(data);
          return timeHelp.getYMD(record.flight_date+record.time_dep_0)
        }
      }, {
        title: '出发时刻',
        dataIndex: 'time_dep',
        render:(text,data)=>{
          let record=this.getFlight(data);
          let time_dep_0 = timeHelp.getHM(record.time_dep_0+record.flight_date);
          let time_arr_0 = timeHelp.getHM(record.time_arr_0+record.flight_date);
          return `${time_dep_0}-${time_arr_0}`;
        }
      }, {
        title: '回程日期',
        dataIndex: 'flight_arr',
        render:(text,data)=>{
          let record=this.getFlight(data);
          let flightArr = record.flight_date + record.time_arr_0 + (record.days - 1)*24*60*60*1000;
          return timeHelp.getYMD(flightArr)
        }
      }, {
        title: '回程时刻',
        dataIndex: 'time_arr',
        render:(text,data)=>{
          let record=this.getFlight(data);
          let time_dep_1 = timeHelp.getHM(record.time_dep_1+record.flight_date);
          let time_arr_1 = timeHelp.getHM(record.time_arr_1+record.flight_date);
          return `${time_dep_1}-${time_arr_1}`;
        }
      }, {
        title: '含税价',
        dataIndex: 'sell_price',
        render: val => `￥${val/100}`,
      }, {
        title: '折扣',
        dataIndex: 'discount',
        render: val => `${val}折`,
      }, {
        title: '状态',
        dataIndex: 'is_invalid',
        render: (text) => {
          return status[text];
        },
      }, {
        title: '更新时间',
        dataIndex: 'create_time',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }];

      const page = {
        current: option.current,
        pageSize: option.size,
        total: option.total,
      };
      const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        ...page,
      };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <Table
              dataSource={data}
              columns={columns}
              pagination={paginationProps}
              loading={loading}
              onChange={::this.handleTableChange}
              rowKey="id"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
