import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Table, Divider, Icon, Button, Input, Modal, Badge} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './FlyingpigDetail.less';
import timeHelp from '../../utils/TimeHelp.js';

const {TextArea} = Input;
const confirm = Modal.confirm;
const {Description} = DescriptionList;
const certType = ['身份证', '护照', '港澳通行证', '台胞证'],
  payType = ['线下支付', '支付宝', '微信', '银联'],
  source = ['飞猪', '供应商'],
  status = ['待付款', '订单关闭', '待出票', '已出票', '出票失败'];
@connect(state => ({
  flyingpigDetail: state.flyingpigDetail,
}))
export default class BasicProfile extends Component {
  state = {
    id: this.props.location.state.id || '',
    order_status: this.props.location.state.order_status || 0,
    inputPrice: this.price || 0,
    isEdit: false,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'flyingpigDetail/getDetail',
      payload: {id: this.state.id}
    });
  }

  inputPrice(e) {
    this.setState({
      inputPrice: e.target.value
    })
  }

  isEdit() {
    let {isEdit} = this.state;
    this.setState({
      isEdit: !isEdit
    });
    if (isEdit) {
      alert(1);
    }
  }

  ticketConfirm() {
    confirm({
      title: '是否确认出票?',
      content: '出票后，将无法修改',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  failReason(reason) {
    console.log("提交成功了", reason);
  }

  render() {
    const {inputPrice, isEdit, order_status} = this.state;
    let {flyingpigDetail: {log, order, voyage, passenger, payrecord, loading}} = this.props;
    this.adult_count = order.adult_count || 1;
    this.price = order.settlement_amount;
    //订单信息数据
    const orderColumns = [
      {title: '航班号', dataIndex: 'flight_no', key: 'flight_no',},
      {title: '出发机场', dataIndex: 'airport_dep_name', key: 'airport_dep_name',},
      {title: '到达机场', dataIndex: 'airport_arr_name', key: 'airport_arr_name',},
      {
        title: '出发时间', dataIndex: 'time_dep', key: 'time_dep', render: (text) => {
        return timeHelp.getYMDHMS(text);
      }
      },
      {
        title: '到达时间', dataIndex: 'time_arr', key: 'time_arr', render: (text) => {
        return timeHelp.getYMDHMS(text);
      }
      },
      {
        title: '人数', dataIndex: '6', key: '6', render: () => {
        return this.adult_count
      }
      },
    ];
    //乘机人信息
    const passengerColumns = [
      {title: '姓名', dataIndex: 'cname', key: 'cname'},
      {
        title: '性别', dataIndex: 'gender', key: 'gender', render: (text) => {
        return text == 1 ? '男' : text == 2 ? '女' : '';
      }
      },
      {
        title: '证件类型', dataIndex: 'cert_type', key: 'cert_type', render: (text) => {
        return certType[text - 1];
      }
      },
      {title: '证件号', dataIndex: 'cert_no', key: 'cert_no'},
      {title: '国籍', dataIndex: 'nation', key: 'nation'},
      {
        title: '出生日期', dataIndex: 'birthday', key: 'birthday', render: (text) => {
        let date1 = String(text).substr(0, 4) || '', date2 = String(text).substr(4, 2) || '',
          date3 = String(text).substr(6, 2) || '';
        return date1 + '-' + date2 + '-' + date3
      }
      },
      {title: '证件有效期', dataIndex: 'expire_time', key: 'expire_time'},
      {title: '联系电话', dataIndex: 'phone', key: 'phone'},
      {
        title: '票号', dataIndex: 'ticket', key: 'ticket',
        render: (text, data) => {
          return (<span>
            {
              order_status == 2 ?
                <span>去<Input className={styles.inputTicket}/>返<Input className={styles.inputTicket}/></span>
                :
                order_status == 3 ?
                  <span>去 <span className={styles.showTicket}>lllllllll</span> 返 <span className={styles.showTicket}>333333333</span></span>
                  : null
            }
        </span>
          )
        }
      },
    ];
    //支付信息
    const payColumns = [
      {title: '支付单号', dataIndex: 'id', key: 'id'},
      {title: '付款金额(元)', dataIndex: 'pay_amount', key: 'pay_amount'},
      {
        title: '支付方式', dataIndex: 'pay_type', key: 'pay_type', render: (text) => {
        return payType[text];
      }
      },
      {
        title: '状态', dataIndex: 'payStatus', key: 'payStatus', render: (text) => {
        return text == 1 ? <Badge status="success" text="成功"/> : <Badge status="processing" text="失败"/>
      }
      },
      {title: '支付时间', dataIndex: 'pay_time', key: 'pay_time'},
    ];
    //日志信息
    const logColumns = [
      {title: '操作人', dataIndex: 'operator_name', key: 'operator_name'},
      {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.create_time - b.create_time,
        render: (text) => {
          return timeHelp.getYMDHMS(text)
        }
      },
      {title: '操作内容', dataIndex: 'message', key: 'message'},
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.statusTitle}>
            {status[order_status]}
            {
              order_status == 4 ?
                <FailModal failReason={::this.failReason}/>
                : null
            }
          </div>
          <div className={styles.remarkText}>这里是出票失败备注，这里是出票失败备注。</div>
          <div className={styles.title}><Icon type="profile"/> 订单信息</div>
          <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
            <Description term="订单号">{order.id || ''}</Description>
            <Description term="联系人">{order.contact || ''}</Description>
            <Description term="联系电话">{order.mobile || ''}</Description>
            <Description term="微信昵称">{order.member_name || ''}</Description>
            <Description term="订单来源">{source[order.group_type - 1] || ''}</Description>
            <Description term="资源ID">{order.flight_id || ''}</Description>
          </DescriptionList>
          <div className={styles.myTable}>
            <Table
              pagination={false}
              bordered={true}
              loading={loading}
              dataSource={voyage}
              columns={orderColumns}
              rowKey="id"
            />
          </div>
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="team"/> 乘客信息</div>
          <Table
            pagination={false}
            bordered={true}
            loading={loading}
            dataSource={passenger}
            columns={passengerColumns}
            rowKey="id"
          />
          {
            order_status == 2 ?
              <div className={styles.acticnBtn}><Button type='primary' onClick={::this.ticketConfirm}>出票</Button></div>
              : null
          }
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="red-envelope"/> 支付信息</div>
          {
            order_status == 0 || order_status == 2 ?
              <p style={{margin: '15px 0', height: 100}}>暂无用户支付信息</p> :
              <div>
                <ul className={styles.infoList}>
                  <li>
                    <span className={styles.titleDesc}>机票销售价</span>
                    <span
                      className={styles.priceDesc}>{order.sell_price * this.adult_count}={order.sell_price}(成人价)*{this.adult_count}</span>
                  </li>
                  <li>
                    <span className={styles.titleDesc}>实际结算价</span>
                    <span className={styles.priceDesc}>
                {
                  isEdit ?
                    <Input value={inputPrice} className={styles.inputPrice} min={0} type="number"
                           onChange={::this.inputPrice}/>
                    :
                    <span className={styles.inputPrice}>{inputPrice}</span>
                }
                      <Button type='primary' onClick={::this.isEdit}>{isEdit ? '保存' : '修改'}</Button></span>
                  </li>
                  <li>
                    <span className={styles.titleDesc}>差额</span>
                    <span className={styles.priceDesc}
                          style={{color: (order.sell_price * this.adult_count - inputPrice) > 0 ? '#f00' : ''}}>{order.sell_price * this.adult_count - inputPrice}</span>
                  </li>
                </ul>
                <div className={styles.myTable} style={{marginBottom: '25px'}}>
                  <Table
                    pagination={false}
                    bordered={true}
                    dataSource={payrecord}
                    columns={payColumns}
                    rowKey="id"
                  />
                </div>
              </div>
          }

          <div className={styles.title}><Icon type="form"/> 日志信息</div>
          <Table
            style={{width: '60%'}}
            pagination={false}
            bordered={true}
            dataSource={log}
            columns={logColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

class FailModal extends React.Component {
  state = {
    visible: false,
    textAreaValue: '',
  };

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
    this.props.failReason(this.state.textAreaValue);
    this.hideModal();
  }

  render() {
    let {textAreaValue, visible} = this.state;
    return (
      <div style={{float: 'right'}}>
        <Button type="danger" onClick={::this.showModal}>出票失败</Button>
        <Modal
          title="原因"
          visible={visible}
          onCancel={::this.hideModal}
          footer={[
            <span key="tip" style={{marginRight: 10}}>提交后,将直接退款</span>,
            <Button key="submit" type="primary" onClick={::this.handleOk}>
              提交
            </Button>,
          ]}
        >
          <TextArea rows={4} placeholder="请输入出票失败的原因(非必填)" onChange={::this.textAreaChange} value={textAreaValue}/>
        </Modal>
      </div>
    );
  }
}

