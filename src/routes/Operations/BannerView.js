import React, {PureComponent} from 'react';
import Banner from './BannerEdit'
import {connect} from 'dva';
export default class BannerEdit extends PureComponent {
    render(){
      return <Banner {...this.props} edit={true} />
    }

}
