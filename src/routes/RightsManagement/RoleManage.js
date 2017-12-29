import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message
} from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './RoleManage.less';

const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  roleManageList: state.roleManageList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    page: {
      currentPage: 1,
      pageSize: 5
    },
    options: [],
  };

  componentDidMount() {
    this.getList();
  }

  componentWillMount() {

  }

  getList() {
    const values = this.props.form.getFieldsValue();
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = '';
      }
    }
    this.setState({
      formValues: values,
    });
    let {page}=this.state;
    let params = Object.assign(page, values);
    this.props.dispatch({
      type: 'roleManageList/fetch',
      payload: params,
    });
  }

  //getOption() {
  //  let {roleManageList}=this.props, options = [<Option key={"请选择"} value=''>请选择</Option>];
  //  console.log("数据", roleManageList);
  //  roleManageList.data.list.map((v, k) => {
  //    console.log("u+++++++++++++", v);
  //    options.push(<Option key={v.id} value={v.id}>{v.name}</Option>)
  //  });
  //  this.setState({options: options})
  //}

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'roleManageList/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    dispatch({
      type: 'roleManageList/fetch',
      payload: {},
    });
  };
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }
  render() {
    console.log("props_______________", this.props);
    let {getFieldDecorator} = this.props.form;
    let {roleManageList}=this.props;
    let {selectedRows, modalVisible, addInputValue} = this.state;
    console.log("xuanze", this.state.options);
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={::this.getList} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                  <Col md={8} sm={24}>
                    <FormItem label="角色ID">
                      {getFieldDecorator('id')(
                        <Input placeholder="请输入"/>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
                    <FormItem label="角色名称">
                      {getFieldDecorator('name')(
                        <Select placeholder="请选择" style={{width: '100%'}}>
                          {roleManageList.data?
                            roleManageList.data.map((v, k) => {
                              console.log("u+++++++++++++", v);
                              options.push(<Option key={v.id} value={v.id}>{v.name}</Option>)
                            }):null
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                创建角色
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={roleManageList.loading}
              data={roleManageList.list}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="新建规则"
          visible={modalVisible}
          onOk={this.handleAdd}
          onCancel={() => this.handleModalVisible()}
        >
          <FormItem
            labelCol={{span: 5}}
            wrapperCol={{span: 15}}
            label="描述"
          >
            <Input placeholder="请输入" onChange={this.handleAddInput} value={addInputValue}/>
          </FormItem>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
