// import React from 'react'
// import { Spin } from 'antd';
// import { connect } from 'dva';
// import NotAuth from '../routes/Exception/403';
// import { Route } from 'dva/router'
// export default ({ component: Component, ...rest }) => {
//   class AuthRoute extends React.PureComponent {
//     // constructor(props) {
//     //   super(props);
//     //   // this.state = {
//     //   //   load:this.props.menusload
//     //   // }
//     // }
//     // componentWillMount() {
//     //   this.props.dispatch({
//     //     type: 'global/authroute',
//     //   });
//     // }
//     render() {
//       console.log(rest)
//       console.log(232323)
//       // const Auth = this.props.menus.some(item => item && item.path && item.path == rest.path)
//       return <Route path={rest.path}  key={rest.key} exact={rest.exact} render={props => {
//         return (!null ? (
//           <Component {...props} />
//         ) : <NotAuth />
//         )} }/>
//     }
//   }
//   // const A = connect(state => ({
//   // }))(AuthRoute)

//   return <AuthRoute />
// }
import React from 'react'
import { Spin } from 'antd';
import { connect } from 'dva';
import NotAuth from '../routes/Exception/403';
import { Route } from 'dva/router'
export default (WrappedComponent, exacpath) => {
  class AuthRoute extends React.PureComponent {
    constructor(props) {
      super(props);
      if (this.props.routerPath.some(item => item.url == exacpath||item.url == (exacpath.replace(/^\//, '')))) {
        this.state = {load: true};
      } else {
        this.state = {load: false};
      }
    }
    componentWillMount() {
      if(!this.state.load){
        this.props.dispatch({
          type: 'global/authroute',
          payload:exacpath,
        });
      }
    }
    componentWillReceiveProps(nextProps) {
      console.log('322323')
      if (nextProps.routerPath.some(item =>item.url == exacpath||item.url == (exacpath.replace(/^\//, '')))) {
        this.setState({load: true});
      }
    }
    render() {
      console.log('322323')
      return (this.state.load ? <WrappedComponent {...this.props} /> : <NotAuth />)
    }
  }
  const A = connect(state => ({
    routerPath: state.global.routerPath,
  }))(AuthRoute)
  return A
}
