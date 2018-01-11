import React, {PureComponent} from 'react';
import Banner from './BannerEdit'

export default  class BannerEdit extends PureComponent {
    render(){
      return <Banner {...this.props}/>
    }

}
