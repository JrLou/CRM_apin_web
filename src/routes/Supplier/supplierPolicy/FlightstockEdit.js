/**
 * Created by lixifeng on 16/10/25.
 */
import React, {Component} from 'react';
import {
  Form,
  Spin,
} from 'antd';
import {connect, Link} from 'dva';
import css from './Flightstock.less';
import Flightstockfrom from './Flightstockfrom.js';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@connect(state => ({
  flightstockEdit: state.flightstockEdit,
}))
class page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.addPost('flightstockEdit/addtailAirLine', {id: this.props.location.state.data.id});
      this.setState({
        data: this.props.location.state.data,
      });
    }
  }

  showLoad(loading) {
    this.setState({
      loading: loading,
    });
  }

  addPost(url, data) {
    this.props.dispatch({
      type: url,
      payload: data,
    });
  }

  render() {
    const {flightstockEdit: {accurate, details}} = this.props;
    return (
      <PageHeaderLayout>
        <div className={css.formWapper}>
          <Spin className={css.Spin} spinning={this.state.loading}>
            <WrappedAddForm
              showLoad={this.showLoad.bind(this)}
              addPost={this.addPost.bind(this)}
              id={this.state.data.id}
              information={this.state.data}
              details={details}
            />
          </Spin>
        </div>
      </PageHeaderLayout>
    )
  }
}
const WrappedAddForm = Form.create()(Flightstockfrom);
module.exports = page;
