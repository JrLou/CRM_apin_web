import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, Spin, Table, Divider, Icon, Row, Col, Button, message} from 'antd';
import {CloseReasonModal, SendLogModal, ExportPassengerModal} from './components/ModalCpm';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './CheckFightGroups.less';
import {getPar, formatPar, formatDate} from '../../utils/utils';

const {Description} = DescriptionList;

//TODO a. 点击关闭拼团按钮弹出页面，录入需要备注的内容，  点击【保存】 下方日志信息  *****应该刷新*****

const progressColumns = [{
  title: '操作时间',
  dataIndex: 'create_time',
  key: 'create_time',
}, {
  title: '操作员',
  dataIndex: 'user_name',
  key: 'user_name',
}, {
  title: "操作内容",
  dataIndex: 'create_content',
  key: 'create_content',
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
    const {dispatch} = this.props;
    dispatch({//todo 这个最后记得删除
      type: 'checkFightGroups/fetchBasic',
      payload: this.id,
    });
    dispatch({// 获取拼团信息
      type: 'checkFightGroups/fetchGroupsInfo',
      payload: {id: this.id},
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
  }

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
        txt = "拼团完成";
        break;
      case 3:
        txt = "拼团成功";
        break;
      default:
        txt = "未知的拼团状态";
        break;
    }
    return txt;
  };

  getFightGroupsInfoView() {
    const {groupsInfoData: {data, code, msg}, groupsInfoLoading} = this.props.checkFightGroups;

    const create_time = formatDate(data.create_time, 'YYYY-MM-DD');
    // todo 方案有效时间，通过这个字段，计算出过期时间；
    const expired_time = formatDate(data.expired_time, 'YYYY-MM-DD');

    const group_status = this.mapGroupStateToTxt(data.group_status);
    const city_dep = data.city_dep;
    const city_arr = data.city_arr;
    const date_dep = formatDate(data.date_dep, 'YYYY-MM-DD');
    const date_ret = formatDate(data.date_ret, 'YYYY-MM-DD');


    const paidMan = +data.paidMan;
    const creator_name = data.creator_name;

    return (
      <div>
        <div className={styles.title}>
          <Icon type="profile"/>
          <span>拼团信息</span>
          <Button
            type="primary"
            className={styles.btn}
            disabled={data.group_status !== 2 || groupsInfoLoading}
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
        </Spin>
      </div>
    );
  }

  getGoodsColumns() {
    return [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '订单状态',
        dataIndex: 'name',
        key: 'name',
        // render: renderContent,
      }, {
        title: '联系人',
        dataIndex: 'barcode',
        key: 'barcode',
        // render: renderContent,
      }, {
        title: '联系电话',
        dataIndex: 'price',
        key: 'price',
        // render: renderContent,
      }, {
        title: '订单人数',
        dataIndex: 'num',
        key: 'num',
      }, {
        title: '推送次数',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, row, index) => {
          return (
            <a
              onClick={() => {
                this.setState({modalType: 1}, () => {
                  this.handleshowModal()
                });
              }}
            >
              推送日志
            </a>
          );
        },
      }
    ];
  }

  getOrderInfoView(basicLoading, basicGoods, goodsColumns) {
    const data = {id: this.id, continueFlag: true};
    let params = formatPar(data);
    return (
      <div>
        <div className={styles.title}><Icon type="schedule"/>
          订单信息
          <Button
            type="primary"
            className={styles.btn}
            onClick={() => {
              this.setState({modalType: 2}, () => {
                this.handleshowModal()
              });
            }}
          >
            批量导出乘机人 / 出票
          </Button>
          <Link to={'/fightgroups/demand/choose/' + params}>
            <Button type="primary" className={styles.btn}>继续添加订单</Button>
          </Link>
        </div>
        <Table
          style={{marginBottom: 24, position: 'relative'}}
          pagination={false}
          loading={basicLoading}
          dataSource={basicGoods}
          columns={goodsColumns}
          rowKey="id"
        />
      </div>
    );
  }

  getDetailGroupVoyage() {
    const {
      detailGroupVoyage: {data, code, msg},
      detailGroupVoyageLoading,
      groupsInfoData: {data: groupsInfoDataData},
    } = this.props.checkFightGroups;

    let expired_hour = (groupsInfoDataData.expired_time - groupsInfoDataData.create_time) % (1000 * 60 * 60);
    expired_hour = expired_hour || (expired_hour === 0 ? 0 : "");

    const goFlightInfo = data.filter(currV => currV.trip_index === 0)[0] || {};
    const backFlightInfo = data.filter(currV => currV.trip_index === 1)[0] || {};
    const time_dep = formatDate(goFlightInfo.time_dep, 'YYYY-MM-DD');
    const time_arr = formatDate(backFlightInfo.time_dep, 'YYYY-MM-DD');

    return (
      <div>
        <div className={styles.title}><Icon type="schedule"/> 方案明细</div>
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
              <Description term="销售价格">{groupsInfoDataData.sell_price || "未知价格"} 元 / 人</Description>
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
      key: currV.id,
    }));

    return (
      <div>
        <div className={styles.title}><Icon type="form"/> 日志信息</div>
        <Table
          loading={groupLogsLoading}
          style={{marginBottom: 16}}
          pagination={false}
          dataSource={dataSource}
          columns={progressColumns}
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
      // <Modal
      //   title="请确认是否关闭拼团，关闭请输入原因："
      //   visible={showModal}
      //   onOk={this.handleOk.bind(this)}
      //   onCancel={this.handleCancel.bind(this)}
      //   confirmLoading={modalConfirmLoading}
      // >
      //   {
      //     //TODO 这里的placeholder需要产品确认
      //   }
      //   <TextArea
      //     placeholder="请输入关闭拼团原因，最多100个字"
      //     autosize={{minRows: 2, maxRows: 4}}
      //     value={this.state.closeReason}
      //     onChange={(e) => {
      //       const value = e.target.value;
      //       value.length <= 100 && this.setState({closeReason: value});
      //     }}
      //   />
      // </Modal>
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

  getExportPassengerModal(showModal, modalConfirmLoading) {
    return (
      <ExportPassengerModal
        visible={showModal}
        width={920}
        changeVisible={this.handleCancel.bind(this)}
        passengerType={0}//todo 乘机人类型  国内 or 国际
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
    });
  }

  handleCancel(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/extendAll',
      payload: {showModal: false},//传过去的参数
    });
  }

  render() {
    const {checkFightGroups} = this.props;
    const {basicGoods, basicLoading} = checkFightGroups;
    const goodsColumns = this.getGoodsColumns();

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {/*拼团信息*/}
          {this.getFightGroupsInfoView()}
          <Divider style={{marginBottom: 32}}/>

          {/*订单信息*/}
          {this.getOrderInfoView(basicLoading, basicGoods, goodsColumns)}
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

  return (//todo 往返航班的各自的  出发时间  到达时间
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


