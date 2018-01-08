import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Table, Input} from 'antd';

const {TextArea} = Input;

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
class CloseReasonModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleCancel = () => {
    this.props.changeVisible && this.props.changeVisible();
  };

  render() {
    const {closeReason} = this.props.checkFightGroups;
    const {dispatch} = this.props;

    return (
      <Modal
        {...this.props}
      >
        {
          //TODO 这里的placeholder需要产品确认
        }
        <TextArea
          placeholder="请输入关闭拼团原因，最多100个字"
          autosize={{minRows: 2, maxRows: 4}}
          value={closeReason}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 100) {
              dispatch({
                type: 'checkFightGroups/saveCloseReason',
                payload: {closeReason: value},//传过去的参数
              });
            }
          }}
        />
      </Modal>
    );
  }
}

@connect(state => ({
  checkFightGroups: state.checkFightGroups,
}))
class SendLogModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleCancel = () => {
    this.props.changeVisible && this.props.changeVisible();
  };

  render() {
    const {basicGoods, basicLoading} = this.props.checkFightGroups;

    const columns = [
      {
        title: '推送时间',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '航班号',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '起飞日期',
        dataIndex: 'barcode',
        key: 'barcode',
      }, {
        title: '返回日期',
        dataIndex: 'price',
        key: 'price',
      }, {
        title: '销售价',
        dataIndex: 'num',
        key: 'num',
      }, {
        title: '用户反馈',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: '原因',
        dataIndex: 'action',
        key: 'action',
      }];

    return (
      <Modal
        title="日志"
        onCancel={this.handleCancel}
        footer={null}
        {...this.props}
      >
        <Table
          style={{marginBottom: 24}}
          pagination={false}
          loading={basicLoading}
          dataSource={basicGoods}
          columns={columns}
          rowKey="id"
        />
      </Modal>
    );
  }
}

@connect(state => ({
  checkFightGroups: state.checkFightGroups,
}))
class ExportPassengerModal extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleCancel = () => {
    this.props.changeVisible && this.props.changeVisible();
  };

  render() {
    const {basicGoods, basicLoading} = this.props.checkFightGroups;

    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '乘机人',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '乘机人类型',
        dataIndex: 'barcode',
        key: 'barcode',
      }, {
        title: '证件号码',
        dataIndex: 'price',
        key: 'price',
      }, {
        title: '票号',
        dataIndex: 'num',
        key: 'num',
      }
    ];

    return (
      <Modal
        title={"乘机人信息—" + (this.props.passengerType === 0 ? "国内" : "国际")}
        onCancel={this.handleCancel}
        footer={null}
        {...this.props}
      >
        <Table
          style={{marginBottom: 24}}
          pagination={false}
          loading={basicLoading}
          dataSource={basicGoods}
          columns={columns}
          rowKey="id"
        />
      </Modal>
    );
  }
}

export default {CloseReasonModal, SendLogModal, ExportPassengerModal};//TODO 这3个modal很多重复代码， 后续可以抽取成高阶组件
