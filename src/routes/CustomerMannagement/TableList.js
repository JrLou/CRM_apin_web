import React, {PureComponent} from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
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


// succCB: (data) => this.cacheData = data.map(item => ({...item})),//只能在数据请求完成时缓存

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class StandardTable extends PureComponent {
  static propTypes = {
    cacheData: PropTypes.array,
    setCacheData: PropTypes.func
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  handleChange = (value, id, column) => {
    const {customerMannagement: {data: {data},}} = this.props;
    const newData = [...data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target[column] = value;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
    }
  }

  edit = (id) => {
    const {customerMannagement: {data: {data},}, dispatch} = this.props;


    const newData = [...data];
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      target.editable = true;
      //实时更新state
      this.setReduxState({data: newData});
    }
  };

  setReduxState = (payload) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/setStatereducer',
      payload,
    });
  };

  save = (id) => {
    const {customerMannagement: {data: {data},}, setCacheData} = this.props;
    const newData = [...data];//data : [{},{},{}]
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      delete target.editable;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
      setCacheData && setCacheData(newData.map(item => ({...item})));
    }
  };

  cancel = (id) => {
    const {cacheData} = this.props;
    console.log("cacheData", cacheData);
    console.log("this.props", this.props);
    const {customerMannagement: {data: {data},}} = this.props;
    const newData = [...data];
    console.log("newData", newData);
    const target = newData.filter(item => id === item.id)[0];
    if (target) {
      Object.assign(target, cacheData.filter(item => id === item.id)[0]);
      delete target.editable;
      this.setReduxState({data: newData});
      // this.setState({data: newData});
    }
  };

  handleDelete = (id) => {
    const {customerMannagement: {data: {data},}} = this.props;
    let newData = [...data];
    newData = newData.filter(item => id !== item.id);
    this.setReduxState({data: newData});
  };

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
        render: (text, record, index) => this.renderColumns(text, record, 'avatar'),
      },
      {
        title: '绑定手机号',
        dataIndex: 'mobile',
        render: (text, record, index) => this.renderColumns(text, record, 'mobile'),
      },
      {
        title: '注册时间',
        dataIndex: 'created_time',
        render: (text, record, index) => this.renderColumns(text, record, 'created_time'),
      },
      {
        title: '最近打开时间',
        dataIndex: 'last_open_time',
        render: (text, record, index) => this.renderColumns(text, record, 'last_open_time'),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: '140px',
        render: (text, record) => {
          const {editable, isEditing} = record;
          const editContent = isEditing ? <a onClick={() => this.edit(record.id)}>修改</a> : <span>修改</span>;
          return (//todo 我的同时按下两个修改，会有bug，然后第一个保存，后面的取消，然而后面也会被修改
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.id)}>保存</a>&nbsp;&nbsp;
                    <Popconfirm title="取消保存?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  : <a onClick={() => this.edit(record.id)}>修改</a>
              }
              <Popconfirm
                title="确定删除?"
                onConfirm={() => this.handleDelete(record.id)}
              >
                <a
                  style={{
                    position: "absolute",
                    right: "20px"
                  }}
                >
                  删除
                </a>
              </Popconfirm>
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
