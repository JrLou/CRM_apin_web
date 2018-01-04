import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import ImageWrapper from '../../components/ImageWrapper';
import styles from './EntrustProfile.less';

const { Description } = DescriptionList;

const progressColumns = [{
  title: '时间',
  dataIndex: 'time',
  key: 'time',
}, {
  title: '当前进度',
  dataIndex: 'rate',
  key: 'rate',
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status',
  render: text => (
    text === 'success' ? <Badge status="success" text="成功" /> : <Badge status="processing" text="进行中" />
  ),
}, {
  title: '操作员ID',
  dataIndex: 'operator',
  key: 'operator',
}, {
  title: '耗时',
  dataIndex: 'cost',
  key: 'cost',
}, {
  title: "城市图片",
  key: "img_url",
  render: (text, record, index) => {
    // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
    if (!record.img_url) {
      return <ImageWrapper className={styles.picTable} src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png" desc="示意图" />
    } else {
      return <span>无</span>
    }
  }

}];

@connect(state => ({
  profile: state.flyingpigDetail,
}))
export default class BasicProfile extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchBasic',
    });
  }

  render() {
    const { profile } = this.props;
    const { basicGoods, basicProgress, basicLoading } = profile;
    let goodsData = [];
    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach((item) => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }
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
      title: '商品编号',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        if (index < basicGoods.length) {
          return <a href="">{text}</a>;
        }
        return {
          children: <span style={{ fontWeight: 600 }}>总计</span>,
          props: {
            colSpan: 4,
          },
        };
      },
    }, {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: renderContent,
    }, {
      title: '商品条码',
      dataIndex: 'barcode',
      key: 'barcode',
      render: renderContent,
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: renderContent,
    }, {
      title: '数量（件）',
      dataIndex: 'num',
      key: 'num',
      align: 'right',
      render: (text, row, index) => {
        if (index < basicGoods.length) {
          return text;
        }
        return <span style={{ fontWeight: 600 }}>{text}</span>;
      },
    }, {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (text, row, index) => {
        if (index < basicGoods.length) {
          return text;
        }
        return <span style={{ fontWeight: 600 }}>{text}</span>;
      },
    }];

    const { id } = this.props.match.params
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          {id}
          {/* <div className={styles.title}>图片查看</div>
          <ImageWrapper className={styles.picWrapper} src="https://os.alipayobjects.com/rmsportal/mgesTPFxodmIwpi.png" desc="示意图"/> */}
          <div className={styles.title}><Icon type="profile" /> 订单信息</div>
          <DescriptionList size="large" style={{ marginBottom: 32 }} col={4}>
            <Description term="取货单号">1000000000</Description>
            <Description term="状态">已取货</Description>
            <Description term="销售单号">1234123421</Description>
            <Description term="子订单">3214321432</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}><Icon type="red-envelope" /> 支付信息</div>
          <DescriptionList size="large" style={{ marginBottom: 32 }}>
            <Description term="用户姓名">付小小</Description>
            <Description term="联系电话">18100000000</Description>
            <Description term="常用快递">菜鸟仓储</Description>
            <Description term="取货地址">浙江省杭州市西湖区万塘路18号</Description>
            <Description term="备注">无</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}><Icon type="schedule" /> 委托信息</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={basicLoading}
            dataSource={goodsData}
            columns={goodsColumns}
            rowKey="id"
          />
          <div className={styles.title}><Icon type="form" /> 日志信息</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={basicLoading}
            dataSource={basicProgress}
            columns={progressColumns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

