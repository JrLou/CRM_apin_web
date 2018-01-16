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
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './TableList.less';
import {formatPar} from '../../utils/utils';

const {Description} = DescriptionList;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
const confirm = Modal.confirm;
const {TextArea} = Input;
const refundStatus = ['退款成功', '退款中', '退款失败'];
@connect(state => ({
  refund: state.refund,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    formValues: {},
    pagination: {
      p: 1,
      pc: 10,
    },
    timeArr: [],
    visible: false,
    orderID: '',
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
    const layoutForm = {md: 8, lg: 24, xl: 48};
    return (
      <Form layout="inline">
        <Row gutter={layoutForm}>
          <Col md={8} sm={24}>
            <FormItem label="退款单号">
              {getFieldDecorator('id', {
                rules: [{max: 32, message: "最长32位"}, {pattern: /^|[0-9][0-9]{0,33}$/, message: '请输入正确的退款单号'}],
                initialValue: ""
              })(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('order_id', {
                rules: [{max: 32, message: "最长32位"}, {pattern: /^|[0-9][0-9]{0,33}$/, message: '请输入正确的订单号'}],
                initialValue: ""
              })(
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
                    refundStatus.map((item, index) => {
                      return <Option value={index + 1} key={index + 1}>{item}</Option>
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

  afreshRefund(id) {
    const {dispatch, refund: {retryResponse}} = this.props;
    confirm({
      title: '请确认是否重新退款?',
      okText: '是',
      cancelText: '否',
      onOk() {
        dispatch({
          type: 'refund/retryRefund',
          payload: {order_id: id},
        });
        if (retryResponse.code > 0) {
          message.success('重新退款提交成功');
          this.handleSearch();
        } else {
          message.error('重新退款提交失败');
        }
      },
      onCancel() {
      },
    });
  }

  failReason(params) {
    const {dispatch, refund: {offlineResponse}} = this.props;
    dispatch({
      type: 'refund/offlineRefund',
      payload: {...params},
    });
    if (offlineResponse.code > 0) {
      message.success('线下退款提交成功');
      this.handleSearch();
    } else {
      message.error('线下退款提交失败');
    }
  }

  render() {
    const {refund: {loading, list, total}} = this.props;
    const columns = [
      {title: '退款单号', dataIndex: 'id',},
      {
        title: '退款状态', dataIndex: 'refund_status', render: (text) => {
        return refundStatus[text - 1];
      },
      },
      {
        title: '退款金额', dataIndex: 'amount', render: (text) => {
        text = text ? String(text).substr(1) : '';
        return Number(text)/100;
      }
      },
      {
        title: '订单号', dataIndex: 'order_id', render: (text, record) => {
        let Url = record.group_type == 0 ? '/order/entrust/detail/' : '/order/flyingpig/detail/';
        return <Link
          to={Url + formatPar({id: record.order_id})}>
          {text}</Link>
      }
      },
      {
        title: '退款时间', dataIndex: 'audit_time', render: (text) => {
        return text ? timeHelp.getYMDHMS(text) : ''
      }
      },
      {
        title: '操作', render: (text, record) => {
        return <span>
          {
            record.refund_status != 3 ? null :
              <span>
                 <a onClick={this.afreshRefund.bind(this, record.id)}>重新退款</a>
                 <OfflineModal failReason={::this.failReason} data={record}/>
              </span>
          }

          <a onClick={() => {
            this.refundModal.showModal(true, record);
          }}>查看</a>

        </span>
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
              rowKey={record => record.order_id + Math.random() * 100 + record.audit_time}
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
    data: {},
  };

  showModal(isShow, data) {
    this.setState({
      visible: isShow,
      data: data,
    })
  }

  hideModal() {
    this.setState({
      visible: false,
    });
  };

  getContent(label, desc, isShow, txt) {
    return <Row style={{margin: '15px 0'}}>
      <Col span={6} style={{textAlign: 'right'}}>
        {
          isShow ? <span style={{color: '#f00', marginRight: 8}}>*</span> : null
        }
        {label}：
      </Col>
      <Col span={12}>{desc}{txt}</Col>
    </Row>
  }

  render() {
    let {visible, data} = this.state;
    let price = data.amount ? String(data.amount).substr(1) : null;
    let priceRel=Number(price)/100;
    return (
      <Modal
        title="退款申请"
        visible={visible}
        onCancel={::this.hideModal}
        footer={null}
        key={new Date().getTime().toString()}
      >
        <div>
          {this.getContent('订单号', data.order_id || '', false)}
          {this.getContent('退款单号', data.id || '', false)}
          {this.getContent('退款金额', priceRel, true, '元')}
          {this.getContent('处理客服', data.audit_user || '', true)}
          {this.getContent('备注', data.refund_reason || '', false)}
        </div>
      </Modal>
    );
  }
}

class OfflineModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      textAreaValue: '',
    }
  }

  showModal() {
    this.setState({
      visible: true,
      textAreaValue: '',
    });
  };

  hideModal() {
    this.setState({
      visible: false,
    });
  };

  textAreaChange(e) {
    this.setState({
      textAreaValue: e.target.value,
    })
  }

  handleOk() {
    let {data, failReason} = this.props, {textAreaValue} = this.state;
    if (textAreaValue.length < 32) {
      failReason({'message': textAreaValue, 'order_id': data.order_id, 'pay_id': data.id});
      this.hideModal();
    } else {
      message.warning('线下退款的原因最多32个字')
    }
  }

  render() {
    let {textAreaValue, visible} = this.state;
    return (
      <div style={{display: 'inline', margin: '0 8px'}}>
        <a onClick={::this.showModal}>线下退款</a>
        <Modal
          title="原因"
          visible={visible}
          onCancel={::this.hideModal}
          footer={[
            <Button key="submit" type="primary" onClick={::this.handleOk}>
              提交
            </Button>,
          ]}
        >
          <TextArea rows={4} placeholder="请输入线下退款的原因（非必填）" onChange={::this.textAreaChange} value={textAreaValue}/>
          <span style={{float: 'right'}}><span
            style={{color: textAreaValue.length > 32 ? '#f00' : ''}}>{textAreaValue.length || 0}</span>/32</span>
        </Modal>
      </div>
    );
  }
}
