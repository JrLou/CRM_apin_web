// import fetch from 'dva/fetch';
// import { notification } from 'antd';

// const codeMessage = {
//   200: '服务器成功返回请求的数据',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器',
//   502: '网关错误',
//   503: '服务不可用，服务器暂时过载或维护',
//   504: '网关超时',
// };
// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   const errortext = codeMessage[response.status] || response.statusText;
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: errortext,
//   });
//   const error = new Error(errortext);
//   error.response = response;
//   throw error;
// }

// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request(url, options) {
//   const defaultOptions = {
//     credentials: 'include',
//   };
//   const newOptions = { ...defaultOptions, ...options };
//   if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
//     newOptions.headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json; charset=utf-8',
//       ...newOptions.headers,
//     };
//     newOptions.body = JSON.stringify(newOptions.body);
//   }

//   return fetch(url, newOptions)
//     .then(checkStatus)
//     .then((response) => {
//       if (newOptions.method === 'DELETE' || response.status === 204) {
//         return response.text();
//       }
//       return response.json();
//     });
// }
import fetch from 'dva/fetch';
import { notification,message} from 'antd';
import CookieHelp from './cookies'
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkaccessToken(json,url,options){
    // 在这鉴权token`
    if (json.code == 413) {
        console.log('帐号被禁止')
        message.error('帐号被禁止!');
        return;
    }
    if (json.code == 403) {
        console.log('该功能没有权限')
        message.error('该功能没有权限!');
        return;
    }
    if (json.code == 421) {
        console.log('凭证过期')
        message.error('凭证过期!');
        let old_userInfo = CookieHelp.getUserInfo();
        if(!old_userInfo){
          return null
        }
      //  return  request('/crm/uc/authapi/v1.1/tokens',{
      //     method: 'POST',
      //     body: {
      //       account: old_userInfo.username,
      //       password: old_userInfo.password
      //     },
      //   }).then((json)=>{

      //     if(json.code==200){
      //      return request(url,options)
      //     }else{
      //       return "1001"
      //     }
      //   }
      //   )

    }
    if (json.code == 411) {
        console.log('token失效需要重新登陆')
        // 如果记住密码就重新后台重新登陆下不然就指回登陆/uc/authapi/v1.1/tokens
        let old_userInfo = CookieHelp.getUserInfo();
        return request('/crm/uc/authapi/v1.1/tokens',{
          method: 'POST',
          body: {
            account: old_userInfo.username,
            password: old_userInfo.password
          },
        }).then((json)=>{
          if(json.code==200){
           return request(url,options)
          }
        }
        )
    }
    if (json.code == 422) {
        console.log('token过期需要刷新')
        // 刷新token
    }
    return json
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };

    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization':CookieHelp.getUserInfo().accessToken,
      ...newOptions.headers,

    };
    if(!newOptions.headers.Authorization){
      delete newOptions.headers.Authorization
    }
    newOptions.body = JSON.stringify(newOptions.body);

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response =>response.json())
    .then(json=>checkaccessToken(json,url,options))
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}
// function fetchcustom(url,type,data){
//   return new Promise(function(resolve,reject){
//       var xhr = new XMLHttpRequest();
//       type = type.toUpperCase();
//       xhr.open(type, url, true);
//       xhr.setRequestHeader("Content-type", "application/json");
//       xhr.onreadystatechange=function(){
//           if(xhr.readyState===4){
//               if(xhr.status===200 ||xhr.status<300 || xhr.status ===304){
//                   let obj = xhr.response
//                   if (typeof obj !== 'object') {
//                       obj = JSON.parse(obj);
//                   }
//                   resolve(obj)
//           }else{
//                 reject(xhr.response)
//           }
//           }
//       }
//     xhr.send(data)
//   })
// }
