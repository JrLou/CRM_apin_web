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
import Flightstockfrom from './H5from.js';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

@connect(state => ({
  h5Add: state.h5Add,
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
    this.addPost('h5Add/detailsadd', {});
    if (this.props.location.state) {
      this.addPost('h5Add/addtailAirLine', {id: this.props.location.state.data.id});
      this.setState({
        data: this.props.location.state.data,
      });
    } else {
      this.addPost('h5Add/detailsadd', {});
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

  away() {
    this.props.history.push({
      pathname: '/supplier/supplierPolicy/h5',
    });
  }

  render() {
    // const {flightstockAdd: {accurate, numbering}} = this.props;
    return (
      <PageHeaderLayout>
        <div className={css.formWapper}>
          <Spin className={css.Spin} spinning={this.state.loading}>
            <WrappedAddForm
              showLoad={this.showLoad.bind(this)}
              addPost={this.addPost.bind(this)}
              away={this.away.bind(this)}
              id={this.props.location.state ? this.props.location.state.data.id : null}
              information={this.props.location.state ? this.props.location.state.data : {}}
              {...this.props}
            />
          </Spin>
        </div>
      </PageHeaderLayout>
    )
  }
}

const WrappedAddForm = Form.create()(Flightstockfrom);
module.exports = page;
