import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Modal,
  Table,
  Divider,
  Tabs,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import moment from 'moment';
import css from './PriceList.less';
import Manual from './PricelistForm.js';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const {Column,} = Table;
const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const {Option} = Select;
@connect(state => ({
  priceList: state.priceList,
}))
@Form.create()
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      visible: false,
      keys: 1,
      condition: null,
      currentData: null,
    }
  }

  componentDidMount() {
    //加载第一页
    this.props.dispatch({
      type: 'priceList/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });

  }

  companyname(ole, e, event) { //全局函数（根据ole作为标识可以快速查找各功能实现位置）
    switch (ole) {
      case 0: //新增
        this.setState({visible: true, condition: 3, currentData: {detail: [new Date().getTime()]}})
        break;
      case 1: //弹窗确认按钮所调函数
        this.setState({visible: false,condition:4})
    }
  }

  handleFormReset() {
    if (this.props.priceList.double) {
      return null
    }
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'priceList/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });
  };

  selectTime(date, dateString) {
    this.setState({
      timeArr: dateString,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.priceList.double) {
      return null
    }
    this.setState({
      isLoadingSearch: true
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
        values.p = 1;
        values.pc = 10;
        let dates = {};
        for (let i in values) {
          if (values[i] != undefined) {
            dates[i] = values[i];
          }
        }
        this.setState({
          filter: dates,
        });
        if(this.state.keys==1){
          this.props.dispatch({
            type: 'priceList/fetch',
            payload: dates,
          });
        } else {
          this.props.dispatch({
            type: 'priceList/fetchs',
            payload: dates,
          });
        }

      }
    });
  }

  renderForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="机票资源号">
              {getFieldDecorator('id', {rules: [{max: 32, message: '最长32位'}]})
              (<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
             <Button style={{marginRight: 8}} type="primary" onClick={this.companyname.bind(this, 0)}>新增政策</Button>
             <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={::this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  operating(data, ole) {
    let _this = this;
    const confirms = (data, titlea) => {
      confirm({
        title: titlea,
        onOk() {
          _this.props.dispatch({
            type: 'priceList/changeStatus',
            payload: {status: data, filter: {..._this.state.filter, p: 1, pc: 10}},
          });
        },
        onCancel() {
        },
      });
    }
    switch (ole) {
      case 0: // 编辑
        this.setState({visible: true, condition: 0, currentData: data})
        // this.props.history.push({
        //   pathname: 'priceList/Edit',
        //   state: {
        //     data: data,
        //   }
        // });
        break;
      case 1: //日志
        this.setState({visible: true, condition: 1})
        _this.props.dispatch({
          type: 'priceList/loglist',
          payload: {
            id: data.id,
          },
        });
        break;
      case 2: // 编辑
        this.setState({visible: true, condition: 2, currentData: data})
        break;
      case 3:
        if (data.state == 1) {
          confirms({
            state: 0,
            id: data.id,
          }, "您确定要停用吗？");
        } else {
          confirms({
            state: 1,
            id: data.id,
          }, "您确定要启用吗？");
        }
        break;
      case 9:
        _this.setState({visible: true})
        _this.props.dispatch({
          type: 'priceList/loglist',
          payload: {
            p: 1,
            pc: 100,
            uuid: data.id,
          },
        });
        break;
      case 10:
        _this.props.history.push({
          pathname: 'priceList/View',
          state: {
            data: data,
          }
        });
        break;
    }
  }

  callback(key) {
    this.setState({
      keys: key,
    });
    this.props.dispatch({
      type: key == 1 ? 'priceList/fetch' : 'priceList/fetchs',
      payload: {
        p: 1,
        pc: 10,
      },
    });
  }

  compare(property) {
    console.log(property)
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }

  success() {
    this.setState({visible: false})
    this.props.dispatch({
      type: 'priceList/fetch',
      payload: {
        p: 1,
        pc: 10,
      },
    });
    this.props.dispatch({
      type: 'priceList/fetchs',
      payload: {
        p: 1,
        pc: 10,
      },
    });
    this.setState({
      visible: false,
    });
  }

  render() {
    const {priceList: {loading, data, datas, list: {option: {current, size, total}}, logs: {data: datalis, option}}} = this.props;
    const {keys, condition} = this.state
    const columns = [
      {
        title: '操作人',
        dataIndex: 'creator_name',
        key: 'creator_name',
      }, {
        title: '操作时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (text, data) => {
          return moment(data.create_time).format("YYYY-MM-DD hh:mm:ss");
        }
      }, {
        title: '操作内容',
        dataIndex: 'content',
        key: 'content',
      }];

    const columnsss = [{
      title: '序号',
      dataIndex: 'id',
      colSpan: keys == 2 ? 1 : 0,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = keys == 2 ? 1 : 0;
        return obj;
      },
    }, {
      title: '机票资源号',
      dataIndex: 'airline_id',
      colSpan: keys == 2 ? 1 : 0,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        obj.props.rowSpan = keys == 2 ? 1 : 0;
        return obj;
      },
    }, {
      title: '班期',
      dataIndex: 'detail',
      colSpan: keys == 2 ? 1 : 0,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (row.detail) {
          for (let i = 0; i < row.detail.length; i++) {
            row.detail[i] = moment(row.detail[i]).format("YYYY-MM-DD")
          }
          obj.children = row.detail.join(',')
        }
        obj.props.rowSpan = keys == 2 ? 1 : 0;
        return obj;
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      colSpan: keys == 2 ? 1 : 0,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (row.state == 0) {
          obj.children = "停用"
        } else {
          obj.children = "启用"
        }
        obj.props.rowSpan = keys == 2 ? 1 : 0;
        return obj;
      },
    }, {
      title: '采购类型',
      dataIndex: 'name',
      colSpan: keys == 2 ? 0 : 1,
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (keys == 1) {
          if (index < 3) {
            obj.children = '代销'
            obj.props.rowSpan = 0;
          } else {
            obj.children = '硬切'
            obj.props.rowSpan = 0;
          }
          if (index === 0) {
            obj.props.rowSpan = 3;
          }
          if (index === 3) {
            obj.props.rowSpan = 3;
          }
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    }, {
      title: '航线类型',
      dataIndex: 'age',
      render: (text, row, index) => {
        switch (index) {
          case 0:
            text = '国际长线'
            break;
          case 1:
            text = '国际短线'
            break;
          case 2:
            text = '国内航线'
            break;
          case 3:
            text = '国际长线'
            break;
          case 4:
            text = '国际短线'
            break;
          case 5:
            text = '国内航线'
            break;
        }
        return {
          children: <span>{text}</span>,
        };
      },
    }, {
      title: '加价比例/金额',
      dataIndex: 'type',
      render: (text, row, index) => {
        return {
          children:
            <span>{row.percent ? "+" + row.percent + "%" : ''}{(row.price && row.percent ) ? " / " : ''}{row.price ? "+￥" + (row.price / 100) : ''}</span>,
        };
      },
    }, {
      title: '加价比例/金额（系列团）',
      dataIndex: 'types',
      render: (text, row, index) => {
        return {
          children:
            <span>{row.percent_group ? "+" + row.percent_group + "%" : ''}{(row.percent_group && row.price_group) ? " / " : ''}{row.price_group ? "+￥" + (row.price_group / 100) : ''}</span>,
        };
      },
    }, {
      title: '更新时间',
      dataIndex: 'update_time',
      render: (text, row, index) => {
        return {
          children: <span>{moment(row.update_time).format("YYYY-MM-DD HH:mm:ss")}</span>,
        };
      },
    }, {
      title: '操作人',
      dataIndex: 'creator_name',
    }, {
      title: '操作',
      dataIndex: 'operating',
      render: (text, row, index) => {
        const obj = {
          children: text,
          props: {},
        };
        if (this.state.keys == 1) {
          obj.children = <div>
            <a style={{cursor: "pointer", margin: "6px"}}
               onClick={this.operating.bind(this, row, 0)}>编辑
            </a>
            <Divider type="vertical"/>
            <a style={{cursor: "pointer", margin: "6px"}}
               onClick={this.operating.bind(this, row, 1)}>日志
            </a>
          </div>
        } else {
          obj.children = <div>
            <a style={{cursor: "pointer", margin: "6px"}}
               onClick={this.operating.bind(this, row, 2)}>编辑
            </a>
            <Divider type="vertical"/>
            {row.state == 0 && <a style={{cursor: "pointer", margin: "6px"}}
                                  onClick={this.operating.bind(this, row, 3)}>启用
            </a>
            }
            {row.state == 1 && <a style={{cursor: "pointer", margin: "6px"}}
                                  onClick={this.operating.bind(this, row, 3)}>停用
            </a>
            }

            <Divider type="vertical"/>
            <a style={{cursor: "pointer", margin: "6px"}}
               onClick={this.operating.bind(this, row, 1)}>日志
            </a>
          </div>
        }
        return obj;
      },
    }];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
            <TabPane tab="通用加价配置" key="1"></TabPane>
            <TabPane tab="特殊价格配置" key="2"></TabPane>
          </Tabs>
          <div className={css.tableList}>
            <div className={css.tableListForm}>
              {keys == 2 ? this.renderForm() : null}
            </div>
            <Table
              columns={columnsss}
              loading={loading}
              dataSource={keys == 1 ? data.sort(function (a, b) {
                if (a.airline_id < b.airline_id) {
                  return -1;
                } else if (a.airline_id > b.airline_id) {
                  return 1;
                }
                return 0;
              }) : datas}
              rowKey={'id'}
              pagination={this.state.keys == 2 ? {
                pageSize: size ? size : 10,
                total: total ? total : 0,
                current: current ? current : 1,
                showSizeChanger: true,
                showQuickJumper: true
              } : false}
              onChange={(pagination, filters, sorter) => {
                let val = this.state.filter;
                val.p = pagination.current;
                val.pc = pagination.pageSize;
                this.props.dispatch({
                  type: 'priceList/fetchs',
                  payload: val,
                });
              }}
            >
            </Table>
            <Modal
              title="编辑"
              visible={this.state.visible}
              onOk={this.companyname.bind(this, 1)}
              onCancel={this.companyname.bind(this, 1)}
              width={'600px'}
              footer={null}
            >
              {(condition == 0 || condition == 2 || condition == 3) ?
                <Manual currentData={this.state.currentData} success={this.success.bind(this)}
                        condition={condition}/> : null}
              {condition == 1 ?
                <Table pagination={false}
                       rowKey={'id'}
                       dataSource={datalis ? datalis : []} columns={columns}/> : null
              }

            </Modal>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}


