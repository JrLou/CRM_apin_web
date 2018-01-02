import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import css from './RightManagement.less';
import { Button, Input, message, Table, Modal, Row, Col, Tree, Form } from 'antd';
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const { Column } = Table;
// import HttpTool from '../../../http/HttpTool.js';
// import APILXF from '../../../http/APILXF.js';
import _ from 'underscore';
import Spin from 'antd/lib/spin';

@connect(state => ({
  gData: state.role.gData,
  sonData: state.role.sonData,
  post: state.role.post,
}))
@Form.create()
class page extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tableLoading: false,
      // Check here to configure the default column
      loading: false,
      selectedRowKeys: [],  // Check here to configure the default column
      rememberSelected: {},
      currrentTable: '',
      expandedKeys: [],
      selectedKeys: [],
      oldselectedKeys: [],
      checkedKeys: [],
      tableDataSource: [],
      //thirdData: [],
    }
    this.getTableView = this.getTableView.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
  }

  setOwn(json) {
    // 如果是带过来id认为是编辑
    if (this.props.post.id) {
      // HttpTool.get(APILXF.v2_role_ownFunctionList,
      //     (code, msg, json, option) => {
      //         if (code == 200) {
      let expandedKeys = []
      let selectedKeys = []
      let toRemember = {}
      // 关联2级和3级  // 勾选2级
      json.map((v, k) => {
        if (toRemember[v.parentId]) {
          toRemember[v.parentId].push(v.id)
        } else {
          toRemember[v.parentId] = [v.id]
        }
        if (selectedKeys.indexOf(v.parentId) == -1) { selectedKeys.push(v.parentId) }
      })
      //   寻找默认打开的key
      this.state.gData.map((v, k) => {
        v.functionList.map((_v, _k) => {
          // 如果2级已勾选找到一级  并且防止重复
          if (selectedKeys.indexOf(_v.id) > -1 && expandedKeys.indexOf('parent-' + _v.groupId) == -1) {
            expandedKeys.push('parent-' + _v.groupId)
          }
        })
      })
      this.setState({
        checkedKeys: selectedKeys,
        oldselectedKeys: selectedKeys,
        selectedKeys: [],
        expandedKeys: expandedKeys,
        rememberSelected: toRemember
      })

    }
    // else {
    //             message.warning(msg);
    //         }

    //     },
    //     (code, msg, option) => {
    //         message.warning(msg);
    //     }
    //     , { roleId: this.props.post.id }
    // )
    // }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'role/fetchV2RoleFunctionList',
    })
  }
  getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
  }

  searchResult(query) {
    return (new Array(this.getRandomInt(5))).join('.').split('.')
      .map((item, idx) => ({
        query,
        category: `${query}${idx}`,
        count: this.getRandomInt(200, 100),
      }));
  }

  renderOption(item) {
    return (
      <Option key={item.category} text={item.category}>
        {item.query}
      </Option>
    );
  }

  handleSearch(value) {
    //请求接口
    this.setState({
      dataSource: value ? this.searchResult(value) : [],
    });
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys });
    // 记录不同table选中的状态
    let current = this.state.currrentTable;
    // 如果子节点大于一父节点自动勾选
    if (selectedRowKeys.length > 0) {
      if (this.state.checkedKeys.indexOf(current) == -1) {
        this.setState({
          checkedKeys: this.state.checkedKeys.concat([current])
        })
      }
    }

    let oringinRememberSelected = this.state.rememberSelected;
    oringinRememberSelected[current] = selectedRowKeys;
    this.setState({
      rememberSelected: oringinRememberSelected
    })
  }
  updateTable(currentKey) {
    let sonFunctionList = this.props.sonData;
    let tableData = []
    sonFunctionList.map((v, k) => {
      if (v.functionId == currentKey) {
        tableData = v.list

      }
    })
    this.setState({
      currrentTable: currentKey,
      tableDataSource: tableData,
    })
    // 如果是全选手动打全选钩
    if (this.props.rememberSelected[currentKey] && this.props.rememberSelected[currentKey].length == tableData.length) {
      let allCheck = document.getElementsByClassName("rightTable")[0].getElementsByTagName("th")[0].getElementsByTagName("input");
      setTimeout(() => {
        allCheck[0].parentNode.classList.add("ant-checkbox-checked");
        // 父元素span加上ant-checkbox-checked才会生效
      }, 10);
    }

  }
  render() {
    var div = (
      <div className={css.main}>
        {this.getTableView()}
      </div>
    );
    return div;
  }
  getSelectedKeys(keysArr, checkedArr, unCheckedArr) {
    // 勾选或者取消都的处理remember
    let oringinRememberSelected = this.state.rememberSelected;
    unCheckedArr.length > 0 && unCheckedArr.map((v, k) => {
      oringinRememberSelected[v] = []
    })
    checkedArr.length > 0 && checkedArr.map((v, k) => {
      oringinRememberSelected[v] = this._getSons(v)
    })
    // 记录新选择
    this.setState({
      rememberSelected: oringinRememberSelected,
      selectedKeys: keysArr,
      checkedKeys: keysArr
    })
  }
  _getSons(id) {
    let sonIds = []
    this.props.sonData.map((v, k) => {
      if (v.functionId == id) {
        v.list.map((_v, _k) => {
          sonIds.push(_v.id)
        })
      }
    })
    return sonIds
  }
  upExpandedKeys(expandedKeys) {
    this.setState({ expandedKeys })
  }
  getTableView() {
    const currentSelected = this.state.rememberSelected[this.state.currrentTable];
    // const currentSelected = this.state.rememberSelected[this.state.currrentTable]
    const rowSelection = {
      selectedRowKeys: currentSelected,
      onChange: this.onSelectChange,
      // selectedRowKeys:this.state.selectedRowKeys,

    };
    return (
      <Spin spinning={this.state.loading}>
        <div className={css.table_container}>
          <h2>{this.props.post.title}</h2>
          <div style={{ marginTop: "30px", marginBottom: "30px" }}>角色名称：
                  <Input defaultValue={this.props.post.name} id="roleName" style={{ width: "200px" }} placeholder="请输入" /></div>
          <hr />
          <h2 style={{ margin: "20px 0" }}>设置权限</h2>
          <Row>
            <Col span={5} >
              <div className={css.tip}>所有权限</div>
              <div className={css.grid}>
                <RightsTree
                  upExpandedKeys={this.upExpandedKeys.bind(this)}
                  expandedKeys={this.state.expandedKeys}
                  selectedKeys={this.state.selectedKeys}
                  checkedKeys={this.state.checkedKeys}
                  upSelectedKeys={this.getSelectedKeys.bind(this)}
                  gData={this.props.gData}
                  currentClick={this.updateTable.bind(this)}
                // thirdData={this.state.thirdData}
                //showThirdTable={this.showThirdTable.bind(this)}
                />
              </div>
            </Col>
            <Col span={6} offset={1}>
              <div className={css.tip}>权限点列表</div>
              <div className={css.grid} style={{ overflow: "hidden" }}>
                <Table
                  className="rightTable"
                  scroll={{ y: 435 }}
                  bordered={true}
                  loading={this.state.tableLoading}
                  dataSource={this.state.tableDataSource}
                  rowKey={record => record.id}
                  pagination={false}
                  rowSelection={rowSelection}
                >
                  <Column
                    title="权限名称"
                    dataIndex="name"
                    key="name"
                  />
                </Table>
              </div>
            </Col>
          </Row>
          <div className={css.btnGroup}>
            <Button
              style={{ marginRight: '15px' }}
              type="primary" size="large"
              onClick={() => {
                let roleName = document.getElementById("roleName").value;
                if (!roleName) {
                  message.warning('请输入角色名称再保存。')
                  return
                }
                {/* 筛选非parent开头的id */ }
                let idList = this.state.checkedKeys.filter((v, k) => {
                  return v.slice(0, 6) != "parent"
                })
                let that = this
                let sonIds = []


                let originObj = this.state.rememberSelected;
                for (var key in originObj) {
                  if (originObj.hasOwnProperty(key)) {
                    var element = originObj[key];
                    {/* 勾选了父节点才会传后台 */ }
                    if (this.state.checkedKeys.indexOf(key) > -1) {
                      sonIds = sonIds.concat(element)
                    }
                  }
                }

                {/*判断编辑还是增加  */ }
                let url, param, isPut = undefined
                if (this.props.post.id) {
                  {/*判断是否更改过  */ }
                  let isModified = true
                  isPut = "put"
                  {/* 加了子节点这里的判断也要改 */ }
                  if (_.isEqual(idList, this.state.oldselectedKeys) && roleName == this.props.post.name) {
                    isModified = false
                  }
                  param = {
                    roleId: this.props.post.id,
                    roleName: roleName,
                    functionIdList: idList,
                    isModified: true,
                    functions: sonIds
                  }
                } else {
                  param = {
                    roleName: roleName,
                    // functionIdList: idList,
                    // sonIdList: sonIds,
                    functions: sonIds,
                  }
                }
                confirm({
                  title: '注意',
                  content: '你确定要保存吗？',
                  onOk: () => {
                    // this.setState({ loading: true })
                    if (this.props.post.id) {
                      this.props.dispatch({
                        type: 'role/edit',
                        param
                      })
                    } else {
                      this.props.dispatch({
                        type: 'role/add',
                        param
                      })
                    }
                    // HttpTool.post(url,
                    //   (code, msg, json, option) => {
                    //     if (code == 200) {
                    //       message.success('操作成功！')
                    //       this.setState({ loading: false })
                    //       that.props.closeTab()
                    //       if (typeof this.props.callBack === 'function') {
                    //         this.props.callBack()
                    //       }
                    //       that.props.openTab2({
                    //         path: "RoleManage",
                    //         title: "角色管理",
                    //         post: '',
                    //       })
                    //     } else {
                    //       message.warning(msg);
                    //       this.setState({ loading: false })
                    //     }
                    //   },
                    //   (code, msg, option) => {
                    //     message.warning(msg);
                    //     this.setState({ loading: false })
                    //   }
                    //   , param
                    //   , isPut
                    // )

                  },
                  onCancel() { },
                });
              }}
            >保存</Button>
            <Button
              type="default" size="large"
              onClick={() => {
                this.props.closeTab()
              }}
            >取消</Button>
          </div>
        </div>
      </Spin>
    )
  }
  edit(index, key, value) {
    const { tableDataSource } = this.state;
    tableDataSource[index][key] = value;
    this.setState({ tableDataSource });
  }
}


class RightsTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: props.expandedKeys,
      selectedKeys: [],
      checkedKeys: [],
    }
    this._selectedKeys = []
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      expandedKeys: nextProps.expandedKeys,
      selectedKeys: nextProps.selectedKeys,
      checkedKeys: nextProps.checkedKeys,
    })
  }
  onExpand(expandedKeys) {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys
    });
    this.props.upExpandedKeys(expandedKeys)
  }
  onSelect(selectedKeys, info) {
    // 如果是父组件，不选择，只是展开或收缩。
    let expandedKeys = this.state.expandedKeys;
    if (selectedKeys.length > 0 && selectedKeys[selectedKeys.length - 1].slice(0, 6) == "parent") {
      let index = expandedKeys.indexOf(selectedKeys[selectedKeys.length - 1]);
      index > -1 ?
        expandedKeys.splice(index, 1)
        :
        expandedKeys.push(selectedKeys[selectedKeys.length - 1]);
      this.setState({ expandedKeys: expandedKeys })

      return
    } else {
      // 子节点根据selectedKeys 获取子节点
      this.props.currentClick(selectedKeys[0])
      this._selectedKeys = selectedKeys
      // this.setState({ selectedKeys: selectedKeys })
      return
    }

    /*let oldKeysLength = this.state.selectedKeys.length;
    if (selectedKeys.length > 0) {
        this.setState({ selectedKeys })
        this.props.upSelectedKeys(selectedKeys)
        // 如果keys长度减小了说明是取消
        if (oldKeysLength > selectedKeys.length) {
            // 右侧table清空 右侧选中的checkbox也清空
        } else {
            // 获取右侧列表数据
        }
        // this.props.createTable()
        // 记录当前table的id   保存选中状态的数据
        // this.props.currrentTable(selectedKeys[0])
    } else {
        this.setState({ selectedKeys })
        return
    }*/
  }

  onCheck(checkedKeys, info) {
    //let expandedKeys = this.state.expandedKeys;
    // this.props.showThirdTable()
    let originChecked = this.state.checkedKeys.filter((v, k) => {
      return v.slice(0, 6) !== "parent"
    });
    let nowChecked = checkedKeys.filter((v, k) => {
      return v.slice(0, 6) !== "parent"
    });
    // 判断是打上勾还是去掉勾，并拿出来。
    let checked = [], unChecked = [];
    if (originChecked.length > nowChecked.length) {
      // 取消了钩钩
      originChecked.map((v, k) => {
        if (nowChecked.indexOf(v) == -1) {
          unChecked.push(v)
        }
      })
    } else {
      // 打上钩钩
      nowChecked.map((v, k) => {
        if (originChecked.indexOf(v) == -1) {
          checked.push(v)
        }
      })
    }
    // 把勾选信息传到父级
    this.props.upSelectedKeys(checkedKeys, checked, unChecked)
    this.setState({
      checkedKeys: checkedKeys
    })
  }
  render() {
    const loop = data => data.map((item) => {

      if (item.functionList) {
        return (
          <TreeNode isLeaf={true} key={"parent-" + item.id} title={item.name} >
            {loop(item.functionList)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf={true} key={item.id} title={item.name} />;
    });
    // 剔除系统设置。
    let finalTreeData = this.props.gData && this.props.gData.filter((v, k) => {
      return v.name !== '系统设置'
    })
    return (
      <Tree
        checkable={true}
        multiple={false}
        onExpand={this.onExpand.bind(this)}
        expandedKeys={this.state.expandedKeys}
        checkedKeys={this.state.checkedKeys}
        onCheck={this.onCheck.bind(this)}
        onSelect={this.onSelect.bind(this)}
        selectedKeys={this._selectedKeys}
      >
        {this.props.gData && loop(finalTreeData)}
      </Tree>
    );
  }
}

export default page;
