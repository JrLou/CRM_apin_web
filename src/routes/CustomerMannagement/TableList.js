import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Table, Input, Popconfirm} from 'antd';
import ImageWrapper from '../../components/ImageWrapper';
import TimeHelp from '../../utils/TimeHelp.js';
import logo from '../../assets/logo.png';
import styles from './TableList.less';

const EditableCell = ({editable, value, onChange}) => {
  return (
    <span>
      {
        editable ? <Input value={value} onChange={(e) => {
          onChange(e.target.value)
        }}/> : value
      }
    </span>
  );
};


@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const {customerMannagement: {data: {data},}} = this.props;
    const newData = [...data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
    }
  }

  edit(key) {
    const {customerMannagement: {data: {data},}, dispatch} = this.props;
    //先缓存
    this.cacheData = data.map(item => ({...item}));

    const newData = [...data];
    const target = newData.filter(item => key === item.id)[0];
    debugger;
    if (target) {
      target.editable = true;
      //实时更新state
      this.setReduxState({data: newData});
    }
  }

  setReduxState = (payload)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'customerMannagement/setStatereducer',
      payload,
    });
  };

  save(key) {
    const {customerMannagement: {data: {data},}} = this.props;
    const newData = [...data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
      this.cacheData = newData.map(item => ({...item}));
    }
  }

  cancel(key) {
    const {customerMannagement: {data: {data},}} = this.props;
    const newData = [...data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
    }
  }

  render() {
    const {customerMannagement: {loading, data: {data, option},}} = this.props;
    const columns = [
      {
        title: '微信昵称',
        dataIndex: 'name',
        render: (text, record) => this.renderColumns(text, record, 'name'),
      },
      {
        title: '头像',
        dataIndex: 'avatar',
      },
      {
        title: '绑定手机号',
        dataIndex: 'mobile',
      },
      {
        title: '注册时间',
        dataIndex: 'created_time',
        render: (text, record, index) => {
          return <span>{TimeHelp.getYMDHMS(text)}</span>
        }
      },
      {
        title: '最近打开时间',
        dataIndex: 'last_open_time',
        render: (text, record, index) => {
          return <span>{TimeHelp.getYMDHMS(text)}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          const {editable} = record;
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.key)}>Save</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                  : <a onClick={() => this.edit(record.id)}>修改</a>
              }
            </div>
          );
        }
      },
    ];
    const page = {
      current: option.current,
      pageSize: option.size,
      total: option.total,
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...page,
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
