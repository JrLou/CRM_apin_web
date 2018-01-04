import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Card, Button, Icon, List} from 'antd';
import {Link} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Demand.less';

// @connect(state => ({
//   demand: state.demand,
// }))
export default class Demand extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'demand/fetch',
    //   payload: {
    //     count: 8,
    //   },
    // });
  }

  render() {
    // const { demand: { list, loading } } = this.props;
    let data = [
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
      {id: 1, name: "园园", desc: '这是一段描述'},
    ];
    const title=<span className={styles.cardTitle}><b></b>杭州 - 曼谷w</span>
    return (
      <PageHeaderLayout>
        {/*跳转三级页面*/}
        {/*<Link to={'/fightgroups/demand/id'}>*/}
        {/*<Button>查看需求池</Button>*/}
        {/*</Link>*/}
        {/*<Link to={'/fightgroups/demand/choose'}>*/}
        {/*<Button>推送方案-选择订单</Button>*/}
        {/*</Link>*/}
        {/*<Link to={'/fightgroups/demand/push'}>*/}
        {/*< Button>方案推送</Button>*/}
        {/*</Link>*/}
        {/*<Link to={'/fightgroups/demand/result'}>*/}
        {/*< Button>查看拼团</Button>*/}
        {/*</Link>*/}
        <div className={styles.cardList}>
          <List
            rowKey="id"
            // loading={loading}
            grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
            dataSource={data}
            renderItem={item => (
              <List.Item key={item.id}>
                <Card hoverable className={styles.card}
                      actions={[<Link to={'/fightgroups/demand/id'}>查看历史拼团</Link>, <Link to={'/fightgroups/demand/id'}><Button type="primary">方案推送</Button></Link>]}
                      title={title}
                      extra={30}>
                  <Card.Meta
                    description={(
                      <div>
                        <p>3天内需要处理的订单数：12</p>
                        <p>待推方案订单数：12</p>
                        <p>待推方案总人数：12</p>
                        <p>已成团订单数：12</p>
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
