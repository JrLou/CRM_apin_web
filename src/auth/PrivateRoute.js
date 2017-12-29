import React from 'react'
import request from '../utils/request';
import { Spin } from 'antd';
import { Route} from 'dva/router';
import CookieHelp from '../utils/cookies';
const fakeAuth = ()=>{
  return CookieHelp.getUserInfo();
}
  class PrivateRoute extends React.Component{
    constructor() {
      super();
      this.state = {
        load: ""
      }
  }
    componentDidMount(){
      this.props.dispatch({
        type: 'global/fetchMenus',
      });
    }
    render(){
      let load = this.state.load
      return <Route path={rest.path} render={
        (props) => {
          if(fakeAuth()){
            // Loadmenu().then((json)=>{
            //     console.log(json)
            // })
            return <Component {...props} {...rest} />
          }else{
            return <Redirect to={{
                      pathname: '/user/login',
                      state: { from: rest.location }
                    }} />
          }
        }
      } />
    }
  }


