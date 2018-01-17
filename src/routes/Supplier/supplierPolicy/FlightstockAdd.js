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
  flightstockAdd: state.flightstockAdd,
}))
class page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: {},
    };
  }
  // componentWillReceiveProps(nextProps){
  //   console.log('nextPropsde ((&(*&(*');
  //   console.log(nextProps);
  // }
  componentDidMount() {

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
  away(){
    this.props.history.push({
      pathname: '/supplier/supplierPolicy/flightstock',
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
