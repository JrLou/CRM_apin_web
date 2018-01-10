import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider,Icon, Input, Button, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './EntrustProfile.less';

const { Description } = DescriptionList;
const confirm = Modal.confirm;
const {TextArea} = Input;

const paymentColumns = [ {
  title: '订单号',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '支付方式',
  dataIndex: 'rate',
  key: 'rate',
}, {
  title: '支付状态',
  dataIndex: 'status',
  key: 'status',
  render: text => (
    text === 'success' ? <Badge status="success" text="成功" /> : <Badge status="processing" text="失败" />
  ),
},{
  title: '支付时间',
  dataIndex: 'time',
  key: 'time',
}];

const passengerColumns = [{
  title: '姓名',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '证件号码',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '出生日期',
  dataIndex: 'barcode',
  key: 'barcode',
}, {
  title: '证件有效期',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '联系电话',
  dataIndex: 'price',
  key: 'price',
}, {
  title:'票号',
  key:'adjust',
  render:(text, record) => {
    return <div className={styles.ticket}>
      <div><span>去</span><Input /></div>
      <div><span>返</span><Input /></div>
    </div>
  },
  align:'center'
}];

const entrustColumns = [{
  title: '出发地目的地',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '出行时间',
  dataIndex: 'id',
  key: 'id',
}, {
  title: '起飞时间',
  dataIndex: 'barcode',
  key: 'barcode',
}, {
  title: '出行天数',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '乘机人数',
  dataIndex: 'price',
  key: 'price',
}, {
  title:'是否接受微调',
  key:'adjust',
  render:(text, record) => {
    return <span>是</span>
  },
  align:'center'
}, {
  title: '提交时间',
  dataIndex: 'amount',
  key: 'amount',
  align: 'right',
}];

const progressColumns = [{
  title: '操作人',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '操作时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '操作内容',
  dataIndex: 'rate',
  key: 'rate',
}];

const orderColumns = [{
  title: '航班号',
  dataIndex: 'flight_no',
  key: 'flight_no',
}, {
  title: '出发机场',
  dataIndex: 'airport_dep_name',
  key: 'airport_dep_name'
}, {
  title: '到达机场',
  dataIndex: 'airport_arr_name',
  key: 'airport_arr_name'
}, {
  title: '出发时间',
  dataIndex: 'time_dep',
  key: 'time_dep'
}, {
  title: '到达时间',
  dataIndex: 'time_arr',
  key: 'time_arr'
}, {
  title: '人数',
  dataIndex: 'group_id',
  key: 'group_id'
}];

let basicOrder = [{
  flight_no:'222',
  airport_dep_name:'22222222222',
  airport_arr_name:'333333',
  time_dep:'111111111',
  time_arr:'111111111111',
  group_id:'2'
}, {
  flight_no:'222',
  airport_dep_name:'22222222222',
  airport_arr_name:'333333',
  time_dep:'111111111',
  time_arr:'111111111111',
  group_id:'2'
}];

@connect(state => ({
  profile: state.profile,
}))
export default class BasicProfile extends Component {
  state = {
    inputPrice:5000,
    amend: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }
  //实际结算价格
  priceMoney(e) {
    this.setState({
      inputPrice:e.target.value,
    })
  }

  handlePrice() {
    this.setState({
      amend:!this.state.amend,
    })
  }
  //出票
  ticketConfirm() {
    confirm({
      title: '是否确认出票?',
      content: '出票后,将无法修改',
      onOk() {},
      onCancel() {},
    });
  }

  render() {
    const { profile } = this.props, {id} = this.props.match.params;
    const { basicGoods, basicProgress, basicLoading } = profile;
    const { inputPrice, amend, visible, textValue } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.titleStatus}>委托中</div>
          <div className={styles.remarkText}>这里是出票失败备注，这里是出票失败备注。</div>
          <div className={styles.title}><span><Icon type="profile" /> 订单信息</span></div>
          <DescriptionList size="large" style={{ marginBottom: 32 }} col={4}>
            <Description term="订单号">1000000000</Description>
            <Description term="联系人">测试1</Description>
            <Description term="联系电话">13100000001</Description>
            <Description term="微信昵称">付小小</Description>
          </DescriptionList>
          <div className={styles.myTable}>
            <Table
              style={{ marginBottom: 24 }}
              pagination={false}
              loading={basicLoading}
              dataSource={basicOrder}
              columns={orderColumns}
            />
          </div>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}><span><Icon type="usergroup-add" /> 乘客信息</span></div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={basicLoading}
            dataSource={basicGoods}
            columns={passengerColumns}
          />
          <div className={styles.ticketBtn}><Button type="primary" onClick={::this.ticketConfirm}>出票</Button></div>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}><span><Icon type="red-envelope" /> 支付信息</span></div>
          <div className={styles.paymentPrice}>
            <div><p>机票销售价</p><p>5000.00元=2500.00元（成人价）*2 </p></div>
            <div>
              <p>实际结算价</p>
              {amend ?
                <p><Input type='number' value={inputPrice} onChange={::this.priceMoney} /></p> : <p>{inputPrice}元</p>}
              <Button type="primary" onClick={:: this.handlePrice}>{amend ? '保存' : '修改'}</Button>
            </div>
            <div><p>差额</p><p>{amend ? 5000 : 5000-inputPrice}</p></div>
          </div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={basicLoading}
            dataSource={basicProgress}
            columns={paymentColumns}
            rowKey="id"
          />
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}><span><Icon type="schedule" /> 委托信息</span></div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={basicLoading}
            dataSource={basicGoods}
            columns={entrustColumns}
            rowKey="id"
          />
          <div className={styles.title}><span><Icon type="pushpin-o" /> 方案推送记录</span></div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={basicLoading}
            dataSource={basicGoods}
            columns={entrustColumns}
            rowKey="id"
          />
          <div className={styles.title}><span><Icon type="form" /> 日志信息</span></div>
          <div className={styles.myTable}>
            <Table
              style={{ marginBottom: 16 }}
              pagination={false}
              loading={basicLoading}
              dataSource={basicProgress}
              columns={progressColumns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
