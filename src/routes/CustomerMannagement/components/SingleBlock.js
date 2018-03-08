import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Card } from 'antd';

const { TabPane } = Tabs;

const SingleBlock = ({ children, tab }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Card bordered={false}>
        <Tabs type="card">
          {/* 其实TabPane不是这样用的， 这里纯粹是用来布局的，所以key就随意设置一个值即可 */}
          <TabPane tab={tab} key="0">
            {children}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

SingleBlock.defaultProps = {};

SingleBlock.propTypes = {
  tab: PropTypes.string.isRequired,
};

export default SingleBlock;
