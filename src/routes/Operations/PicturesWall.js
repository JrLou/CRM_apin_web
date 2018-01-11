import { Upload, Icon, message } from 'antd';
import { connect } from 'dva';


@connect(state => ({
  bannerList: state.bannerList
}))
class PicturesWall extends React.Component {
  state = {
    loading: false,
  };


  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
    if (!isJPG) {
      message.error('格式只支持jpg、jpeg和png!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('不超过1M!');
    }
    return isJPG && isLt2M;
  }


  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      },()=>{
        let image = this.state.imageUrl;
        const { dispatch } = this.props;
        dispatch({
          type: 'bannerList/baseImg',
          payload: {image},
          callback:(response)=>{
            if(response.code==1){
              console.log(11111,response.data)
            }else{
              console.log('error')
            }
          }
        });
      }));
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">选择文件</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="//jsonplaceholder.typicode.com/posts/"
        beforeUpload={this.beforeUpload.bind(this)}
        onChange={this.handleChange.bind(this)}
      >
        {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
      </Upload>
    );
  }
}
export default PicturesWall;
