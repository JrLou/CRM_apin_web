import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Modal, Table, Divider, Icon, Row, Col, Button} from 'antd';
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
export default class BasicProfile extends Component {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'checkFightGroups/fetchBasic',
    });
  }

  render() {
    const {checkFightGroups} = this.props;
    const {basicGoods, basicProgress, basicLoading} = checkFightGroups;
    let goodsData = basicGoods;
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [{
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '订单状态',
      dataIndex: 'name',
      key: 'name',
      render: renderContent,
    }, {
      title: '联系人',
      dataIndex: 'barcode',
      key: 'barcode',
      render: renderContent,
    }, {
      title: '联系电话',
      dataIndex: 'price',
      key: 'price',
      render: renderContent,
    }, {
      title: '订单人数',
      dataIndex: 'num',
      key: 'num',
      render: (text, row, index) => {
        if (index < basicGoods.length) {
          return text;
        }
        return <span style={{fontWeight: 600}}>{text}</span>;
      },
    }, {
      title: '推送次数',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, row, index) => {
        if (index < basicGoods.length) {
          return text;
        }
        return <span style={{fontWeight: 600}}>{text}</span>;
      },
    }, {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, row, index) => {
        return <a>推送日志</a>;
      },
    }];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {/* <div className={styles.title}>图片查看</div>
          <ImageWrapper className={styles.picWrapper} src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png" desc="示意图"/> */}
          <div className={styles.title}><Icon type="profile"/>
            拼团信息
            <Button
              type="primary"
              className={styles.btn}
              onClick={() => {
                //弹出modal
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
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="schedule"/>
            订单信息
            <Button type="primary" className={styles.btn}>批量导出乘机人 / 出票</Button>
            <Button type="primary" className={styles.btn}>继续添加订单</Button>
          </div>
          <Table
            style={{marginBottom: 24}}
            pagination={false}
            loading={basicLoading}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="id"
          />
          <Divider style={{marginBottom: 32}}/>
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
          <Divider style={{marginBottom: 32}}/>
          <div className={styles.title}><Icon type="form"/> 日志信息</div>
          <Table
            style={{marginBottom: 16}}
            pagination={false}
            loading={basicLoading}
            dataSource={basicProgress}
            columns={progressColumns}
          />
        </Card>
        <Modal
          title="Basic Modal"
          visible={false}//this.state.visible
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </PageHeaderLayout>
    );
  }
}