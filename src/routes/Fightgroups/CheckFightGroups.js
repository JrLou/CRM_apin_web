import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, Modal, Table, Divider, Icon, Row, Col, Button} from 'antd';
import {CloseReasonModal, SendLogModal, ExportPassengerModal} from './components/ModalCpm';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './CheckFightGroups.less';

const {Description} = DescriptionList;

const progressColumns = [{
  title: '操作时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '操作员',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: "操作内容",
  dataIndex: 'rate',
  key: "rate",
}];

@connect(state => ({
  checkFightGroups: state.checkFightGroups,
}))
export default class CheckFightGroups extends Component {
  constructor() {
    super();
    this.state = {
      modalType: 0,//0 => 关闭拼团， 1 => 查看日志， 2=> 导出乘机人
    };
  }

  //TODO 上一页如果传递数据过来， I need use params then send request;
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/fetchBasic',
    });
  }

  getFightGroupsInfoView() {
    return (
      <div>
        <div className={styles.title}>
          <Icon type="profile"/>
          <span>拼团信息</span>
          <Button
            type="primary"
            className={styles.btn}
            disabled={false}
            onClick={() => {
              this.setState({modalType: 0}, () => {
                this.handleshowModal()
              });
            }}
          >
            关闭拼团
          </Button>
        </div>
        <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
          <Description term="拼团单号">1000000000</Description>
          <Description term="拼团状态">拼团中</Description>
          <Description term="出发城市">杭州</Description>
          <Description term="到达城市">北京</Description>
          <Description term="起飞日期">2018-01-01</Description>
          <Description term="返回日期">2018-01-03</Description>
          <Description term="方案提交时间">2018-01-01 12:08</Description>
          <Description term="方案过期时间">2018-01-03 12:08</Description>
          <Description term="支付人数">10人</Description>
          <Description term="处理客服">园园</Description>
        </DescriptionList>
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
          <Link to={'/fightgroups/demand/choose'}>
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

  getProjectDetailView() {
    return (
      <div>
        <div className={styles.title}><Icon type="schedule"/> 方案明细</div>
        <div className={styles.schemeInfo}>
          <DescriptionList size="large" style={{marginBottom: 32}} col={2}>
            <Description term="起飞日期">2018-01-01</Description>
            <Description term="返回日期">2018-01-03</Description>
          </DescriptionList>
          <div className={styles.descAir}>
            <p>MU9885</p>
            <Row>
              <Col span={12} className={styles.item}>杭州萧山</Col>
              <Col span={12} className={styles.item}>杭州萧山</Col>
              <Col span={12} className={styles.item}>12:00</Col>
              <Col span={12} className={styles.item}>18:00</Col>
              <Col span={12} className={styles.item}>中国东方航空</Col>
            </Row>
          </div>
          <div className={styles.descAir} style={{marginLeft: '40px'}}>
            <p>MU9885</p>
            <Row>
              <Col span={12} className={styles.item}>杭州萧山</Col>
              <Col span={12} className={styles.item}>杭州萧山</Col>
              <Col span={12} className={styles.item}>12:00</Col>
              <Col span={12} className={styles.item}>18:00</Col>
              <Col span={12} className={styles.item}>中国东方航空</Col>
            </Row>
          </div>
          <DescriptionList size="large" style={{marginTop: 32}} col={2}>
            <Description term="销售价格">1222</Description>
            <Description term="方案有效时间">24小时</Description>
            <Description term="折扣">2.7折</Description>
          </DescriptionList>
        </div>
      </div>
    );
  }

  getLogInfoView(basicProgress) {
    return (
      <div>
        <div className={styles.title}><Icon type="form"/> 日志信息</div>
        <Table
          style={{marginBottom: 16}}
          pagination={false}
          dataSource={basicProgress}
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
        onCancel={this.handleCancel.bind(this)}
        confirmLoading={modalConfirmLoading}
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
      type: 'checkFightGroups/changeModalLoading',//modalConfirmLoading
      payload: {showModal: true},//传过去的参数
    });
  }

  handleOk(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/fetchSaveCloseFightGroups',
      payload: {text: this.state.closeReason},//传过去的参数
    });
  }

  handleCancel(e) {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/changeModalLoading',
      payload: {showModal: false},//传过去的参数
    });
  }

  render() {
    const {checkFightGroups} = this.props;
    const {basicGoods, basicProgress, basicLoading} = checkFightGroups;
    const goodsColumns = this.getGoodsColumns();
    const {modalConfirmLoading, showModal} = this.props.checkFightGroups;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {this.getFightGroupsInfoView()}
          <Divider style={{marginBottom: 32}}/>

          {this.getOrderInfoView(basicLoading, basicGoods, goodsColumns)}
          <Divider style={{marginBottom: 32}}/>

          {this.getProjectDetailView()}
          <Divider style={{marginBottom: 32}}/>

          {this.getLogInfoView(basicProgress)}


          {this.switchModalView()}
        </Card>
      </PageHeaderLayout>
    );
  }
}

