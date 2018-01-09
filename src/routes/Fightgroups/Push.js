import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './Demand.less';
import SearchFlight from './components/SearchFlight';
@connect(state => ({
  data: state.push,
}))
export default class PushScheme extends PureComponent {

  render() {
    const { data: { loading } } = this.props;
    const content = (
      <div className={styles.pageHeaderContent}></div>
    );

    return (
      <PageHeaderLayout
        title="方案推送"
        content={content}
      // extraContent={extraContent}
      >
        <Card bordered={false}>
          <Spin spinning={loading}>
            <SearchFlight {...this.props}></SearchFlight>
          </Spin>
        </Card>
      </PageHeaderLayout >
    );
  }
}
