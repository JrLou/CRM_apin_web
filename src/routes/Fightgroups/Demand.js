import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './Demand.less';

@connect(state => ({
  list: state.list,
}))
export default class Demand extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const { list: { list, loading } } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}></div>
    );

    // const extraContent = (
    //   <div className={styles.extraImg}>
    //     <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" />
    //   </div>
    // );

    return (
      <PageHeaderLayout
        title="卡片列表"
        content={content}
        // extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 4, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card} actions={[<a>查看历史拼团</a>, <a>方案推送</a>]}
                  title='杭州 - 曼谷'
                  extra={30}>
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                    description={(
                      // <Ellipsis className={styles.item} lines={4}>{item.description} </Ellipsis>
                      <div>
                        <p>待推方案订单数：12</p>
                        <p>待推方案订单数：12</p>
                        <p>待推方案订单数：12</p>
                        <p>待推方案订单数：12</p>
                      </div>
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
