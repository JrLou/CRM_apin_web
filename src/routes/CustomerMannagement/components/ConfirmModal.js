import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Modal, Button } from 'antd';

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class ConfirmModal extends PureComponent {
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: { showModal: false },
    });
  };

  render() {
    const {
      customerMannagement: { showModal, modalConfirmLoading },
      title,
      handleOK,
    } = this.props;

    return (
      <Modal
        title={null}
        visible={showModal}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', lineHeight: '3.5em' }}>
          <h3>{title}</h3>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            loading={modalConfirmLoading}
            onClick={handleOK}
          >
            确认
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

ConfirmModal.defaultProps = {
  title: '请确认',
};

ConfirmModal.propTypes = {
  title: PropTypes.string,
  handleOK: PropTypes.func.isRequired,
};

export default ConfirmModal;
