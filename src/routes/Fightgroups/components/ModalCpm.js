import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Table, Input, Button, message, Upload, Icon, Spin, notification} from 'antd';
import less from './ModalCpm.less'
import {formatDate} from "../../../utils/utils";
import {checkCode} from "../../../utils/request";


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

  render() {//closeReason通过上级传过来，不通过redux！，antd pro 的查询表格就是这样的书写逻辑
    const {closeReason, checkFightGroups} = this.props;
    const {modalData: {data}} = checkFightGroups;
    return (
      <Modal {...this.props} >
        <TextArea
          placeholder="请输入内容"
          autosize={{minRows: 2, maxRows: 4}}
          value={closeReason}
          onChange={(e) => {
            const value = e.target.value;
            this.props.onChange(value);
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

  getDataSource(data) {
    const mapStatusToTxt = (status) => {
      let txt = '';
      switch (status) {//状态（0取消，1推送，2接受，3支付超时）
        case 0:
          txt = '不接受';
          break;
        case 1:
          txt = '推送';
          break;
        case 2:
          txt = '接受';
          break;
        case 3:
          txt = '支付超时';
          break;
      }
      return txt;
    };
    return data.map(item => {
      const depFlightInfo = item.flightInfo ? item.flightInfo.filter(oneFlight => oneFlight.trip_index === 0)[0] : {};
      const arrFlightInfo = item.flightInfo ? item.flightInfo.filter(oneFlight => oneFlight.trip_index === 1)[0] : {};
      return {
        ...item,
        create_time: formatDate(item.create_time, 'YYYY-MM-DD HH:mm:ss'),//2017-12-31 12:00:00
        flight_no: depFlightInfo.flight_no + '/' + arrFlightInfo.flight_no,
        flight_dep: formatDate(depFlightInfo.time_dep, 'YYYY-MM-DD'),
        flight_arr: formatDate(arrFlightInfo.time_dep, 'YYYY-MM-DD'),
        sell_price: depFlightInfo.sell_price,//此字段任意一个航班都是一样的，因为价格是真个拼团的价格
        status: mapStatusToTxt(item.status),
      }
    });
  }

  render() {
    const {groupsInfoData: {data: groupsInfoDataData}} = this.props.checkFightGroups;
    const date_dep = formatDate(groupsInfoDataData.date_dep, 'YYYY-MM-DD');
    const date_ret = formatDate(groupsInfoDataData.date_ret, 'YYYY-MM-DD');

    const columns = [
      {
        title: '推送时间',
        dataIndex: 'create_time',
      }, {
        title: '航班号',
        dataIndex: 'flight_no',
      }, {
        title: '起飞日期',
        dataIndex: 'flight_dep',
        render: () => date_dep
      }, {
        title: '返回日期',
        dataIndex: 'flight_arr',
        render: () => date_ret
      }, {
        title: '销售价',
        dataIndex: 'sell_price',
        render: text => typeof text === "number" && (text / 100).toFixed(2)
      }, {
        title: '用户反馈',
        dataIndex: 'status',
      }, {
        title: '原因',
        dataIndex: 'remark',
      }];

    const {checkFightGroups} = this.props;//每个modal的table都是用这两行，取同一个地方的数据，因为他们不可能同时出现
    const {modalData: {data, code, msg}, modalTableLoading} = checkFightGroups;
    const dataSource = this.getDataSource(data);

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
          loading={modalTableLoading}
          dataSource={dataSource}
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
    this.state = {
      ticketLoading: false,
    };
  }

  componentDidMount() {
    this.initUploadData();
  }

  componentWillUnmount() {
    this.initUploadData();
  }

  initUploadData() {
    this.setState({fileList: []});
    this.serverTicketsData = null;
  }

  setTicketLoading = (ticketLoading, cb) => {
    this.setState({ticketLoading}, cb)
  };

  handleCancel = () => {
    this.props.changeVisible && this.props.changeVisible();
    this.initUploadData();
  };

  isTicketsAllNull() {
    const {groupsInfoData: {data: {abroad}}} = this.props.checkFightGroups;
    return this.serverTicketsData.every((item, index) => {
      if (index !== 0 && !!item[abroad === 0 ? 4 : 8]) {
        return false;
      }
      return true;
    });
  }

  getColumns() {
    const {groupsInfoData: {data: {abroad}}} = this.props.checkFightGroups;

    let columns = [];
    if (abroad == 0) {// abroad	0 国内 1 国际
      columns = [
        {
          title: '订单号',
          dataIndex: 'id',
        }, {
          title: '乘机人',
          dataIndex: 'cname',
        }, {
          title: '乘机人类型',
          dataIndex: 'type',
        }, {
          title: '证件号码',
          dataIndex: 'cert_no',
        }, {
          title: '票号',
          dataIndex: 'ticket',
          render: text => <Spin spinning={this.state.ticketLoading}>{text}</Spin>
        }
      ];
    } else {
      columns = [
        {
          title: '订单号',
          dataIndex: 'id',
        }, {
          title: '乘机人',
          dataIndex: 'cname',
        }, {
          title: '乘机人类型',
          dataIndex: 'type',
        }, {
          title: '证件号码',
          dataIndex: 'cert_no',
        }, {
          title: '出生年月日',
          dataIndex: 'birthday',

        }, {
          title: '性别',
          dataIndex: 'gender',
          render(text) {
            return text === 1 ? '男' : '女';
          }
        }, {
          title: '证件有效期',
          dataIndex: 'expire_time',
        }, {
          title: '国籍',
          dataIndex: 'nation',
        }, {
          title: '票号',
          dataIndex: 'ticket',
          render: text => <Spin spinning={this.state.ticketLoading}>{text}</Spin>
        }
      ];
    }
    return columns;
  }

  /**
   * 传入table的后台返回的excel的内容数组,取出去除第一行标题开始ticket中的字段，然后往data中插入{ticket: xxx}
   *
   * ↓↓↓↓↓↓↓↓传入的代码如下↓↓↓↓↓↓
   * [
   * ["订单号", "乘机人", "乘机人类型", "证件号码", "出生年月日", "性别", "证件有效期", "国籍", "票号"],
   * ["201801122029488197", "姓名", "成人", "123", "2017-01-01", "女", "2018-02-28", "中国", 110, null, null, null,…]
   * ]
   * ↑↑↑↑↑↑↑↑传入的代码如上↑↑↑↑↑↑
   *
   * @param {[{},{}]} data
   * @returns {[{}]} 返回处理后的table用的data
   */
  getPaidMemberAfterInsertTickets(newData, oldData, abroad) {
    if (!newData[0]) {
      return oldData;
    }
    const resultArr = oldData.map((currV, index) => {
      //把0转换成‘0’
      if (newData[index + 1] && newData[index + 1][abroad === 0 ? 4 : 8] === 0) {
        newData[index + 1][abroad === 0 ? 4 : 8] = "0";
      }
      return {
        ...currV,
        ticket: newData[index + 1] && newData[index + 1][abroad === 0 ? 4 : 8] && newData[index + 1][abroad === 0 ? 4 : 8].toString(),
      }
    });
    return resultArr;
  }

  isTicketChange(newData, oldData) {
    return oldData.some((currV, index) => currV.ticket != newData[index].ticket);//为了匹配defined == null，所以不能用【全等】
  }

  render() {
    const {
      checkFightGroups: {
        modalData: {data}, modalTableLoading, modalConfirmLoading,
        groupsInfoData: {data: {abroad}}
      },
      id,
      dispatch,
    } = this.props;

    const uploadProps = {
      accept: '.xlsx,.xls',
      name: 'ticketFile',
      action: '/api/demandPool/uploadTickets',
      data: {uuid: id},
      fileList: this.state.fileList,
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: (file) => {
        const reg = /.xls.?$/;
        const isXlsx = reg.test(file.name);
        if (!isXlsx) {
          message.error('请上传excel格式');
        }
        return isXlsx;
      },
      onChange: ({file, fileList, event,}) => {
        this.setTicketLoading(true, () => {

          let isTicketChange = false;
          let paidMemberAfterInsertTicket = [];
          if (file.status === 'done') {
            checkCode(file.response);//todo 最好把他变成promise
            if (file.response.code >= 1) {
              paidMemberAfterInsertTicket = this.getPaidMemberAfterInsertTickets(file.response.data, data, abroad);
              isTicketChange = this.isTicketChange(paidMemberAfterInsertTicket, data);
              if (isTicketChange) {
                dispatch({
                  type: 'checkFightGroups/insertTickets',
                  payload: paidMemberAfterInsertTicket,
                });
                this.serverTicketsData = file.response.data;
              } else {
                notification.error({
                  message: `提示`,
                  description: '票号导入重复',
                });
              }
            }
          } else if (file.status === 'error') {
            message.error(`${file.name} 上传失败`);
            console.log("如果出现了此文字，可能请检查此处代码", file.response);
          }

          this.setState({fileList});//页面不需要它,但是上传需要它，所以不能省
          if (file.status === 'done' || file.status === 'error') {
            this.setState({ticketLoading: false});
          }

        });
      },
    };

    const columns = this.getColumns();
    return (
      <Modal
        title={"乘机人信息—" + (abroad === 0 ? "国内" : "国际")}
        onCancel={this.handleCancel}
        footer={null}
        {...this.props}
        width={abroad === 1 ? 1200 : this.props.width}
      >
        <Table
          style={{marginBottom: 24}}
          pagination={false}
          loading={modalTableLoading}
          dataSource={data}
          columns={columns}
          rowKey="id"
        />
        <div className={less.btnContainer}>
          <Button
            type='primary'
            onClick={() => {//其实就是下载，很简单
              const {checkFightGroups: {groupsInfoData: {data}}, id, dispatch} = this.props;
              const fsName = formatDate(data.date_dep, 'MM月DD日') + id + '团乘机人.xlsx';
              const params = {
                uuid: id,
                fsName,
                download: true,
              };
              dispatch({
                type: 'checkFightGroups/fetchExportPassenger',
                payload: params,
                cb: response => {
                  const url = URL.createObjectURL(response);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = fsName;
                  a.click();
                  window.URL.revokeObjectURL(url);//销毁霸占着的内存
                }
              });
            }}
          >
            <Icon type="download"/>导出乘机人信息
          </Button>
          <span className={less.uploadContainer}>
            <Upload {...uploadProps}>
              <Button type='primary'>
                <Icon type="upload"/>导入票号信息
              </Button>
            </Upload>
          </span>
          <Button
            type='primary'
            loading={modalConfirmLoading}
            disabled={!this.serverTicketsData}// || this.isTicketsAllNull()
            onClick={() => {
              if (this.serverTicketsData && this.isTicketsAllNull()) {
                notification.error({
                  message: `提示`,
                  description: '请导入票号信息',
                });
                return;
              }
              const {id, dispatch} = this.props;
              dispatch({
                type: 'checkFightGroups/fetchSaveTickets',
                payload: {
                  data: JSON.stringify(this.serverTicketsData),
                  uuid: id
                },
                succCallback: () => {
                  message.success("操作成功");
                  //一定要成功后清除数据
                  this.initUploadData();
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

export default {CloseReasonModal, SendLogModal, ExportPassengerModal};
