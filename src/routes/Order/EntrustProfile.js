import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Card, Table, Divider, Icon, Button, Input, Modal, Badge, message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './FlyingpigDetail.less';
import timeHelp from '../../utils/TimeHelp.js';

const {TextArea} = Input;
const confirm = Modal.confirm;
const {Description} = DescriptionList;
const certType = ['身份证', '护照', '港澳通行证', '台胞证'],
  payType = ['线下支付', '支付宝', '微信', '银联'],
  status = ['待付款', '订单关闭', '待出票', '已出票', '出票失败'],
  time_slot = ['不限', '上午(6:00-12:00)', '下午(12:00-19:00)', '晚上(19:00-6:00)', '凌晨'],
  user_status = ['取消', '推送', '接受', '支付超时'];
let id, order_status;
@connect(state => ({
  flyingpigDetail: state.flyingpigDetail,
}))
export default class BasicProfile extends Component {
  state = {
    inputPrice: this.price || 0,
    isEdit: false,
  };

  componentWillMount() {
    const {dispatch} = this.props;
    if (!this.props.location.state) {
      dispatch(routerRedux.push('/order/flyingpig'));
    } else {
      id = this.props.location.state.id;
      order_status = this.props.location.state.order_status;
      dispatch({
        type: 'flyingpigDetail/getDetail',
        payload: {id: id}
      });
    }
  }

  inputPrice(e) {
    this.setState({
      inputPrice: e.target.value
    })
  }

  isEdit() {
    let {isEdit, inputPrice} = this.state;
    const {dispatch, flyingpigDetail: {amountResponse}} = this.props;
    this.setState({
      isEdit: !isEdit
    });
    if (isEdit) {
      dispatch({
        type: 'flyingpigDetail/updateSettleAmount',
        payload: {order_id: this.orderData.id, settlement_amount: Number(inputPrice)}
      });
      if (amountResponse.code > 0) {
        message.success('修改成功');
      } else {
        message.error('修改失败');
        this.setState({
          inputPrice: this.orderData.settlement_amount
        })
      }
    }
  }

  ticketConfirm() {
    let ticketInfo = [], {dispatch, flyingpigDetail: {ticketResponse}} = this.props;
    for (let i = 0; i < this.passengerData.length; i++) {
      let user = this.passengerData[i], ticket = user.ticketDep + ',' + user.ticketArr;
      ticketInfo.push({id: user.id, ticket: ticket})
    }
    let params = {
      group_id: this.orderData.group_id,
      order_id: this.orderData.id,
      ticketInfo: ticketInfo,
    };
    confirm({
      title: '是否确认出票?',
      content: '出票后，将无法修改',
      onOk() {
        dispatch({
          type: 'flyingpigDetail/addTicket',
          payload: {ticketObj: params}
        });
        if (ticketResponse.code > 0) {
          message.success('出票成功');
          dispatch(routerRedux.push('/order/flyingpig'));
        } else {
          message.error('出票失败');
        }
      },
      onCancel() {
      },
    });
  }

  failReason(reason) {
    const {dispatch, flyingpigDetail: {failResponse}} = this.props;
    dispatch({
      type: 'flyingpigDetail/ticketFail',
      payload: {order_id: this.orderData.id, message: reason}
    });
    if (failResponse.code > 0) {
      message.success('修改成功');
    } else {
      message.error('修改失败');
    }
  }

