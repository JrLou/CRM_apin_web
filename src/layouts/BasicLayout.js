import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import AuthRoute from '../auth/AuthRoute'
import CookieHelp from './../utils/cookies';
import {Base64} from 'js-base64'
// import {GetItem} from './../utils/localStorage';
import fetch from 'dva/fetch';
/**
 * 根据菜单取得重定向地址.
 */
const { Content } = Layout;
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

// 假装有请求过来的数据
const currentUser = CookieHelp.getCookieInfo('_u')?Base64.decode(CookieHelp.getCookieInfo('_u')):'设置'
class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  // componentDidMount(){
  //   // const refreshToken =GetItem('refreshToken')
  //   // if({refreshToken}){
  //   //   this.interval = setInterval(()=>this.fetchInterval(refreshToken), 10*60*1000);
  //   // }
  // }
  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }
  // fetchInterval(value){
  //   request('/crm/api/user/refreshToken', {
  //     method: 'POST',
  //     body: {refreshToken:value},
  //   })
  //   // fetch('/crm/api/user/refreshToken',{
  //   //   Accept: 'application/json',
  //   //   'Content-Type': 'application/json; charset=utf-8',
  //   //   method:'POST',
  //   //   body: JSON.stringify({refreshToken:value})
  //   // }).then((response)=>response.json()).then((json)=>{
  //   //     console.log(json)
  //   // }).catch((err)=>{
  //   //   console.log(err)
  //   // })
  // }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '爱拼机';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 爱拼机`;
    }
    return title;
  }
  render() {
    const {
        collapsed, fetchingNotices, notices, routerData, match, location, dispatch,
    } = this.props;
    const redirectData = [];
    const getRedirect = (item) => {
      if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
          redirectData.push({
            from: `/${item.path}`,
            to: `/${item.children[0].path}`,
          });
          item.children.forEach((children) => {
            getRedirect(children);
          });
        }
      }
    };
    getMenuData().forEach(getRedirect); //把一级栏目 重定向首个子栏目·
    const layout = (
      <Layout>
        <SiderMenu
          collapsed={collapsed}
          location={location}
          dispatch={dispatch}
          // menus={this.props.menus}
          menus={this.props.env?getMenuData():this.props.menus}
        />
        <Layout>
          <GlobalHeader
            currentUser={currentUser}
            collapsed={collapsed}
            dispatch={dispatch}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                {
                  getRoutes(match.path, routerData).map(Item => (
                    <Route
                      key={Item.key}
                      path={Item.path}
                      component={this.props.env? Item.component: AuthRoute(Item.component,Item.path)}
                      exact={Item.exact}
                    />
                  ))
                }
                <Redirect exact from="/" to="/welcome" />
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 爱拼机版权所有
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  env:state.global.env,
  menus: state.global.menus,
  collapsed: state.global.collapsed,
}))(BasicLayout);
