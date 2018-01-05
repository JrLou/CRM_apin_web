import React, {PureComponent} from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  List,
  message,
  Icon,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import GroupSearchForm from './autoForm/GroupSearchForm';
import request from '../../utils/request';

import less from './List.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// @Form.create()
export default class TableList extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      dataList: [],
    }
  }

  componentDidMount() {
    //请求数据
    this.doLoading(true, () => {
        request("api/groupsList", {method: 'POST', body: {count: 8}})//todo 这里看看是否有异常情况
          .then(obj => {
            if (obj instanceof Error) {
              this.doLoading(false);
              return;
            }
            console.log("obj", obj);
            this.setState({
              dataList: obj.data
            }, () => this.doLoading(false));
          });
      }
      // this.loadTableData({}, (code, msg, data) => {
      //   if (code > 0) {
      //     this.setState({
      //       dataList: data,
      //       loading: false
      //     });
      //   } else {
      //     this.setState({
      //       dataList: [],
      //       loading: false
      //     });
      //     message.error(msg);
      //   }
      // })
    );


  }

  //模拟数据
  loadTableData(param, cb) {//一个是请求的json对象，一个是回调函数
    this.doLoading(true, () => {
      setTimeout(() => {
        const code = Math.random() - 0.1;
        let data = [];
        if (code > 0) {
          for (let i = 0; i < (Math.random() * 20 + 5); i++) {
            data.push({
              key: i.toString(),
              groupOrderId: i.toString(),
              groupState: Math.floor(Math.random() * 4),//拼团状态； 0=>拼团中，1=>拼团完成，2=>拼团成功，3=>拼团关闭
              groupTotal: Math.floor(Math.random() * 100),
              groupNum: Math.random(),//团号
              groupBeginTime: '18-01-01 12:00',//拼团创建时间
              fromAddr: '上海',
              toAddr: '北京',
              hadPayOrder: Math.floor(Math.random() * 10),
              needPayOrder: Math.floor(Math.random() * 10),
              refusedPayOrder: Math.floor(Math.random() * 10),
            });
          }
        }
        cb(code, code > 0 ? "成功" : "失败", data);
      }, Math.random() * 1000);
    });
  }

  doLoading(loading, cb) {
    this.setState({
      loading
    }, cb);
  }

  renderForm() {
    return (
      <GroupSearchForm
        onAction={data => {
          console.log("form收集的data为：", data);
        }}
      />
    );
  }

  getGroupState(groupState) {
    const styleProp = {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      marginRight: '10px',
      borderRadius: '50%',
      marginBottom: "2px",
    };
    let result = '';
    switch (groupState) {
      case 0:
        result = <span><span style={{...styleProp, backgroundColor: '#df8600'}}></span>拼团中</span>;
        break;
      case 1:
        result = <span><span style={{...styleProp, backgroundColor: '#33cc66'}}></span>拼团完成</span>;
        break;
      case 2:
        result = <span><span style={{...styleProp, backgroundColor: '#33cc66'}}></span>拼团成功</span>;
        break;
      case 3:
        result = <span><span style={{...styleProp, backgroundColor: '#999'}}></span>拼团关闭</span>;
        break;
    }
    return result;
  }

  getCardHeader(item) {
    return (
      <div>
        <span style={{float: 'right'}}>{item.groupTotal}人</span>
        <div style={{textAlign: 'center'}}>{this.getGroupState(item.groupState)}</div>
      </div>
    );

  }

  getCardBody(item) {
    return (
      <div>
        <p className={less.groupCard_body_lineA}><span
          style={{float: 'right'}}>{item.groupBeginTime.substring(0, 19)}</span>团号：{item.id}&nbsp;&nbsp;&nbsp;</p>
        <p className={less.groupCard_body_lineB}><span
          style={{float: 'right', fontSize: '14px'}}>{item.groupBeginTime.substring(0, 10)}出发</span>{item.fromAddr}
          - {item.toAddr}
        </p>
        <div className={less.groupCard_body_lineC}>
          <p>已支付订单：{item.hadPayOrder}</p>
          <p>待支付订单：{item.needPayOrder}</p>
          <p>已拒绝订单：{item.refusedPayOrder}</p>
        </div>
      </div>
    );
  }

  getCardFooter(item) {
    return <div>
      <a style={{float: 'right'}} href="#">查看</a>
      <span>处理客服：盼盼</span>
    </div>;
  }


  renderGroupCard() {
    const {dataList} = this.state;
    return (
      dataList.length === 0 ?
        <h1 style={{textAlign: 'center'}}>无拼团数据</h1>
        :
        <List
          grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
          dataSource={dataList}

          renderItem={item => {
            const headerContent = this.getCardHeader(item);
            const bodyContent = this.getCardBody(item);
            const footerContent = this.getCardFooter(item);

            return (
              <List.Item key={item.id}>
                <div className={less.groupCard}>
                  <div className={less.groupCard_header}>{headerContent}</div>
                  <div className={less.groupCard_body}>{bodyContent}</div>
                  <div className={less.groupCard_footer}>{footerContent}</div>
                </div>
              </List.Item>
            )
          }}
        />
    );
  }

  render() {
    const {loading} = this.state;

    return (
      <PageHeaderLayout
        title="卡片列表"
      >
        <Card
          bordered={false}
          loading={loading}
        >
          {this.renderForm()}
          {this.renderGroupCard()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
