import React, {Component} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Card, Table, Divider, Icon, Button, Input, Modal, Badge, message} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './FlyingpigDetail.less';
import timeHelp from '../../utils/TimeHelp.js';
import {getPar} from '../../utils/utils';

const {TextArea} = Input;
const confirm = Modal.confirm;
const {Description} = DescriptionList;
const certType = ['身份证', '护照', '港澳通行证', '台胞证'],
  payType = ['线下支付', '支付宝', '微信', '银联'],
  source =  ['委托订单', '飞猪', '供应商', '东航'],
  time_slot = ['不限', '上午(6:00-12:00)', '下午(12:00-19:00)', '晚上(19:00-6:00)', '凌晨'],
  user_status = ['取消', '推送', '接受', '支付超时'],
  typeArray = ["APP", "H5", "WEB"];
let order_status;
@connect(state => ({
  flyingpigDetail: state.flyingpigDetail,
}))
export default class BasicProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputPrice: this.price,
      isEdit: false,
    };
    this.par = getPar(this, 'params');
    this.status = this.props.nameType === 'FlyingPig' ?
      ['待付款', '订单关闭', '待出票', '已出票', '出票失败']
      :
      ['待付款', '委托中', '方案选择中', '待付尾款', '待出票', '已出票', '出票失败', '委托过期', '委托关闭',];
  }


  componentWillMount() {
    this.getDetail();
  }

  getDetail() {
    const {dispatch, backpath} = this.props;
    if (!this.par.id) {
      let url = backpath === 'FlyingPig' ? '/order/flyingpig' : '/order/entrust';
      dispatch(routerRedux.push(url));
    } else {
      dispatch({
        type: 'flyingpigDetail/getDetail',
        payload: {id: this.par.id},
      });
    }
  }

  inputPrice(e) {
    let val = e.target.value, reg = /^\+?[1-9]\d{0,7}$/;
    if (reg.test(val) || !val) {
      this.setState({
        inputPrice: val
      })
    }
  }

  isEdit() {
    let {isEdit, inputPrice} = this.state;
    const {dispatch} = this.props;
    this.setState({
      isEdit: !isEdit
    });
    if (isEdit) {
      if (!inputPrice) {
        message.warning('您尚未输入实际结算价')
      } else {
        dispatch({
          type: 'flyingpigDetail/updateSettleAmount',
          payload: {order_id: this.orderData.id, settlement_amount: Number(inputPrice) * 100},
          callback: (res) => {
            if (res.code >= 1) {
              message.success('修改成功');
            } else {
              message.error('修改失败');
              this.setState({
                inputPrice: this.price
              })
            }
          }
        });
      }
    }
  }

  ticketConfirm() {
    let ticketInfo = [], {dispatch} = this.props;
    let _this = this;
    if (this.passengerData && this.passengerData.length > 0) {
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
            payload: {ticketObj: params},
            callback: (res) => {
              if (res.code >= 1) {
                message.success('出票成功');
                _this.getDetail();
              } else {
                message.error('出票失败');
              }
            }
          });
        },
        onCancel() {
        },
      });
    } else {
      message.warning('没有乘机人不能出票');
    }

  }

  failReason(reason) {
    const {dispatch} = this.props;
    dispatch({
      type: 'flyingpigDetail/ticketFail',
      payload: {order_id: this.orderData.id, message: reason},
      callback: (res) => {
        if (res.code >= 1) {
          message.success('提交成功');
          this.getDetail();
        } else {
          message.error('提交失败');
        }
      }
    });
  }

  ticketChange(e, record, type) {
    if (e.target.value.length < 32) {
      record[type] = e.target.value;
    } else {
      record[type] = e.target.value.slice(0, 32);
    }
  }

  render() {
    const {inputPrice, isEdit} = this.state;
    let {flyingpigDetail: {log, order, passenger, payrecord, loading, groupVoyage, orderGroup}, nameType} = this.props;
    this.adult_count = order.adult_count ? order.adult_count : 1;
    this.price = order.settlement_amount / 100;
    this.passengerData = passenger;
    this.orderData = order;
    order_status = order.status ? order.status : 0;
    let count_middle = Number(order.sell_price) / 100 * this.adult_count;
    let count_little = inputPrice ? count_middle - inputPrice : count_middle;
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
      {title: '证件号码', dataIndex: 'cert_no', key: 'cert_no'},
      {title: '国籍', dataIndex: 'nation', key: 'nation'},
      {title: '出生日期', dataIndex: 'birthday', key: 'birthday'},
      {title: '证件有效期', dataIndex: 'expire_time', key: 'expire_time'},
      {title: '联系电话', dataIndex: 'phone', key: 'phone'},
      {
        title: '票号', dataIndex: 'ticket', key: 'ticket',
        render: (text, record) => {
          if (text) {
            var ticketArr = text.split(',');
            console.log(ticketArr)
          }
          return (<span>
            {
              (nameType == 'FlyingPig' && order_status == 2) || (nameType == 'Entrust' && order_status == 4) ?
                <span>
                  去
                  <Input className={styles.inputTicket} onChange={(e) => {
                    this.ticketChange(e, record, 'ticketDep')
                  }}/>
                  返
                  <Input className={styles.inputTicket} onChange={(e) => {
                    this.ticketChange(e, record, 'ticketArr')
                  }}/>
                </span>
                :
                (nameType == 'FlyingPig' && order_status == 3) || (nameType == 'Entrust' && order_status == 5) ?
                  <span>去 <span
                    className={styles.showTicket}>{ticketArr && ticketArr[0] != "undefined" ? ticketArr[0] : '无'}</span> 返 <span
                    className={styles.showTicket}>{ticketArr && ticketArr[1] != "undefined" ? ticketArr[1] : '无'}</span></span>
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
        {
          title: '付款金额(元)', dataIndex: 'pay_amount', key: 'pay_amount', render: (text) => {
          return Number(text) / 100
        }
        },
        {
          title: '支付方式', dataIndex: 'pay_type', key: 'pay_type', render: (text, record) => {
          return record.pay_amount < 0 ? '退款' : payType[text];
        }
        },
        {
          title: '支付状态', dataIndex: 'status', key: 'status', render: (text) => {
          return <Badge status={text === 3 ? "error" : (text === 1 || text === 2) ? "success" : ''}
                        text={text === 0 ? "待付款" : (text === 1 || text === 2) ? "成功" : text === 3 ? '失败' : ''}/>
        }
        },
        {
          title: '支付时间', dataIndex: 'pay_time', key: 'pay_time', render: (text) => {
          return timeHelp.getYMDHMS(text);
        }
        },
      ]
    ;
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
        return text < 7 ? `${text}天` : '7天及以上';
      }
      },
      {title: '乘机人数', dataIndex: 'adult_count', key: 'adult_count'},
      {
        title: '是否接受微调', dataIndex: 'is_adjust', key: 'is_adjust', render: (text) => {
        return text == 0 ? '不接受' : text == 1 ? '接受' : '';
      }
      },
      {
        title: '提交时间', dataIndex: 'create_time', key: 'create_time', render: (text) => {
        return timeHelp.getYMDHMS(text);
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
      {
        title: '销售价', dataIndex: 'sell_price', key: 'sell_price', render: (text) => {
        return Number(text) / 100
      }
      },
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
            {this.status[order_status] || ''}
            {
              (nameType === 'FlyingPig' && order_status == 2) || (nameType === 'Entrust' && order_status == 4) ?
                <FailModal failReason={::this.failReason}/>
                : null
            }
          </div>
          {
            (nameType === 'FlyingPig' && order_status == 4) || (nameType === 'Entrust' && order_status == 6) ?
              <div className={styles.remarkText}>{order.ticket_fail_message || ''}</div> : null
          }
          <div className={styles.title}><Icon type="profile"/> 订单信息</div>
          <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
            <Description term="订单号">{order.id ? order.id : ''}</Description>
            <Description term="联系人">{order.contact ? order.contact : ''}</Description>
            <Description term="联系电话">{order.mobile ? order.mobile : ''}</Description>
            <Description term="微信昵称">{order.member_name ? order.member_name : ''}</Description>
            <Description
              term={nameType === 'FlyingPig' ? '资源来源' : ''}>{nameType === 'FlyingPig' ? source[order.group_type] : ''}</Description>
            <Description
              term={nameType === 'FlyingPig' ? '资源ID' : ''}>{nameType === 'FlyingPig' ? order.flight_id : ''}</Description>
            <Description
              term={nameType === 'FlyingPig' ? '订单来源' : ''}>{nameType === 'FlyingPig' ? typeArray[order.source] : ''}</Description>
          </DescriptionList>
          {
            (nameType === 'Entrust' && (order_status == 4 || order_status == 5 || order_status == 6 )) || nameType === 'FlyingPig' ?
              <div>
                <div className={styles.myTable}>
                  <Table
                    pagination={false}
                    bordered={true}
                    loading={loading}
                    dataSource={order.voyage ? order.voyage : []}
                    columns={orderColumns}
                    rowKey={record => record.id + record.group_id}
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
                  rowKey={record => record.id + record.order_id}
                />
              </div>
              : null
          }
          {
            (nameType === 'FlyingPig' && order_status == 2) || (nameType === 'Entrust' && order_status == 4) ?
              <div className={styles.acticnBtn}><Button type='primary' onClick={::this.ticketConfirm}>出票</Button></div>
              : null
          }
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="red-envelope"/> 支付信息</div>
          {
            (nameType === 'FlyingPig' && (order_status == 0 || order_status == 1)) || (nameType === 'Entrust' && order_status == 0) ?
              <p style={{margin: '15px 0', height: 100}}>暂无用户支付信息</p> :
              <div>
                {
                  nameType === 'Entrust' && (order_status == 1 || order_status == 2 || order_status == 8 || order_status == 3) ?
                    null :
                    <ul className={styles.infoList}>
                      <li>
                        <span className={styles.titleDesc}>机票销售价</span>
                        <span
                          className={styles.priceDesc}>{count_middle}={Number(order.sell_price) / 100}元(成人价)*{this.adult_count}</span>
                      </li>
                      {
                        (nameType === 'Entrust' && order_status == 6) || (nameType === 'FlyingPig' && order_status == 4) ? null :
                          <li>
                            <span className={styles.titleDesc}>实际结算价</span>
                            <span className={styles.priceDesc}>
                        {
                          isEdit ?
                            <Input value={inputPrice} className={styles.inputPrice} min={1} type="number"
                                   onChange={::this.inputPrice}/>
                            :
                            <span className={styles.inputPrice}>{inputPrice ? inputPrice + '元' : ''}</span>
                        }
                              <Button type='primary' onClick={::this.isEdit}>{isEdit ? '保存' : '修改'}</Button></span>
                          </li>
                      }
                      {
                        (nameType === 'Entrust' && order_status == 6) || (nameType === 'FlyingPig' && order_status == 4) ? null :
                          <li>
                            <span className={styles.titleDesc}>差额</span>
                            <span className={styles.priceDesc}
                                  style={{color: count_little > 0 ? '#f00' : ''}}>{count_little}</span>
                          </li>
                      }
                    </ul>
                }
                <div className={styles.myTable} style={{marginBottom: '25px'}}>
                  <Table
                    pagination={false}
                    bordered={true}
                    dataSource={payrecord ? payrecord : []}
                    columns={payColumns}
                    rowKey={record => record.id + record.pay_time}
                  />
                </div>
              </div>
          }
          {
            (nameType === 'Entrust' && order_status == 6) || nameType === 'FlyingPig' ? null :
              <div>
                <Divider style={{marginBottom: 32}}/>
                <div className={styles.title}><Icon type="profile"/> 委托信息</div>
                <Table
                  pagination={false}
                  bordered={true}
                  dataSource={groupVoyage ? groupVoyage : []}
                  columns={groupVoyageColumns}
                  rowKey={record => record.create_time + new Date().getTime()}
                />
              </div>
          }

          {
            (nameType === 'Entrust' && (order_status == 0 || order_status == 1) ) || nameType === 'FlyingPig' ?
              null :
              <div>
                <Divider style={{marginBottom: 32}}/>
                <div className={styles.title}><Icon type="profile"/> 方案推送记录</div>
                <Table
                  style={{width: '60%'}}
                  pagination={false}
                  bordered={true}
                  dataSource={orderGroup ? orderGroup : []}
                  columns={orderGroupColumns}
                  rowKey={record => record.id + record.create_time}
                />
              </div>
          }

          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="form"/> 日志信息</div>
          <Table
            style={{width: '60%'}}
            pagination={false}
            bordered={true}
            dataSource={log ? log : []}
            columns={logColumns}
            rowKey={record => record.message + record.create_time}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

class FailModal extends React.Component {
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
    let {textAreaValue} = this.state;
    if (textAreaValue.length < 32) {
      this.props.failReason(textAreaValue);
      this.hideModal();
    } else {
      message.warning('出票失败的原因最多32个字')
    }
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
          <span style={{float: 'right'}}><span
            style={{color: textAreaValue.length > 32 ? '#f00' : ''}}>{textAreaValue.length || 0}</span>/32</span>
        </Modal>
      </div>
    );
  }
}

