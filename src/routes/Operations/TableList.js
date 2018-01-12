import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table,Button,message } from 'antd';
import ImageWrapper from '../../components/ImageWrapper';
import TimeHelp from '../../utils/TimeHelp.js';
import styles from './TableList.less';

@connect(state => ({
  bannerList: state.bannerList,
}))

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };
  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  //分页器
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  //删除
  handleDelete = (id)=>{
    if(!id){
      return;
    }
    let params = {
      id:id
    };
    this.props.dispatch({
      type: 'bannerList/delete',
      payload: params,
      callback:(response)=>{
        if(response.code>=1){
          message.success('banner删除成功');
          this.props.dispatch({
            type: 'bannerList/fetch',
            payload: {
              p:1,
              pc:10
            },
          });
        }
      }
    });
  };

  //上架/下架
  changeStatus = (id,state)=>{
    if(!id){
      return;
    }
    let params = {
      id:id,
      state
    };
    let messageStatus=['banner下架成功','banner上架成功']
    this.props.dispatch({
      type: 'bannerList/changeStatus',
      payload: params,
      callback:(response)=>{
        if(response.code>=1){
          message.success(messageStatus[state]);
          this.props.dispatch({
            type: 'bannerList/fetch',
            payload: {
              p:1,
              pc:10
            },
          });
        }
      }
    });
  };

  //编辑
  handleEdit = (data)=>{
    this.props.dispatch({
      type: 'bannerList/toEdit',
      payload:data,
    });
  };


  render() {
    const { data: { data, pagination,options }, loading } = this.props;
    Object.assign(pagination,{total:options && options.total||0});
    const columns = [
      {
        title: '显示顺序',
        dataIndex: 'index',
      },
      {
        title: '图片名称',
        dataIndex: 'title',
      },
      {
        title: '图片',
        dataIndex:'banner_url',
        render:(text, record, index) => {
          if (record.banner_url) {
              return <ImageWrapper className={styles.picTable} src={text} desc="示意图"/>
          } else {
              return <span>无</span>
          }
        }
      },
      {
        title: '跳转链接',
        dataIndex: 'link_url',
      },
      {
        title: '有效期',
        dataIndex: 'start_time',
        render:(text,record,index)=>{
          return <span>{TimeHelp.getYMDHM(record.start_time)+' - '+TimeHelp.getYMDHM(record.end_time)}</span>
        }
      },
      {
        title: '状态',
        dataIndex: 'state',
        render:(text, record, index)=>{
          return <span>{text==1?'上架':'下架'}</span>
        }
      },
      {
        title: '更新时间',
        dataIndex: 'update_time',
        render:(text,record,index)=>{
          return <span>{TimeHelp.getYMDHM(record.update_time)}</span>
        }
      },
      {
        title: '操作',
        dataIndex: 'do',
        render:(text, record, index) => {
            return this.getBtns(text, record, index);
        }
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
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

  getBtns(text, record, index){
    return (
      <div>
        <Button
          type={'primary'}
          className={styles.btn}
          onClick={()=>{
            let status = record.state==1?0:1;
            this.changeStatus(record.id,status);
          }}
        >
          {record.state==1?'下架':'上架'}
        </Button>
        <Button
          type={'primary'}
          className={styles.btn}
          onClick={()=>{
            this.handleEdit(record);
          }}
        >
          编辑
        </Button>
        <Button
          type={'primary'}
          className={styles.btn}
          disabled={record.state===1?true:false}
          onClick={()=>{this.handleDelete(record.id);}}
        >
          删除
        </Button>
      </div>
    )
  }
}

export default StandardTable;
