import { Upload, Icon, message } from 'antd';
import { connect } from 'dva';


@connect(state => ({
  bannerList: state.bannerList
}))
class PicturesWall extends React.Component {
  state = {
    loading: false
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file, filest) => {
    let image_base64;
    if (file) {
      if (!/\.(jpg|jpeg|png)$/.test(file.type)) {
        message.warning("图片格式仅支持jpg、jpeg和png");
        return false;
      }
      if (file.size >= 1024000) {
        message.warning("图片过大，最大允许1M。");
        return false;
      }
    }
    this.getBase64(file, imageUrl => this.setState({
      imageUrl,
      loading: false,
    }, () => {
      let image = this.state.imageUrl;
      const { dispatch } = this.props;
      dispatch({
        type: 'bannerList/baseImg',
        payload: { image }
      });
    }));

    return false
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // this.getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   imageUrl,
      //   loading: false,
      // }, () => {
      //   let image = this.state.imageUrl;
      //   const { dispatch } = this.props;
      //   dispatch({
      //     type: 'bannerList/baseImg',
      //     payload: { image },
      //     callback: (response) => {
      //       if (response.code == 1) {
      //         console.log(11111, response.data)
      //       } else {
      //         console.log('error')
      //       }
      //     }
      //   });
      // }));
    }
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">选择文件</div>
      </div>
    );
    const { bannerList: { uploadSuccess, banner_url } } = this.props;
    // const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action=""
        beforeUpload={this.beforeUpload.bind(this)}
        onChange={this.handleChange.bind(this)}
      >
        {banner_url && uploadSuccess ? <img style={{ width: '100px', height: '60px' }} src={banner_url} alt="" /> : uploadButton}
      </Upload>
    );
  }
}
export default PicturesWall;
