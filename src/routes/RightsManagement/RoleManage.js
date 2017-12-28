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
    page:{
      p:1,
      pc:10
    }
  };

  componentDidMount() {
   this.getList();
  }
  getList(){
    const values = this.props.form.getFieldsValue();
    for (let item in values) {
      if (values[item] === undefined) {
        values[item] = '';
      }
    }
    this.setState({
      formValues:values,
    });
    let {page}=this.state;
    let params = Object.assign(page, values);
    this.props.dispatch({
      type: 'roleManageList/fetch',
      payload: params,
    });
  }
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
  // handleMenuClick = (e) => {
  //   const {dispatch} = this.props;
  //   const {selectedRows} = this.state;
  //   if (!selectedRows) return;
  //   switch (e.key) {
  //     case 'remove':
  //       dispatch({
  //         type: 'rule/remove',
  //         payload: {
  //           no: selectedRows.map(row => row.no).join(','),
  //         },
  //         callback: () => {
  //           this.setState({
  //             selectedRows: [],
  //           });
  //         },
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // }
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'roleManageList/fetch',
        payload: values,
      });
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

  // handleAdd = () => {
  //   this.props.dispatch({
  //     type: 'rule/add',
  //     payload: {
  //       description: this.state.addInputValue,
  //     },
  //   });
  //
  //   message.success('添加成功');
  //   this.setState({
  //     modalVisible: false,
  //   });
  // }

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
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
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
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
    );
  }

  render() {
    console.log("props_______________",this.props);
    const {roleManageList: {loading: ruleLoading, data}} = this.props;
    const {selectedRows, modalVisible, addInputValue} = this.state;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                创建角色
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
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
