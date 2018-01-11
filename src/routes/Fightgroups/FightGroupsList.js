import React, {PureComponent} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Card, List, Spin} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Link} from 'dva/router';
import GroupSearchForm from './autoForm/GroupSearchForm';
import request from '../../utils/request';
import less from './FightGroupsList.less';

// @Form.create()  不需要这个装饰器，
@connect(state => ({//目前还没用上这个，后期重构再使用，可以参考自己写的客户列表页
  fightGroupsList: state.fightGroupsList,
}))
export default class TableList extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      dataList: [],
    };
    this.formValues = {//todo 这里耦合太高，记得重构
      state: -1,
      type: -1,
    };//form的数据
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
      p: this.current,
      pc: this.pageSize,
    };
    this.doLoading(true, () => {
      request("/crm/api/demandPool/getGroupList", {method: 'POST', body: param})//todo 这里看看是否有异常情况
        .then(response => {
          if (response instanceof Error) {
            this.doLoading(false);
            return;
          }
          if (response.code >= 1) {
            this.total = response.option.total;
            this.setState({dataList: response.data});
          }
          this.doLoading(false);
        });
    });
  }

  doLoading(loading, cb) {
    this.setState({
      loading
    }, cb);
  }

  getGroupState(group_status) {
    const styleProp = {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      marginRight: '6px',
      borderRadius: '50%',
      marginBottom: "1px",
    };
    let result = '';
    switch (group_status) {
      case 0:
        result = <span><span style={{...styleProp, backgroundColor: '#999'}}></span>拼团关闭</span>;
        break;
      case 1:
        result = <span><span style={{...styleProp, backgroundColor: '#df8600'}}></span>拼团中</span>;
        break;
      case 2:
        result = <span><span style={{...styleProp, backgroundColor: '#33cc66'}}></span>拼团完成</span>;
        break;
      case 3:
        result = <span><span style={{...styleProp, backgroundColor: '#33cc66'}}></span>拼团成功</span>;
        break;
      default:
        result = <span><span style={{...styleProp, backgroundColor: '#ff0300'}}></span>未知的拼团状态</span>;
        break;
    }
    return result;
  }

  /**
   * 传入毫秒数，传出格式化的字符串日期
   * @param milliSecond
   * @returns {string}
   */
  formatDate(milliSecond, format) {
    if (typeof milliSecond !== "number") {
      return '意外的时间格式';
    }
    return moment(milliSecond).format(format);
  }

  getCardHeader(item) {
    const totalPeople = item.paidPeople + item.waitPeople;
    return (
      <div>
        <span style={{float: 'right'}}>{totalPeople}人</span>
        <div style={{textAlign: 'center'}}>{this.getGroupState(item.group_status)}</div>
      </div>
    );
  }

  getCardBody(item) {
    const create_time = this.formatDate(item.create_time, 'YY-MM-DD HH:mm');//17-12-13  18:22
    const date_dep = this.formatDate(item.date_dep, 'YYYY年M月D日');//2018年3月22号
    return (
      <div>
        <div className={less.groupCard_body_lineA}>
          <p>团号：{item.id}&nbsp;&nbsp;</p>
          <p>{create_time}</p>
        </div>
        <p className={less.groupCard_body_lineB}>
          <span style={{float: 'right'}}>
            {date_dep}出发
          </span>
          <span className={less.groupCard_body_lineB_city}>
            {item.city_dep} - {item.city_arr}
          </span>
        </p>
        <div className={less.groupCard_body_lineC}>
          <p>已支付订单：{item.paid}</p>
          <p>待支付订单：{item.wait}</p>
          <p>已拒绝订单：{item.refuse}</p>
        </div>
      </div>
    );
  }

  getCardFooter(item) {
    return <div>
      <Link to={'/fightgroups/demand/checkFightGroups/' + item.id}>
        <span style={{float: 'right'}} href="#">查看</span>
      </Link>
      <span>处理客服：{item.creator_name}</span>
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
          this.loadTableData(data);
        }}
      />
    );
  }

  //生成卡片内容
  renderGroupCard() {
    const {dataList, loading} = this.state;
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
        <div className={less.listParCon}>{/*这个div是less用的*/}
          <List
            grid={{gutter: 24, span: 4}}
            dataSource={dataList}
            // loading={loading}
            pagination={paginationProps}
            className={less.groupCardContainer}
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
        </div>
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
