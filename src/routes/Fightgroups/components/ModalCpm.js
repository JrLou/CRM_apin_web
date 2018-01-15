import React, {Component} from 'react';
import {connect} from 'dva';
import {Modal, Table, Input, Button, message, Upload, Icon} from 'antd';
import less from './ModalCpm.less'
import {formatDate} from "../../../utils/utils";
import {stringify} from 'qs';

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
        {
          //TODO 这里的placeholder需要产品确认
        }
        <TextArea
          placeholder="请输入关闭拼团原因，最多100个字"
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
      const depFlightInfo = item.flightInfo? item.flightInfo.filter(oneFlight => oneFlight.trip_index === 0)[0]: {};
      const arrFlightInfo = item.flightInfo? item.flightInfo.filter(oneFlight => oneFlight.trip_index === 1)[0]: {};
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
      }, {
        title: '返回日期',
        dataIndex: 'flight_arr',
      }, {
        title: '销售价',
        dataIndex: 'sell_price',
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
      flieList: [],
    };
    this.serverTicketsData = [];//导出乘机人=>确认提交票号的时候使用
  }

  componentWillUnmount() {
    //此模态框即将消失的时候
    this.setState({flieList: []});

  }

  handleCancel = () => {
    this.props.changeVisible && this.props.changeVisible();
  };

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
        }
      ];
    }
    return columns;
  }

  /**
   * 创建一个不可见的iframe，通过加载它的src指向，实现下载，这样即使地址有问题，也不会影响页面；
   * @param url 一个可下载的url
   */
  downloadFile(url) {
    const bodyNode = document.querySelector('body');
    if (document.querySelector('iframe[name=forDownload]')) {
      bodyNode.removeChild(document.querySelector('iframe[name=forDownload]'));
    }
    const ifr = document.createElement('iframe');
    ifr.setAttribute('src', url);
    ifr.setAttribute('name', "forDownload");
    ifr.setAttribute("style", "display:none");
    bodyNode.appendChild(ifr);
  }

  /**
   * 传入table的data,插入票号那一栏
   * @param {[{},{}]} data
   * @returns {Array}
   */
  insertTickets(data, abroad) {
    /**
     [
     ["订单号", "乘机人", "乘机人类型", "证件号码", "出生年月日", "性别", "证件有效期", "国籍", "票号"]
     ["201801122029488197", "姓名", "成人", "123", "2017-01-01", "女", "2018-02-28", "中国", 110, null, null, null,…]
     ]
     */
    if (!this.serverTicketsData[0]) {
      return data;
    }
    let resultArr = data.map((currV, index) => {
      return {
        ...currV,
        ticket: this.serverTicketsData[index + 1][abroad === 0 ? 4 : 8],
      }
    });
    return resultArr;
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
        if (file.status !== 'uploading') { }
        if (file.status === 'done') {
          //文件上传成功后，有两种情况，通过code码判断，如果为200 通过，否则，弹出msg错误消息
          if (file.response.code === 200) {
            this.serverTicketsData = file.response.data;
            //处理页面上的table，插入票号数据
            dispatch({
              type: 'checkFightGroups/insertTickets',
              payload: this.insertTickets(data, abroad),
            });
            message.success('导入票号成功');
          } else {
            //不符合要求时，fileList值为空
            fileList = [];
            // message.error(file.response.msg);
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 上传失败`);
          console.log("如果出现了此文字，请检查此处代码", file.response);
        }
        //仅仅取fileList中的最新的一个
        fileList = fileList.slice(-1);
        this.setState({ fileList });
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
          <Upload {...uploadProps}>
            <Button type='primary'>
              <Icon type="upload"/>导入票号信息
            </Button>
          </Upload>
          <Button
            type='primary'
            loading={modalConfirmLoading}
            onClick={() => {
              const {id, dispatch} = this.props;
              dispatch({
                type: 'checkFightGroups/fetchSaveTickets',
                payload: {
                  data: JSON.stringify(this.serverTicketsData),
                  uuid: id
                },
                succCallback: response => {
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
    )
      ;
  }
}

export default {CloseReasonModal, SendLogModal, ExportPassengerModal};//TODO 这3个modal很多重复代码， 后续可以抽取成高阶组件
