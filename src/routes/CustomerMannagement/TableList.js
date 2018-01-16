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
    if (target) {
      target.editable = true;
      //实时更新state
      this.setReduxState({data: newData});
    }
  }

  setReduxState = (payload) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'customerMannagement/setStatereducer',
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
        width:'140px',
        render: (text, record) => {
          const {editable} = record;
          return (//todo 我的同时按下两个修改，会有bug
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                  <a onClick={() => this.save(record.key)}>保存</a>&nbsp;&nbsp;
                    <Popconfirm title="取消保存?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                  : <a onClick={() => this.edit(record.id)}>修改</a>
              }
              <Popconfirm
                title="确定删除?"
                onConfirm={() => {
                }}
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
