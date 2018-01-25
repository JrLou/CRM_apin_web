import React, { PureComponent } from "react";
import { connect } from "dva";
import { Table, Button } from "antd";
import { Base64 } from "js-base64";
import CookieHelp from "../../utils/cookies";
import styles from "./TableList.less";

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  constructor() {
    super();
    this.currentUser = CookieHelp.getCookieInfo("_r")
      ? Base64.decode(CookieHelp.getCookieInfo("_r"))
      : null;
  }

  getPageName = () => {
    const { customerMannagement: { pageType } } = this.props;
    return pageType === "s" ? "供应商" : "客户";
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const {
      customerMannagement: { pageType, loading, data: { data, option } },
      handleShowModalSwitch,
      page,
      dispatch,
    } = this.props;
    const isLeader =
      !!this.currentUser &&
      this.currentUser
        .split(",")
        .indexOf("716103936e1a461ab79dcb7283a979b8") !== -1;
    const columnsForS = [
      {
        title: `${this.getPageName()}名称`,
        dataIndex: "name",
        width: "10%",
      },
      {
        title: "地址",
        dataIndex: "address",
        width: "13%",
      },
      {
        title: "联系人",
        dataIndex: "contacts",
        width: "10%",
      },
      {
        title: "电话号码",
        dataIndex: "mobile",
        width: "11%",
      },
      {
        title: "微信/QQ",
        dataIndex: "wxqq",
        width: "10%",
      },
      {
        title: "优势线路",
        dataIndex: "predominantLine",
        width: "20%",
      },
      {
        title: "操作日期",
        dataIndex: "updateTime",
        render: text => (
          <span style={{ whiteSpace: "nowrap" }}>
            {typeof text === "string" && text.substring(0, 10)}
          </span>
        ),
      },
      {
        title: "操作人",
        dataIndex: "updateUserName",
        render: text => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
      },
      {
        title: "编辑",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              <Button
                disabled={!isLeader}
                type="primary"
                onClick={() => {
                  handleShowModalSwitch("edit");
                  dispatch({
                    type: "customerMannagement/fetchQueryOne",
                    payload: { id: record.id },
                  });
                }}
              >
                修改
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                disabled={!isLeader}
                type="primary"
                onClick={() => {
                  handleShowModalSwitch("delete");
                  dispatch({
                    type: "customerMannagement/extendAll",
                    payload: { deleteItemId: record.id },
                  });
                }}
              >
                删除
              </Button>
            </div>
          );
        },
      },
    ];
    const columnsForC = [
      {
        title: `${this.getPageName()}名称`,
        dataIndex: "name",
        width: "12%",
      },
      {
        title: "地址",
        dataIndex: "address",
        width: "24%",
      },
      {
        title: "联系人",
        dataIndex: "contacts",
        width: "12%",
      },
      {
        title: "电话号码",
        dataIndex: "mobile",
        width: "14%",
      },
      {
        title: "微信/QQ",
        dataIndex: "wxqq",
        width: "11%",
      },
      {
        title: "操作日期",
        dataIndex: "updateTime",
        render: text => (
          <span style={{ whiteSpace: "nowrap" }}>
            {typeof text === "string" && text.substring(0, 10)}
          </span>
        ),
      },
      {
        title: "操作人",
        dataIndex: "updateUserName",
        render: text => <span style={{ whiteSpace: "nowrap" }}>{text}</span>,
      },
      {
        title: "编辑",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <div style={{ whiteSpace: "nowrap" }}>
              <Button
                disabled={!isLeader}
                type="primary"
                onClick={() => {
                  handleShowModalSwitch("edit");
                  dispatch({
                    type: "customerMannagement/fetchQueryOne",
                    payload: { id: record.id },
                  });
                }}
              >
                修改
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                disabled={!isLeader}
                type="primary"
                onClick={() => {
                  handleShowModalSwitch("delete");
                  dispatch({
                    type: "customerMannagement/extendAll",
                    payload: { deleteItemId: record.id },
                  });
                }}
              >
                删除
              </Button>
            </div>
          );
        },
      },
    ];
    const columns = pageType === "s" ? columnsForS : columnsForC;
    const pageProps = {
      current: page.pageNum,
      pageSize: page.pageSize,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pageProps,
      total: option,
    };
    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
