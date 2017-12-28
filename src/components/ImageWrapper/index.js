import React, {PureComponent} from 'react';
import {Modal} from 'antd';

export default class ImageWrapper extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      show:false,
    }
  }

  showImages(){
    this.setState({
      show:!this.state.show,
    })
  }

  render(){
    let {show} = this.state, {className, src} = this.props;
    return <div>
      <img src={src} className={className} onClick={::this.showImages} />
      <Modal visible={show} footer={null} width={800}
      onCancel={() => {
        this.setState({
          show:false,
        })
      }}>
        <div style={{paddingTop:'20',textAlign:'center'}}>
          <img src={this.props.src} style={{maxWidth: '100%'}}/>
        </div>
      </Modal>
    </div>
  }
}
