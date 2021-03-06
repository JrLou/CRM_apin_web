import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import timeHelp from '../../utils/TimeHelp.js';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import {formatPar} from '../../utils/utils';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
@connect(state => ({
  flyingpigList: state.flyingpigList,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      pagination: {
        p: 1,
        pc: 10,
      },
      timeArr: [],
    };
    this.status = this.props.backpath === 'FlyingPig' ?
      ['待付款', '订单关闭', '待出票', '已出票', '出票失败']
      :
      ['待付款', 'K座中', '方案选择中', '待付尾款', '待出票', '已出票', '出票失败', 'K座过期', 'K座关闭',];
    this.source = ['K座订单', '飞猪', '供应商', '东航'];
    this.typeArray = ["APP", "H5"];
  }

  componentDidMount() {
    let {dispatch, backpath} = this.props;
    let type = backpath === 'Entrust' ? 0 : 12;
    dispatch({
      type: 'flyingpigList/getList',
      payload: {p: 1, pc: 10, group_type: type},
    });
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
      type: 'flyingpigList/getList',
      payload: params,
    });
  }

  handleFormReset() {
    this.props.form.resetFields();
    const param = this.props.form.getFieldsValue();
    this.setState({
      formValues: param,
      pagination: {
        p: 1,
        pc: 10,
      },
      timeArr: [],
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
    const {dispatch, form, backpath} = this.props, {pagination, timeArr} = this.state;
    if (!this.props.flyingpigList.double) {
      form.validateFields((err, fieldsValue) => {
        if (!err) {
          const values = {
            ...fieldsValue,
            'start_time': timeArr[0] || '',
            'end_time': timeArr[1] || '',
          };
          values.group_type = backpath === 'Entrust' ? 0 : 12;
          for (let item in values) {
            if (values[item] === undefined) {
              values[item] = '';
            }
          }
          values.order_status = typeof values.order_status === 'string' ? '' : Number(values.order_status);
          values.supplier_type = values.supplier_type ? Number(values.supplier_type) : '';
          values.source = typeof values.source === 'string' ? '' : Number(values.source);
          this.setState({
            formValues: values,
          });
          let params = Object.assign(pagination, values);
          dispatch({
            type: 'flyingpigList/getList',
            payload: params,
          });
        }

      });
    }
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const layoutForm = {md: 8, lg: 24, xl: 48};
    let {backpath} = this.props;
    return (
      <Form layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('id',
                {
                  rules: [{max: 32, message: "最长32位"}],
                  initialValue: ""
                })
              (<Input placeholder="请输入"/>)
              }
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出发城市">
              {getFieldDecorator('city_dep', {rules: [{max: 32, message: "最长32位"}], initialValue: ""})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="到达城市">
              {getFieldDecorator('city_arr', {rules: [{max: 32, message: "最长32位"}], initialValue: ""})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('order_status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value=''>全部</Option>
                  {
                    this.status.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          {
            backpath !== 'FlyingPig' ? null :
              <Col md={8} sm={24}>
                <FormItem label="资源来源">
                  {getFieldDecorator('supplier_type', {
                    initialValue: ''
                  })(
                    <Select placeholder="请选择" style={{width: '100%'}}>
                      <Option value="" key=''>全部</Option>
                      <Option value='0' key='0'> 供应商</Option>
                      <Option value='1' key='1'>飞猪</Option>
                      <Option value='2' key='2'>东航</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
          }

          <Col md={8} sm={24}>
            <FormItem label="下单时间">
              {getFieldDecorator('start_time')(
                <RangePicker style={{width: '100%'}} onChange={::this.selectTime} disabledDate={(current) => {
                  return current.valueOf() > Date.now()
                }}/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系人">
              {getFieldDecorator('contact', {rules: [{max: 32, message: "最长32位"}], initialValue: ""})(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('mobile', {
                rules: [{max: 32, message: "最长32位"}],
                initialValue: ""
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          {
            backpath !== 'FlyingPig' ? null :
              <Col md={8} sm={24}>
                <FormItem label="订单来源">
                  {getFieldDecorator('source', {
                    initialValue: ''
                  })(
                    <Select placeholder="请选择" style={{width: '100%'}}>
                      <Option value="" key=''>全部</Option>
                      {
                        this.typeArray.map((item, index) => <Option value={index} key={index}>{item}</Option>)
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
          }
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

  render() {
    const {flyingpigList: {loading, data: {data, option}}, backpath} = this.props;
    let Url = backpath === 'FlyingPig' ? '/order/flyingpig/detail/' : '/order/entrust/detail/';
    let title_yyyymm = backpath === 'FlyingPig' ? '出发日期' : '出发日期（发布）';
    let columns = [
      {
        title: '订单号', dataIndex: 'id', render: (text, record) => {
          return <Link
            to={Url + formatPar({id: record.id})}>
            {text}</Link>
        }
      },
      {
        title: '订单状态', dataIndex: 'order_status', render: (text) => {
          return this.status[text];
        },
      },
      {title: '联系人', dataIndex: 'contact', width: '8%'},
      {title: '联系电话', dataIndex: 'mobile',},
      {title: '出发城市', dataIndex: 'city_dep', width: '8%'},
      {title: '到达城市', dataIndex: 'city_arr', width: '8%'},
      {
        title: title_yyyymm, dataIndex: 'dep_yyyymm', render: (text, record) => {
          let date1 = String(text).substr(0, 4) || '', date2 = String(text).substr(4, 2) || '', day = '';
          switch (record.dep_dd) {
            case 0:
              day = '(不限)';
              break;
            case -1:
              day = '(上旬)';
              break;
            case -2:
              day = '(中旬)';
              break;
            case -3:
              day = '(下旬)';
              break;
            default:
              day = backpath === 'FlyingPig' ? `-${record.dep_dd}` : `${record.dep_dd}日`;
          }
          return backpath === 'FlyingPig' ? `${date1}-${date2}${day}` : `${date1}年${date2}月${day}`;
        }
      },
      {
        title: '出发航班号', dataIndex: 'flight_no', render: (text) => {
          let flightArr = text ? text.split('/') : [];
          return flightArr[0] || '';
        }
      },
      {title: '人数', dataIndex: 'adult_count',},
      {
        title: '已付金额', dataIndex: 'payAmount', render: (text) => {
          return '￥' + Number(text) / 100;
        }
      },
      {
        title: '资源来源', dataIndex: 'group_type', render: (text) => {
          return this.source[text];
        }
      },
      {
        title: '订单来源', dataIndex: 'source', render: (text) => {
          return this.typeArray[text];
        },
      }, {
        title: '下单时间', dataIndex: 'create_time', render: (text) => {
          return timeHelp.getYMDHMS(text)
        }
      },
      {
        title: '操作', render: (text, record) => {
          let title = (record.order_status === 4 && backpath === 'Entrust') || (backpath === 'FlyingPig' && record.order_status === 2) ? '出票' : '查看';
          return <Link
            to={Url + formatPar({id: record.id})}>
            {title}</Link>
        }
      }];
    if (backpath === 'Entrust') {
      let arr1 = columns.slice(0, 7), arr2 = columns.slice(8, 10), arr3 = columns.slice(12);
      columns = arr1.concat(arr2, arr3);
    }
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
              rowKey={record => record.id + new Date().getTime()}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
