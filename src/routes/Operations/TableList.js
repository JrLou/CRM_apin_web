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
        if(response.code==200){
          message.success(response.message);
        }else{
          message.error(response.message);
        }
      }
    });
  };

  //上架/下架
  changeStatus = (id,status)=>{
    if(!id){
      return;
    }
    let params = {
      id:id,
      status:status?1:0
    };

    this.props.dispatch({
      type: 'bannerList/changeStatus',
      payload: params,
      callback:(response)=>{
        if(response.code==200){
          message.success(response.message);
        }else{
          message.error(response.message);
        }
      }
    });
  };

  //编辑
  handleEdit = (data)=>{
    this.props.dispatch({
      type: 'bannerList/toAdd',
      payload:data,
    });
  };


  render() {
    const { data: { list, pagination }, loading } = this.props;
    const columns = [
      {
        title: '显示顺序',
        dataIndex: 'index',
      },
      {
        title: '图片名称',
        dataIndex: 'imgName',
      },
      {
        title: '图片',
        dataIndex:'imgUrl',
        render:(text, record, index) => {
          // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
          if (!record.img_url) {
              return <ImageWrapper className={styles.picTable} src={text} desc="示意图"/>
          } else {
              return <span>无</span>
          }
        }
      },
      {
        title: '跳转链接',
        dataIndex: 'goLink',
      },
      {
        title: '有效期',
        dataIndex: 'validityStart',
        render:(text,record,index)=>{
          return <span>{TimeHelp.getYMDHM(record.validityStart)+' - '+TimeHelp.getYMDHM(record.validityEnd)}</span>
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        render:(text, record, index)=>{
          return <span>{text==1?'上架':'下架'}</span>
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updataTime',
        render:(text,record,index)=>{
          return <span>{TimeHelp.getYMDHM(text)}</span>
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
          rowKey={record => record.key}
          dataSource={list}
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
            let status = record.status==1?0:1;
            this.changeStatus(record.id,status);
          }}
        >
          {record.status==1?'下架':'上架'}
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
          disabled={record.status==1}
          onClick={()=>{this.handleDelete(record.id);}}
        >
          删除
        </Button>
      </div>
    )
  }
}

export default StandardTable;
