import React from 'react';
import {Card } from 'antd';
import Result from '../components/Result';
export default () => (
    <Card bordered={false}>
      <Result
        type="success"
        title="首页"
        description="登陆成功"
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
);
