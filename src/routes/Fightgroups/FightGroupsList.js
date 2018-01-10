import React, { PureComponent } from 'react';
import { Card, List, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Link } from 'dva/router';
import GroupSearchForm from './autoForm/GroupSearchForm';
import request from '../../utils/request';
import less from './FightGroupsList.less';

// @Form.create()  不需要这个装饰器，
export default class TableList extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      dataList: [],
    };
    this.formValues = {};//form的数据
    this.current = 1;
    this.pageSize = 8;
    this.total = 0;
  }

  componentDidMount() {
    //请求数据
    this.loadTableData();
  }

  loadTableData() {
    const param = {
      ...this.formValues,
      currentPage: this.current,
      pageSize: this.pageSize,
    };
    this.doLoading(true, () => {
      request("api/groupsList", { method: 'POST', body: param })//todo 这里看看是否有异常情况
        .then(obj => {
          if (obj instanceof Error) {
            this.doLoading(false);
            return;
          }
          this.total = obj.option.total;
          this.setState({
            dataList: obj.data
          }, () => this.doLoading(false)
          );
        });
    });
  }

  doLoading(loading, cb) {
    this.setState({
      loading
    }, cb);
  }

  getGroupState(groupState) {
    const styleProp = {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      marginRight: '6px',
      borderRadius: '50%',
      marginBottom: "1px",
    };
    let result = '';
    switch (groupState) {
      case 0:
        result = <span><span style={{ ...styleProp, backgroundColor: '#df8600' }}></span>拼团中</span>;
        break;
      case 1:
        result = <span><span style={{ ...styleProp, backgroundColor: '#33cc66' }}></span>拼团完成</span>;
        break;
      case 2:
        result = <span><span style={{ ...styleProp, backgroundColor: '#33cc66' }}></span>拼团成功</span>;
        break;
      case 3:
        result = <span><span style={{ ...styleProp, backgroundColor: '#999' }}></span>拼团关闭</span>;
        break;
    }
    return result;
  }

  getCardHeader(item) {
    return (
      <div>
        <span style={{ float: 'right' }}>{item.groupTotal}人</span>
        <div style={{ textAlign: 'center' }}>{this.getGroupState(item.groupState)}</div>
      </div>
    );
  }

  getCardBody(item) {
    return (
      <div>
        <p className={less.groupCard_body_lineA}><span
          style={{ float: 'right' }}>{item.groupBeginTime.substring(0, 19)}</span>团号：{item.id}&nbsp;&nbsp;&nbsp;</p>
        <p className={less.groupCard_body_lineB}>
          <span style={{ float: 'right' }}>
            {item.groupBeginTime.substring(0, 10)}出发
          </span>
          <span className={less.groupCard_body_lineB_city}>
            {item.fromAddr} - {item.toAddr}
          </span>
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
      <Link to={'/fightgroups/demand/checkFightGroups/' + item.id}><span style={{ float: 'right' }} href="#">查看</span></Link>
      <span>处理客服：盼盼</span>
    </div>;
  }

  //生成form内容
  renderForm() {
    return (
      <GroupSearchForm
        onSearch={data => {
          this.formValues = data;
          this.loadTableData();
        }}
        onCancelAfter={data => {//todo 有点小问题 这里会重置为initialValue,而不是清空
          console.log("form收集的data为：", data);
          this.loadTableData(data);
        }}
      />
    );
  }

  //生成卡片内容
  renderGroupCard() {
    const { dataList, loading } = this.state;
    const paginationProps = {//配置分页器
      showSizeChanger: true,
      showQuickJumper: true,
      current: this.current,
      pageSize: this.pageSize,
      total: this.total,
      pageSizeOptions: ['8', '16', '20', '40'],
      onChange: (page, pageSize) => {//页码改变的回调，参数是改变后的页码及每页条数
        this.pageSize = pageSize;
        this.current = page;
        this.loadTableData();
      },
      onShowSizeChange: (current, size) => {//pageSize 变化的回调
        this.pageSize = size;
        this.current = current;
        this.loadTableData();
      }
    };
    return (
      <Spin spinning={loading}>
        <p>共搜索到{this.total}个拼团</p>
        <List
          grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
          dataSource={dataList}
          // loading={loading}
          pagination={paginationProps}
          className={less.groupCardContainer}
          renderItem={item => {
            const headerContent = this.getCardHeader(item);
            const bodyContent = this.getCardBody(item);
            const footerContent = this.getCardFooter(item);

            return (
              dataList.length === 0 ?
                <h1 style={{ textAlign: 'center' }}>无拼团数据</h1>
                :
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
      </Spin>
    );
  }

  render() {
    return (
      <PageHeaderLayout>
        <div className={less.page}>
          <Card bordered={false}>
            {this.renderForm()}
            {this.renderGroupCard()}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}

//模拟数据
// loadTableData(param, cb) {//一个是请求的json对象，一个是回调函数
//   this.doLoading(true, () => {
//     setTimeout(() => {
//       const code = Math.random() - 0.1;
//       let data = [];
//       if (code > 0) {
//         for (let i = 0; i < (Math.random() * 20 + 5); i++) {
//           data.push({
//             key: i.toString(),
//             groupOrderId: i.toString(),
//             groupState: Math.floor(Math.random() * 4),//拼团状态； 0=>拼团中，1=>拼团完成，2=>拼团成功，3=>拼团关闭
//             groupTotal: Math.floor(Math.random() * 100),
//             groupNum: Math.random(),//团号
//             groupBeginTime: '18-01-01 12:00',//拼团创建时间
//             fromAddr: '上海',
//             toAddr: '北京',
//             hadPayOrder: Math.floor(Math.random() * 10),
//             needPayOrder: Math.floor(Math.random() * 10),
//             refusedPayOrder: Math.floor(Math.random() * 10),
//           });
//         }
//       }
//       cb(code, code > 0 ? "成功" : "失败", data);
//     }, Math.random() * 1000);
//   });
// }
