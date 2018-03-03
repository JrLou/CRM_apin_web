import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';

//TODO: 暂时还没有用到18.3.3

@connect(state => ({
  customerMannagement: state.customerMannagement,
}))
class DeleteModal extends PureComponent {
  handleCancel(showModal) {
    const { dispatch } = this.props;
    dispatch({
      type: 'customerMannagement/extendAll',
      payload: { showModal },
    });
  }

  render() {
    const {
      dispatch,
      formValues: searchFormValues,
      customerMannagement: {
        showModal,
        modalConfirmLoading,
        deleteItemId,
        data: { data: dataList },
      },
      page,
    } = this.props;
    return (
      <Modal
        title={null}
        visible={showModal}
        // onCancel={() => this.handleCancel(false)}
        maskClosable={false}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', lineHeight: '3.5em' }}>
          <h3>是否确认删除</h3>
          <Button
            style={{ marginRight: 8 }}
            type="primary"
            loading={modalConfirmLoading}
            onClick={() => {
              dispatch({
                type: 'customerMannagement/fetchDelete',
                payload: { id: deleteItemId },
                succCB: () => {
                  //添加条件，当不为第1页 && 仅为1条数据的的时候
                  if (page.pageNum > 1 && dataList.length === 1) {
                    page.pageNum -= 1;
                  }
                  dispatch({
                    type: 'customerMannagement/fetch',
                    payload: {
                      ...page,
                      ...searchFormValues,
                    },
                  });
                },
              });
            }}
          >
            确认
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => this.handleCancel(false)}
          >
            取消
          </Button>
        </div>
      </Modal>
    );
  }
}

export default DeleteModal;
