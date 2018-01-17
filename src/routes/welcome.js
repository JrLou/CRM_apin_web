import React from 'react';
import {Card } from 'antd';
import Result from '../components/Result';
import welcome from '../assets/welcome.png';
export default () => (
    <Card bordered={false}>
      {/* <Result
        // type="success"
        title="欢迎进入爱拼运营管理系统"
        // description="登陆成功"
        style={{ marginTop:78, marginBottom: 16 }}
      /> */}
      <div style={{width:'100%',margin:'7% auto',textAlign:'center'}}><div style={{marginBottom:'5%',fontSize:'24px'}}>欢迎进入爱拼运营管理系统</div><img src={welcome} alt="welcome" /></div>
    </Card>
);
