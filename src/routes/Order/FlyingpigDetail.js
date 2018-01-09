import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Table, Divider, Icon, Button, Input, Modal} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './FlyingpigDetail.less';

const {TextArea} = Input;
const confirm = Modal.confirm;
const {Description} = DescriptionList;
//订单信息数据
const orderColumns = [
  {title: '航班号', dataIndex: '1', key: '1',},
  {title: '出发机场', dataIndex: '2', key: '2',},
  {title: '到达机场', dataIndex: '3', key: '3',},
  {title: '出发时间', dataIndex: '4', key: '4',},
  {title: '到达时间', dataIndex: '5', key: '5',},
  {title: '人数', dataIndex: '6', key: '6',},
];
let orderData = [
  {1: '123', 2: '杭州', 3: '北京', 4: '2018-12-21 12:00', 5: '2018-12-30 12:00::00', 6: 5, id: '1'},
  {1: '123', 2: '杭州', 3: '北京', 4: '2018-12-21 12:00', 5: '2018-12-30 12:00::00', 6: 5, id: '2'},
  {1: '123', 2: '杭州', 3: '北京', 4: '2018-12-21 12:00', 5: '2018-12-30 12:00::00', 6: 5, id: '3'}
];
//乘机人信息
const passengerColumns = [
  {title: '姓名', dataIndex: 'name', key: 'name'},
  {title: '性别', dataIndex: 'sex', key: 'sex'},
  {title: '证件类型', dataIndex: 'idType', key: 'idType'},
  {title: '证件号', dataIndex: 'idNo', key: 'idNo'},
  {title: '国籍', dataIndex: 'nationality', key: 'nationality'},
  {title: '出生日期', dataIndex: 'birthday', key: 'birthday'},
  {title: '证件有效期', dataIndex: 'idValidity', key: 'idValidity'},
  {title: '联系电话', dataIndex: 'phone', key: 'phone'},
  {
    title: '票号', dataIndex: 'ticketNo', key: 'ticketNo',
    render: (text, data) => {
      return (
        <span>
          去
           <Input className={styles.inputTicket}/>
          返
           <Input className={styles.inputTicket}/>
        </span>
      )
    }
  },
];
let passengerData = [
  {
    id: '1',
    name: '园园',
    sex: '女',
    idType: '身份证',
    idNo: '410922199310060987',
    nationality: '中国',
    birthday: '1993/10/06',
    idValidity: '2020/10',
    phone: '18903830829',
    ticketNo: '123'
  },
  {
    id: '2',
    name: '园园',
    sex: '女',
    idType: '身份证',
    idNo: '410922199310060987',
    nationality: '中国',
    birthday: '1993/10/06',
    idValidity: '2020/10',
    phone: '18903830829',
    ticketNo: '123'
  },
];
//支付信息
const payColumns = [
  {title: '支付单号', dataIndex: 'payNo', key: 'payNo'},
  {title: '付款金额(元)', dataIndex: 'payPrice', key: 'payPrice'},
  {title: '支付方式', dataIndex: 'payType', key: 'payType'},
  {title: '状态', dataIndex: 'payStatus', key: 'payStatus'},
  {title: '支付时间', dataIndex: 'payTime', key: 'payTime'},
];
let payData = [
  {id: '1', payNo: '123444', payPrice: '300', payType: '支付宝', payStatus: '成功', payTime: '2017-10-09 12:00:10'},
  {id: '2', payNo: '123444', payPrice: '300', payType: '支付宝', payStatus: '成功', payTime: '2017-10-09 12:00:10'},
];
//日志信息
const logColumns = [
  {title: '操作人', dataIndex: 'actionName', key: 'actionName'},
  {
    title: '操作时间',
    dataIndex: 'actionTime',
    key: 'actionTime',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.actionTime - b.actionTime,
  },
  {title: '操作内容', dataIndex: 'actionContent', key: 'actionContent'},
];
let logData = [
  {id: '1', actionName: '园园', actionTime: '2016.02.02 12:08:09', actionContent: '出票'},
  {id: '2', actionName: '园园', actionTime: '2016.02.02 12:09:09', actionContent: '出票'},
];
@connect(state => ({
  profile: state.flyingpigDetail,
}))
export default class BasicProfile extends Component {
  state = {
    inputPrice: 0,
    isEdit: false,
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'profile/fetchBasic',
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
    const {id} = this.props.match.params, {inputPrice, isEdit} = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.statusTitle}>
            待出票
            <FailModal failReason={::this.failReason}/>
          </div>
          <div className={styles.title}><Icon type="profile"/> 订单信息</div>
          <DescriptionList size="large" style={{marginBottom: 32}} col={4}>
            <Description term="订单号">1000000000</Description>
            <Description term="联系人">园园</Description>
            <Description term="联系电话">18903839999</Description>
            <Description term="微信昵称">远处看不尽的风景</Description>
            <Description term="订单来源">供应商</Description>
            <Description term="资源ID">3214321432</Description>
          </DescriptionList>
          <div className={styles.myTable}>
            <Table
              pagination={false}
              bordered={true}
              // loading={basicLoading}
              dataSource={orderData}
              columns={orderColumns}
              rowKey="id"
            />
          </div>
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="team"/> 乘客信息</div>
          <Table
            pagination={false}
            bordered={true}
            // loading={basicLoading}
            dataSource={passengerData}
            columns={passengerColumns}
            rowKey="id"
          />
          <div className={styles.acticnBtn}><Button type='primary' onClick={::this.ticketConfirm}>出票</Button></div>

          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="red-envelope"/> 支付信息</div>
          <ul className={styles.infoList}>
            <li>
              <span className={styles.titleDesc}>机票销售价</span>
              <span className={styles.priceDesc}>5000=2500(成人价)*2</span>
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
                    style={{color: (5000 - inputPrice) > 0 ? '#f00' : ''}}>{5000 - inputPrice}</span>
            </li>
          </ul>
          <div className={styles.myTable} style={{marginBottom: '25px'}}>
            <Table
              pagination={false}
              bordered={true}
              dataSource={payData}
              columns={payColumns}
              rowKey="id"
            />
          </div>
          <div className={styles.title}><Icon type="form"/> 日志信息</div>
          <Table
            style={{width: '60%'}}
            pagination={false}
            bordered={true}
            dataSource={logData}
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

