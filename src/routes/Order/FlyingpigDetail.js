import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card } from 'antd';


export default class TableList extends PureComponent {
  render() {
    return <PageHeaderLayout>
      <Card bordered={false}>
        详情
      </Card>
    </PageHeaderLayout>
  }
}
