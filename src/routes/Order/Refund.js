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
  Table,
  Modal,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './TableList.less';

const {Description} = DescriptionList;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
@connect(state => ({
  refund: state.refund,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formValues: {},
    pagination: {
      p: 1,
      pc: 10,
    },
    timeArr: [],
    visible: false,
  };

  componentDidMount() {
    this.handleSearch();
  }

  handleTableChange(pagination) {
    this.setState({
      pagination: {
        p: pagination.current,
        pc: pagination.pageSize,
      }
    }, () => {
      this.handleSearch();
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
    const {dispatch, form} = this.props, {pagination, timeArr} = this.state;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...fieldsValue,
          'start_time': timeArr[0] || '',
          'end_time': timeArr[1] || '',
        };
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
          type: 'refund/getList',
          payload: params,
        });
      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    const layoutForm={md: 8, lg: 24, xl: 48};
    return (
      <Form layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="退款单号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('city_dep')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退款状态">
              {getFieldDecorator('order_status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value=''>全部</Option>
                  <Option value='1'>已退款</Option>
                  <Option value='2'>退款失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="退款时间">
              {getFieldDecorator('start_time')(
                <RangePicker style={{width: '100%'}} onChange={::this.selectTime}/>
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

  render() {
    const {refund: {loading, list, total}} = this.props;
    const columns = [
      {title: '退款单号', dataIndex: 'contact',},
      {
        title: '退款状态', dataIndex: 'order_status', render: (text) => {
        return text == 1 ? '已退款' : text == 2 ? '退款失败' : '';
      },
      },
      {
        title: '退款金额', dataIndex: 'payAmount', render: (text) => {
        return '￥' + text;
      }
      },
      {
        title: '订单号', dataIndex: 'id', render: (text, record) => {
        return <a onClick={() => {
          this.refundModal.showModal(true, record.id);
        }}>{text}</a>
      }
      },
      {
        title: '退款时间', dataIndex: 'create_time', render: (text) => {
        return timeHelp.getYMDHMS(text)
      }
      },
      {
        title: '操作', render: (text, record) => {
        return <a onClick={() => {
          this.refundModal.showModal(true, record.id);
        }}>查看</a>
      }
      }];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <Table
              dataSource={list}
              columns={columns}
              pagination={{showSizeChanger: true, showQuickJumper: true, total}}
              loading={loading}
              onChange={::this.handleTableChange}
              rowKey="id"
            />
            <RefundModal ref={(a) => this.refundModal = a}/>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

class RefundModal extends React.Component {
  state = {
    visible: false,
  };

  showModal(isShow, id) {
    this.setState({
      visible: isShow,
    }, () => {
      this.getDetail(id)
    })
  }

  getDetail(id) {
    alert(id);
  }

  hideModal() {
    this.setState({
      visible: false,
    });
  };

  getContent(label, desc, isShow) {
    return <Row>
      <Col span={6} style={{textAlign: 'right'}}>
        {
          isShow ? <span style={{color: '#f00', marginRight: 8}}>*</span> : null
        }
        {label}：
      </Col>
      <Col span={12}>{desc}</Col>
    </Row>
  }

  render() {
    let {visible} = this.state;
    return (
      <Modal
        title="退款申请"
        visible={visible}
        onCancel={::this.hideModal}
        footer={null}
      >
        <div>
          {this.getContent('订单号', '11111111111', false)}
          {this.getContent('退款单号', '11111111111', false)}
          {this.getContent('退款金额', '11111111111', true)}
          {this.getContent('处理客服', '11111111111', true)}
          {this.getContent('备注', '11111111111', false)}
        </div>
      </Modal>
    );
  }
}
