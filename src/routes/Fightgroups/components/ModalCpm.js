import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Table, Input, Button, message} from 'antd';
import less from './ModalCpm.less'

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

  getColumns() {
    let columns = [];
    if(this.props.passengerType === 0){//todo 点击【批量导出】按钮  页面应该传过来，【乘客类型】  0=>国内， 1=> 国际
      columns = [
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
    } else {
      columns = [
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
          title: '出生年月日',
          dataIndex: 'num',
          key: 'num',
        }, {
          title: '性别',
          dataIndex: 'bbb',
          key: 'bbb',
        }, {
          title: '证件有效期',
          dataIndex: 'aaac',
          key: 'aaac',
        }, {
          title: '国籍',
          dataIndex: 'b',
          key: 'b',
        }, {
          title: '票号',
          dataIndex: 'pb',
          key: 'pb',
        }
      ];
    }
    return columns;
  }

  render() {
    const {basicGoods, basicLoading, modalConfirmLoading} = this.props.checkFightGroups;
    const {dispatch} = this.props;
    console.log("this.props.checkFightGroups", this.props.checkFightGroups);

    const columns = this.getColumns();

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
        <div className={less.btnContainer}>
          <Button
            type='primary'
            onClick={() => {

            }}
          >
            导出乘机人信息
          </Button>
          <Button
            type='primary'
            onClick={() => {//todo 这里是难点

            }}
          >
            导入票号信息
          </Button>
          <Button
            type='primary'
            loading={modalConfirmLoading}
            onClick={() => {
              dispatch({
                type: 'checkFightGroups/fetchConfirmExport',
                payload: {},
                callback: response => {
                  if (response.code == 200) {
                    message.success("操作成功");
                    console.log(response);
                  } else {
                    message.success("操作失败");
                    console.log('error');
                  }
                }
              });
            }}
          >
            确认提交
          </Button>
        </div>
      </Modal>
    );
  }
}

export default {CloseReasonModal, SendLogModal, ExportPassengerModal};//TODO 这3个modal很多重复代码， 后续可以抽取成高阶组件
