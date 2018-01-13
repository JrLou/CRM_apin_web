import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  DatePicker,
  message
} from 'antd';
import StandardTable from './TableList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Banner.less';

const FormItem = Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  bannerList: state.bannerList,
}))
@Form.create()
export default class BannerList extends PureComponent {
  state = {
    selectedRows: [],
    page: {
      p: 1,
      pc: 10
    }
  };
  p=1
  pc =10
  componentDidMount() {
    this.props.dispatch({
      type: 'bannerList/fetch',
      payload: {
        p:1,
        pc:10
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.pc =pagination.pageSize
    const params = {
      p: pagination.current,
      pc: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'bannerList/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'bannerList/fetch',
      payload: {},
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

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
        type: 'bannerList/fetch',
        payload: values,
      });
    });
  };

  handleAdd = ()=>{
    this.props.dispatch({
      type: 'bannerList/toAdd',
      payload:{}
    });
  };

  render() {
    const { bannerList: { loading: ruleLoading, data } } = this.props;
    console.log(data)
    Object.assign(data, {
        pagination:{
          current:this.p,
          pageSize:this.pc
        }
      })
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tools}>
            <Button
              className={styles.addBtn}
              size={'large'}
              type={'primary'}
              onClick={()=>{
                this.handleAdd();
              }}
            >
              新增banner
            </Button>
          </div>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
