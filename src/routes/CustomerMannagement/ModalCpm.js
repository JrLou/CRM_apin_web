import React, {PureComponent} from 'react';
import {Modal} from 'antd';

class AddModal extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        {...this.props}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default {AddModal,};
