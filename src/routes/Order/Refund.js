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
        values.refund_status = typeof values.refund_status == 'string' ? '' : Number(values.refund_status);
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
    // 1挂起，0未退款，1退款成功，2退款中，3退款失败，4部分成功
    const refund_status=['挂起','未退款','退款成功','退款中','退款失败','部分成功'];
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
              {getFieldDecorator('order_id')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="退款状态">
              {getFieldDecorator('refund_status', {
                initialValue: ''
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value=''>全部</Option>
                  {
                    refund_status.map((item,index)=>{
                      return  <Option value={index - 1} key={index}>{item}</Option>
                    })
                  }
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
      {title: '退款单号', dataIndex: 'id',},
      {
        title: '退款状态', dataIndex: 'refund_status', render: (text) => {
        return refund_status[text + 1];
      },
      },
      {
        title: '退款金额', dataIndex: 'amount', render: (text) => {
        return '￥' + text;
      }
      },
      {
        title: '订单号', dataIndex: 'order_id', render: (text, record) => {
        return <a onClick={() => {
          this.refundModal.showModal(true, record);
        }}>{text}</a>
      }
      },
      {
        title: '退款时间', dataIndex: 'audit_time', render: (text) => {
        return timeHelp.getYMDHMS(text)
      }
      },
      {
        title: '操作', render: (text, record) => {
        return <a onClick={() => {
          this.refundModal.showModal(true, record);
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
              rowKey="order_id"
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
    data:{},
  };

  showModal(isShow, data) {
    this.setState({
      visible: isShow,
      data:data,
    })
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
    let {visible,data} = this.state;
    return (
      <Modal
        title="退款申请"
        visible={visible}
        onCancel={::this.hideModal}
        footer={null}
      >
        <div>
          {this.getContent('订单号', data.order_id||'', false)}
          {this.getContent('退款单号', data.id||'', false)}
          {this.getContent('退款金额', data.amount||'', true)}
          {this.getContent('处理客服', data.audit_user||'', true)}
          {this.getContent('备注', data.refund_reason||'', false)}
        </div>
      </Modal>
    );
  }
}
