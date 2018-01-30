/*eslint camelcase: 0*/ //取消驼峰限制
import React, { PureComponent } from "react";
import { connect } from "dva";
import { Card, List, Spin } from "antd";
import { Link } from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import GroupSearchForm from "./autoForm/GroupSearchForm";
import { formatDate } from "../../utils/utils";
import less from "./FightGroupsList.less";
import styles from "./Demand.less";

@connect(state => ({
  //目前还没用上这个，后期重构再使用，可以参考自己写的客户列表页
  fightGroupsList: state.fightGroupsList,
}))
export default class TableList extends PureComponent {
  constructor() {
    super();
    this.page = {
      current: 1,
      pageSize: 12,
    };
  }

  componentDidMount() {
    this.formValues = {
      //初始化formValues
      state: -1, //拼团状态验证 0、已关闭；1、拼团中；2、已成团；-1 全部
      type: -1, //-1 全部 0 国内 1 国外
    };
    this.loadTableData();
  }

  getGroupState(group_status) {
    const styleProp = {
      display: "inline-block",
      width: "8px",
      height: "8px",
      marginRight: "6px",
      borderRadius: "50%",
      marginBottom: "1px",
    };
    const obj = this.mapGroupStateToTxt(group_status);
    return (
      <span className={styles.titleBox}>
        <span style={{ ...styleProp, backgroundColor: obj.backgroundColor }} />
        <span>{obj.txt}</span>
      </span>
    );
  }

  getCardBody(item) {
    const create_time = formatDate(item.create_time, "YY-MM-DD HH:mm"); //17-12-13  18:22
    const date_dep = formatDate(item.date_dep, "YYYY年M月D日"); //2018年3月22号
    return (
      <div>
        <div className={less.groupCard_body_lineA}>
          <p>团号：{item.id}&nbsp;&nbsp;</p>
          <p>{create_time}</p>
        </div>
        <p className={less.groupCard_body_lineB}>
          <span className={less.groupCard_body_lineB_time}>{date_dep}出发</span>
          <span className={less.groupCard_body_lineB_city}>
            {item.city_dep} - {item.city_arr}
          </span>
        </p>
        <div className={less.groupCard_body_lineC}>
          <p>已支付订单：{item.paid}</p>
          {item.group_status === 1 ? <p>待支付订单：{item.wait}</p> : null}
          <p>已拒绝订单：{item.refuse}</p>
        </div>
      </div>
    );
  }

  mapGroupStateToTxt(group_status) {
    let result = {};
    switch (group_status) {
      case 0:
        result = {
          txt: "拼团关闭",
          backgroundColor: "#999",
        };
        break;
      case 1:
        result = {
          txt: "拼团中",
          backgroundColor: "#df8600",
        };
        break;
      case 2:
        result = {
          txt: "拼团完成",
          backgroundColor: "#33cc66",
        };
        break;
      case 3:
        result = {
          txt: "拼团成功",
          backgroundColor: "#33cc66",
        };
        break;
      default:
        result = {
          txt: "未知的拼团状态",
          backgroundColor: "#ff0300",
        };
        break;
    }
    return result;
  }

  //请求table数据
  loadTableData() {
    if (this.props.fightGroupsList.double) {
      return;
    }
    const { dispatch } = this.props;
    const params = {
      ...this.formValues,
      p: this.page.current,
      pc: this.page.pageSize,
    };
    if (!this.props.fightGroupsList.loading) {
      dispatch({
        type: "fightGroupsList/fetch",
        payload: params,
      });
    }
  }

  resetCurrPage() {
    this.page.current = 1;
  }

  //生成form内容
  renderForm() {
    const { fightGroupsList: { loading } } = this.props;
    return (
      <div className={less.formContainer}>
        <GroupSearchForm
          onSearch={data => {
            this.formValues = data;
            this.resetCurrPage();
            if (!loading) {
              this.loadTableData();
            }
          }}
          onCancelAfter={data => {
            this.formValues = data;
            this.resetCurrPage();
            if (!loading) {
              this.loadTableData();
            }
          }}
        />
      </div>
    );
  }

  //生成卡片内容
  renderGroupCard() {
    const { dispatch, fightGroupsList: { listData, loading } } = this.props;
    const paginationProps = {
      //配置分页器
      showSizeChanger: true,
      showQuickJumper: true,
      current: this.page.current,
      pageSize: this.page.pageSize,
      total: listData && listData.option && listData.option.total,
      pageSizeOptions: ["12", "16", "20", "24"],
      onChange: (page, pageSize) => {
        //页码改变的回调，参数是改变后的页码及每页条数
        this.page.pageSize = pageSize;
        this.page.current = page;
        this.loadTableData();
      },
      onShowSizeChange: (current, size) => {
        //pageSize 变化的回调
        this.page.pageSize = size;
        this.page.current = current;
        this.loadTableData();
      },
    };
    return (
      <Spin spinning={loading}>
        <p>共有{listData && listData.option && listData.option.total}个拼团</p>
        <div className={less.listParCon}>
          {/*这个div是less用的*/}
          <List
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={listData && listData.data}
            pagination={paginationProps}
            renderItem={item => {
              return (
                <List.Item key={item.id}>
                  <Card
                    className={styles.card}
                    title={this.getGroupState(item.group_status)}
                    extra={`${item.paidPeople + item.waitPeople}人`}
                    actions={[
                      <span>处理客服:{item.creator_name}</span>,
                      <Link
                        to={`/fightgroups/demand/checkFightGroups/${item.id}`}
                      >
                        <span style={{ color: "#1890ff" }}>查看</span>
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      description={
                        <div className={less.groupCard_body}>
                          {this.getCardBody(item)}
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              );
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
          <Card bordered={false} className="poolListBox">
            {this.renderForm()}
            {this.renderGroupCard()}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