  render() {
    const {inputPrice, isEdit} = this.state;
    let {flyingpigDetail: {log, order, passenger, payrecord, loading, groupVoyage, orderGroup}} = this.props;
    this.adult_count = order.adult_count || 1;
    this.price = order.settlement_amount;
    this.passengerData = passenger;
    this.orderData = order;
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
        render: (text, record) => {
          if (text) {
            let ticketArr = text.split(',');
          }
          return (<span>
            {
              order_status == 2 ?
                <span>
                  去
                  <Input className={styles.inputTicket} onChange={(e) => {
                    record['ticketDep'] = e.target.value;
                  }
                  }/>
                  返
                  <Input className={styles.inputTicket} onChange={(e) => {
                    record["ticketArr"] = e.target.value;
                  }}/>
                </span>
                :
                order_status == 3 ?
                  <span>去 <span className={styles.showTicket}>{ticketArr[0] || ''}</span> 返 <span
                    className={styles.showTicket}>{ticketArr[1] || ''}</span></span>
                  : <span>
                  去
                  <Input className={styles.inputTicket} onChange={(e) => {
                    record['ticketDep'] = e.target.value;
                  }
                  }/>
                  返
                  <Input className={styles.inputTicket} onChange={(e) => {
                    record["ticketArr"] = e.target.value;
                  }}/>
                </span>
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
        title: '支付方式', dataIndex: 'pay_type', key: 'pay_type', render: (text, record) => {
        return record.pay_amount < 0 ? '退款' : payType[text];
      }
      },
      {
        title: '状态', dataIndex: 'status', key: 'status', render: (text) => {
        return <Badge status={text === 3 ? "error" : (text === 1||text===2) ? "success" : ''}
                      text={text === 0 ? "待付款" : (text === 1||text===2)  ? "成功" : text===3?'失败':''}/>
      }
      },
      {title: '支付时间', dataIndex: 'pay_time', key: 'pay_time'},
    ];
    //委托信息
    const groupVoyageColumns = [
      {
        title: '出发目的地', dataIndex: 'city_dep', key: 'city_dep', render: (text, record) => {
        return `${text}-${record.city_arr}`
      }
      },
      {
        title: '出行时间', dataIndex: 'dep_yyyymm', key: 'dep_yyyymm', render: (text, record) => {
        let date1 = String(text).substr(0, 4) || '', date2 = String(text).substr(4, 2) || '', day = '';
        switch (record.dep_dd) {
          case 0:
            day = '';
            break;
          case -1:
            day = '上旬';
            break;
          case -2:
            day = '中旬';
            break;
          case -3:
            day = '下旬';
            break;
          default:
            day = `${record.dep_dd}日`;
        }
        return `${date1}年${date2}月${day}`;
      }
      },
      {
        title: '起飞时间', dataIndex: 'time_slot', key: 'time_slot', render: (text, record) => {
        return time_slot[text];
      }
      },
      {
        title: '出行天数', dataIndex: 'trip_days', key: 'trip_days', render: (text) => {
        return text < 7 ? `${text}天` : '7天及以上'
      }
      },
      {title: '乘机人数', dataIndex: 'adult_count', key: 'adult_count'},
      {
        title: '是否接受微调', dataIndex: 'is_adjust', key: 'is_adjust', render: (text) => {
        return text == 0 ? '不接受' : text == 1 ? '接受' : ''
      }
      },
      {
        title: '提交时间', dataIndex: 'create_time', key: 'create_time', render: (text) => {
        return timeHelp.getYMDHMS(text)
      }
      },
    ];
    //推送方案
    const orderGroupColumns = [
      {
        title: '推送时间', dataIndex: 'create_time', key: 'create_time', render: (text) => {
        return timeHelp.getYMDHMS(text)
      }
      },
      {title: '航班号', dataIndex: 'flight_no', key: 'flight_no',},
      {
        title: '起飞日期', dataIndex: 'date_dep', key: 'date_dep', render: (text, record) => {
        return timeHelp.getYMDHMS(text)
      }
      },
      {
        title: '返回日期', dataIndex: 'date_ret', key: 'date_ret', render: (text) => {
        return timeHelp.getYMDHMS(text)
      }
      },
      {title: '销售价', dataIndex: 'sell_price', key: 'sell_price'},
      {
        title: '用户反馈', dataIndex: 'status', key: 'status', render: (text) => {
        return user_status[text]
      }
      },
      {title: '原因', dataIndex: 'remark', key: 'remark',},
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
          {
            order_status != 6 ? null : <div className={styles.remarkText}>{order.ticket_fail_message || ''}</div>
          }
          <div className={styles.title}><Icon type="profile"/> 订单信息</div>
          <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
            <Description term="订单号">{order.id || ''}</Description>
            <Description term="联系人">{order.contact || ''}</Description>
            <Description term="联系电话">{order.mobile || ''}</Description>
            <Description term="微信昵称">{order.member_name || ''}</Description>
          </DescriptionList>
          {
            order_status != 4 && order_status != 5 && order_status != 6 ?
              null :
              <div>
                <div className={styles.myTable}>
                  <Table
                    pagination={false}
                    bordered={true}
                    loading={loading}
                    dataSource={order.voyage || []}
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
              </div>
          }
          {
            order_status == 4 ?
              <div className={styles.acticnBtn}><Button type='primary' onClick={::this.ticketConfirm}>出票</Button></div>
              : null
          }
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="red-envelope"/> 支付信息</div>
          {
            order_status == 0 ?
              <p style={{margin: '15px 0', height: 100}}>暂无用户支付信息</p> :
              <div>
                {
                  order_status == 1 || order_status == 2 || order_status == 8 || order_status == 3 ?
                    null :
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
                }
                {
                  order_status == 6 ?
                    <ul className={styles.infoList}>
                      <li>
                        <span className={styles.titleDesc}>机票销售价</span>
                        <span
                          className={styles.priceDesc}>{order.sell_price * this.adult_count}={order.sell_price}(成人价)*{this.adult_count}</span>
                      </li>
                    </ul> : null
                }

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
          {
            order_status == 6 ? null :
              <div>
                <Divider style={{marginBottom: 32}}/>
                <div className={styles.title}><Icon type="profile"/> 委托信息</div>
                <Table
                  pagination={false}
                  bordered={true}
                  dataSource={groupVoyage}
                  columns={groupVoyageColumns}
                  rowKey={record => record.create_time + new Date().getTime()}
                />
              </div>
          }

          {
            order_status == 0 || order_status == 1 ?
              null :
              <div>
                <Divider style={{marginBottom: 32}}/>
                <div className={styles.title}><Icon type="profile"/> 推送方案</div>
                <Table
                  style={{width: '60%'}}
                  pagination={false}
                  bordered={true}
                  dataSource={orderGroup}
                  columns={orderGroupColumns}
                  rowKey="id"
                />
              </div>
          }

          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="form"/> 日志信息</div>
          <Table
            style={{width: '60%'}}
            pagination={false}
            bordered={true}
            dataSource={log}
            columns={logColumns}
            rowKey="create_time"
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

