import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, Spin, Table, Divider, Icon, Row, Col, Button, message, Popover} from 'antd';
import {CloseReasonModal, SendLogModal, ExportPassengerModal} from './components/ModalCpm';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './CheckFightGroups.less';
import {getPar, formatPar, formatDate} from '../../utils/utils';

const {Description} = DescriptionList;

const logInfoColumns = [{
  title: '操作时间',
  dataIndex: 'create_time',
  width: '25%',
}, {
  title: '操作员',
  dataIndex: 'user_name',
  width: '25%',
}, {
  title: "操作内容",
  dataIndex: 'create_content',
  width: '50%',
}];


@connect(state => ({
  checkFightGroups: state.checkFightGroups,
}))
export default class CheckFightGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalType: 0,//控制哪个模态框弹出：0 => 关闭拼团， 1 => 查看日志， 2=> 导出乘机人
      closeReason: '',//关闭原因，保存在本页，不存在redux中
    };
    this.id = getPar(this, 'id');
  }

  componentDidMount() {
    this.loadInitPageData();
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    //还原redux 中的checkFightGroups的state
    dispatch({
      type: 'checkFightGroups/clear',
    });
  }

  loadInitPageData = () => {
    const {dispatch} = this.props;
    dispatch({// 获取拼团信息
      type: 'checkFightGroups/fetchGroupsInfo',
      payload: {id: this.id},
    });
    dispatch({// 获取订单信息
      type: 'checkFightGroups/fetchGroupOrders',
      payload: {
        id: this.id,
        state: -1,//[-1, 空] => all
        p: 1,
        pc: 1000,//目前不分页，但是后台是按这种形式写的接口
      },
    });
    dispatch({// 获取方案明细
      type: 'checkFightGroups/fetchDetailGroupVoyage',
      payload: {id: this.id},
    });
    dispatch({// 获取日志信息
      type: 'checkFightGroups/fetchGroupLogs',
      payload: {
        uuid: this.id,
        p: 1,
        pc: 1000,//目前不分页，但是后台是按这种形式写的接口
      },
    });
  };

  mapGroupStateToTxt(group_status) {
    let txt = "";
    switch (group_status) {
      case 0:
        txt = "拼团关闭";
        break;
      case 1:
        txt = "拼团中";
        break;
      case 2:
        txt = "拼团成功";
        break;
      case 3:
        txt = "拼团完成";
        break;
      default:
        txt = "未知的拼团状态";
        break;
    }
    return txt;
  };

  getFightGroupsInfoView() {
    const {groupsInfoData: {data, code, msg}, groupsInfoLoading} = this.props.checkFightGroups;

    const create_time = formatDate(data.create_time, 'YYYY-MM-DD HH:mm');

    const expired_time = formatDate(data.expired_time, 'YYYY-MM-DD HH:mm');

    const group_status = this.mapGroupStateToTxt(data.group_status);
    const city_dep = data.city_dep;
    const city_arr = data.city_arr;
    const date_dep = formatDate(data.date_dep, 'YYYY-MM-DD');
    const date_ret = formatDate(data.date_ret, 'YYYY-MM-DD');


    const paidMan = +data.paidMan;
    const creator_name = data.creator_name;


    return (
      <div className={styles.outFightGropuInfoContainer}>
        <div className={styles.title}>
          <Icon type="profile"/>&nbsp;
          <span>拼团信息</span>
          <Button
            type="primary"
            className={styles.btn}
            disabled={data.group_status !== 3 || groupsInfoLoading}
            onClick={() => {
              this.setState({modalType: 0}, () => {
                this.handleshowModal()
              });
            }}
          >
            关闭拼团
          </Button>
        </div>
        <Spin spinning={groupsInfoLoading}>
          <div className={styles.fightGropuInfoContainer}>
            <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
              <Description term="拼团单号">{this.id}</Description>
              <Description term="拼团状态">{group_status}</Description>
              <Description term="出发城市">{city_dep}</Description>
              <Description term="到达城市">{city_arr}</Description>
              <Description term="起飞日期">{date_dep}</Description>
              <Description term="返回日期">{date_ret}</Description>
              <Description term="方案提交时间">{create_time}</Description>
              <Description term="方案过期时间">{expired_time}</Description>
              <Description term="支付人数">{paidMan}人</Description>
              <Description term="处理客服">{creator_name}</Description>
            </DescriptionList>
          </div>
        </Spin>
      </div>
    );
  }

  getDataSource(data) {
    const mapOrder_statusToTxt = (order_status) => {
      let txt = '';
      switch (order_status) {//状态（0取消，1推送，2接受，3支付超时）
        case 10:
          txt = '待付款';
          break;
        case 11:
        case 12:
          txt = '订单关闭';
          break;
        case 21:
        case 31:
          txt = '委托关闭';
          break;
        case 20:
        case 34:
        case 43:
        case 44:
          txt = '委托中';
          break;
        case 22:
        case 32:
        case 41:
        case 42:
          txt = '委托过期';
          break;
        case 30:
          txt = '委托选择中';
          break;
        case 40:
          txt = '待付款';
          break;
        case 50:
          txt = '待出票';
          break;
        case 51:
          txt = '出票失败';
          break;
        case 60:
          txt = '已出票';
          break;
      }
      return txt;
    };
    return data.map(currV => ({
        ...currV,
        order_status: mapOrder_statusToTxt(currV.order_status)
      })
    );
  };

  getGroupOrdersColumns() {
    return [
      {
        title: '订单号',
        dataIndex: 'id',
        render: (text, record, index) => {//生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          const isRefuse = record.status === 0;
          const popoverContent = (
            <div>
              <p>原因：</p>
              <p>{record.remark}</p>
            </div>
          );
          const orderIdContent = (
            <Link
              to={'/order/entrust/detail/' + formatPar({id: text})}>
              {text}
            </Link>
          );
          return (
            <span style={{whiteSpace: "nowrap"}}>
              {
                isRefuse ?
                  <Popover content={popoverContent} title="不接受">
                    <Icon type="frown-o"/>&nbsp;&nbsp;
                  </Popover>
                  : null
              }
              <span>{orderIdContent}</span>
            </span>
          );
        }
      }, {
        title: '订单状态',
        dataIndex: 'order_status',
        // render: renderContent,
      }, {
        title: '联系人',
        dataIndex: 'contact',
        // render: renderContent,
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
        // render: renderContent,
      }, {
        title: '订单人数',
        dataIndex: 'adult_count',
      }, {
        title: '推送次数',
        dataIndex: 'amount',
      }, {
        title: '操作',
        dataIndex: 'action',
        render: (text, record, index) => {//生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          return (
            <a
              style={{whiteSpace: "nowrap"}}
              onClick={() => {
                this.setState({modalType: 1}, () => {
                  this.handleshowModal();

                  //发起请求，获取订单推送日志
                  const {dispatch} = this.props;
                  dispatch({
                    type: 'checkFightGroups/fetchPublishLogs',
                    payload: {
                      id: record.id,
                      p: 1,
                      pc: 1000,
                    },
                  });
                });
              }}>
              推送日志
            </a>
          );
        },
      }
    ];
  }

  getOrderInfoView() {
    const {
      groupOrdersData: {data, code, msg},
      groupOrdersLoading,
      groupsInfoData: {data: groupsInfoDataData},
    } = this.props.checkFightGroups;
    const groupOrdersColumns = this.getGroupOrdersColumns();

    //传递给《添加订单》页面的params
    let params = {
      id: this.id,
      continueFlag: true,
      cityArr: groupsInfoDataData.city_arr,
      cityDep: groupsInfoDataData.city_dep
    };
    params = formatPar(params);

    const dataSource = this.getDataSource(data);

    return (
      <div className={styles.orderInfoContainer}>
        <div className={styles.title}><Icon type="idcard"/>&nbsp;
          <span>订单信息</span>
          <Button
            type="primary"
            className={styles.btn}
            onClick={() => {
              this.setState({modalType: 2}, () => {
                this.handleshowModal();
                //发起请求，获取拼团下成功支付的乘机人信息
                const {dispatch} = this.props;
                dispatch({
                  type: 'checkFightGroups/fetchPaidMember',
                  payload: {uuid: this.id}
                });
              });
            }}
          >
            批量导出乘机人 / 出票
          </Button>
          <Link to={'/fightgroups/demand/choose/' + params}>
            <Button
              type="primary"
              className={styles.btn}
              disabled={groupsInfoDataData.group_status !== 1}
            >
              继续添加订单
            </Button>
          </Link>
        </div>
        <Table
          style={{marginBottom: 24, position: 'relative'}}
          pagination={false}
          loading={groupOrdersLoading}
          dataSource={dataSource}
          columns={groupOrdersColumns}
          rowKey="id"
        />
      </div>
    )
      ;
  }

  getDetailGroupVoyage() {
    const {
      detailGroupVoyage: {data, code, msg},
      detailGroupVoyageLoading,
      groupsInfoData: {data: groupsInfoDataData},
    } = this.props.checkFightGroups;

    const expired_hour = ( (groupsInfoDataData.expired_time - groupsInfoDataData.create_time) / (1000 * 60 * 60) ).toFixed(1, 10);
    const sell_price = ( (groupsInfoDataData.sell_price) / 100 ).toFixed(2, 10);
    const goFlightInfo = data.filter(currV => currV.trip_index === 0)[0] || {};
    const backFlightInfo = data.filter(currV => currV.trip_index === 1)[0] || {};
    const time_dep = formatDate(groupsInfoDataData.date_dep, 'YYYY-MM-DD');
    const time_arr = formatDate(groupsInfoDataData.date_ret, 'YYYY-MM-DD');

    return (
      <div>
        <div className={styles.title}><Icon type="schedule"/>&nbsp;方案明细</div>
        <Spin spinning={detailGroupVoyageLoading}>
          <div className={styles.schemeInfo}>
            <DescriptionList size="large" style={{marginBottom: 32}} col={2}>
              <Description term="起飞日期">{time_dep}</Description>
              <Description term="返回日期">{time_arr}</Description>
            </DescriptionList>
            <div className={styles.descAir}>
              <SingleFightView data={goFlightInfo}/>
            </div>
            <div className={styles.descAir} style={{marginLeft: '40px'}}>
              <SingleFightView data={backFlightInfo}/>
            </div>
            <DescriptionList size="large" style={{marginTop: 32}} col={2}>
              <Description term="销售价格">{sell_price || "未知价格"} 元 / 人</Description>
              <Description term="方案有效时间">{expired_hour} 小时</Description>
              <Description term="折扣">{groupsInfoDataData.discount}折</Description>
            </DescriptionList>
          </div>
        </Spin>
      </div>
    );
  }

  getLogInfoView() {
    const {groupLogs: {code, data, msg}, groupLogsLoading} = this.props.checkFightGroups;
    const dataSource = data.map(currV => ({
      ...currV,
      create_time: formatDate(currV.create_time, 'YYYY-MM-DD HH:mm:ss'),
    }));

    return (
      <div>
        <div className={styles.title}><Icon type="form"/>&nbsp;日志信息</div>
        <Table
          loading={groupLogsLoading}
          style={{marginBottom: 16, width: '60%', minWidth: '850px'}}
          pagination={false}
          dataSource={dataSource}
          columns={logInfoColumns}
          rowKey="id"
        />
      </div>
    );
  }

  getCloseFightGroupsModal(showModal, modalConfirmLoading) {
    return (
      <CloseReasonModal
        title="请确认是否关闭拼团，关闭请输入原因："
        visible={showModal}
        onOk={this.handleOk.bind(this)}
        okText={'保存'}
        onCancel={this.handleCancel.bind(this)}
        confirmLoading={modalConfirmLoading}
        maskClosable={false}
        closeReason={this.state.closeReason}
        onChange={(value) => {
          if (value.length <= 100) {
            this.setState({closeReason: value});
          }
        }}
      />
    );
  }

  getSendLogModal(showModal, modalConfirmLoading) {
    return (
      <SendLogModal
        visible={showModal}
        width={920}
        changeVisible={this.handleCancel.bind(this)}
      />
    );
  }

  getExportPassengerModal(showModal) {
    return (
      <ExportPassengerModal
        id={this.id}
        visible={showModal}
        width={920}
        changeVisible={this.handleCancel.bind(this)}
        maskClosable={false}
      />
    );
  }

  switchModalView() {
    const {showModal, modalConfirmLoading} = this.props.checkFightGroups;
    let ModalView = null;
    switch (this.state.modalType) {
      case 0:
        ModalView = this.getCloseFightGroupsModal(showModal, modalConfirmLoading);
        break;
      case 1:
        ModalView = this.getSendLogModal(showModal, modalConfirmLoading);
        break;
      case 2:
        ModalView = this.getExportPassengerModal(showModal, modalConfirmLoading);
        break;
      default:
        ModalView = null;
        break;
    }
    return ModalView;
  }

  handleshowModal() {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/extendAll',//modalConfirmLoading
      payload: {showModal: true},//传过去的参数
    });
  }

  handleOk(e) {
    if (!this.state.closeReason.trim()) {
      message.warning("请输入关闭拼团原因");
      return;
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/fetchPlanClose',
      payload: {//传过去的参数
        reason: this.state.closeReason,
        id: this.id,
      },
      succCB: () => this.loadInitPageData(),
    });
  }

  handleCancel(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/extendAll',
      payload: {showModal: false},//传过去的参数
    });
    //关闭的时候，清除modalData以防报错
    dispatch({
      type: 'checkFightGroups/resetModalData',
      payload: {
        modalData: {
          code: '',
          data: [],
          msg: '',
        }
      }
    });
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false} style={{overflow:'hidden'}}>
          {/*拼团信息*/}
          {this.getFightGroupsInfoView()}
          <Divider style={{marginBottom: 32}}/>

          {/*订单信息*/}
          {this.getOrderInfoView()}
          <Divider style={{marginBottom: 32}}/>

          {/*方案明细*/}
          {this.getDetailGroupVoyage()}
          <Divider style={{marginBottom: 32}}/>

          {/*日志信息*/}
          {this.getLogInfoView()}

          {/*所有Modal*/}
          {this.switchModalView()}
        </Card>
      </PageHeaderLayout>
    );
  }
}

const SingleFightView = (props) => {
  const time_dep = formatDate(props.data.time_dep, 'HH : mm') || "未知时间";
  const time_arr = formatDate(props.data.time_arr, 'HH : mm') || "未知时间";

  return (
    <div>
      <p>{props.data.flight_no}</p>
      <Row>
        <Col span={12} className={styles.item}>{props.data.city_dep_name || "未知城市"}</Col>
        <Col span={12} className={styles.item}>{props.data.city_arr_name || "未知城市"}</Col>
        <Col span={12} className={styles.item}>{time_dep}</Col>
        <Col span={12} className={styles.item}>{time_arr}</Col>
        <Col span={12} className={styles.item}>{props.data.flight_company || "未知航空公司"}</Col>
      </Row>
    </div>
  );
};
SingleFightView.propTypes = {
  data: PropTypes.object
};


