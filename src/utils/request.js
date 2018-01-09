

import fetch from 'dva/fetch';
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}
function checkCode(json) {
  // >=1 操作成功
  // -1 ~ -99 固定错误编码，需要特殊处理
  // {
  //     -1  系统未捕获异常
  //     -2  未登录
  //     -3  没有权限访问
  //     -4  用户被禁用
  //     -5  列表无数据
  //     -6  接口不存在
  //     -7  非法请求
  //     ......
  // }
  // -199 ~ -100  用户输入信息校验错误
  // -299 ~ -200  后端业务提交错误
  const codeMessage = {
    1: '系统未捕获异常',
    2: '未登录',
    3: '没有权限访问',
    4: '用户被禁用',
    6: '接口不存在',
    7: '非法请求',
  };
  if(json.code&&json.code*1<1&&json.code*1>-7){
    const errortext = codeMessage[json.code*-1];
    notification.error({
      message: `错误码${json.code}`,
      description: errortext,
    });
  }else if(json.code>=-100&&json.code<-7){
    notification.error({
      message: `错误码${json.code}`,
      description: json.msg||"",
    });
  }else if(json.code*1<=-100&&json.code*1>=-199){
    notification.error({
      message: "用户输入信息校验错误",
      description: json.msg||"",
    });
  }else if(json.code*1<=-200&&json.code*1>=-299){
    notification.error({
      message: "后端业务提交错误",
      description: json.msg||"",
    });
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
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    }).then(checkCode)
  ;
}





















// // import fetch from 'dva/fetch';
// // import { notification } from 'antd';

// // const codeMessage = {
// //   200: '服务器成功返回请求的数据',
// //   201: '新建或修改数据成功。',
// //   202: '一个请求已经进入后台排队（异步任务）',
// //   204: '删除数据成功。',
// //   400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
// //   401: '用户没有权限（令牌、用户名、密码错误）。',
// //   403: '用户得到授权，但是访问是被禁止的。',
// //   404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
// //   406: '请求的格式不可得。',
// //   410: '请求的资源被永久删除，且不会再得到的。',
// //   422: '当创建一个对象时，发生一个验证错误。',
// //   500: '服务器发生错误，请检查服务器',
// //   502: '网关错误',
// //   503: '服务不可用，服务器暂时过载或维护',
// //   504: '网关超时',
// // };
// // function checkStatus(response) {
// //   if (response.status >= 200 && response.status < 300) {
// //     return response;
// //   }
// //   const errortext = codeMessage[response.status] || response.statusText;
// //   notification.error({
// //     message: `请求错误 ${response.status}: ${response.url}`,
// //     description: errortext,
// //   });
// //   const error = new Error(errortext);
// //   error.response = response;
// //   throw error;
// // }

// // /**
// //  * Requests a URL, returning a promise.
// //  *
// //  * @param  {string} url       The URL we want to request
// //  * @param  {object} [options] The options we want to pass to "fetch"
// //  * @return {object}           An object containing either "data" or "err"
// //  */
// // export default function request(url, options) {
// //   const defaultOptions = {
// //     credentials: 'include',
// //   };
// //   const newOptions = { ...defaultOptions, ...options };
// //   if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
// //     newOptions.headers = {
// //       Accept: 'application/json',
// //       'Content-Type': 'application/json; charset=utf-8',
// //       ...newOptions.headers,
// //     };
// //     newOptions.body = JSON.stringify(newOptions.body);
// //   }

// //   return fetch(url, newOptions)
// //     .then(checkStatus)
// //     .then((response) => {
// //       if (newOptions.method === 'DELETE' || response.status === 204) {
// //         return response.text();
// //       }
// //       return response.json();
// //     });
// // }
// import fetch from 'dva/fetch';
// import { notification, message } from 'antd';
// import CookieHelp from './cookies'
// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//   notification.error({
//     message: `请求错误 ${response.status}: ${response.url}`,
//     description: response.statusText,
//   });
//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

// function checkaccessToken(json, url, options) {
//   // >=1 操作成功
//   // -1 ~ -99 固定错误编码，需要特殊处理
//   // {
//   //     -1  系统未捕获异常
//   //     -2  未登录
//   //     -3  没有权限访问
//   //     -4  用户被禁用
//   //     -5  列表无数据
//   //     -6  接口不存在
//   //     -7  非法请求
//   //     ......
//   // }
//   // -199 ~ -100  用户输入信息校验错误
//   // -299 ~ -200  后端业务提交错误
//   if(json.code){
//     if (json.code >= 1) {
//       return json
//     } else {
//       if (json.code == -1) {
//         console.log('系统未捕获异常')
//         message.error('系统未捕获导常')
//       } else if (json.code == -2) {
//         console.log('未登录')
//         message.error('未登录')
//       } else if (json.code == -3) {
//         console.log('没有权限访问')
//         message.error('没有权限访问')
//       } else if (json.code == -4) {
//         console.log('用户被禁用')
//         message.error('用户被禁用')
//       } else if (json.code == -5) {
//         console.log('列表无数据')
//         message.error('列表无数据')
//       } else if (json.code == -6) {
//         console.log('接口不存在')
//         message.error('接口不存在')
//       } else if (json.code == -7) {
//         console.log('非法请求')
//         message.error('非法请求')
//       }
//     }
//   }
//   return json
//   // if (json.code == 421) {
//   //     console.log('凭证过期')
//   //     message.error('凭证过期!');
//   //     let old_userInfo = CookieHelp.getUserInfo();
//   //     if(!old_userInfo){
//   //       return null
//   //     }
//   //   //  return  request('/crm/uc/authapi/v1.1/tokens',{
//   //   //     method: 'POST',
//   //   //     body: {
//   //   //       account: old_userInfo.username,
//   //   //       password: old_userInfo.password
//   //   //     },
//   //   //   }).then((json)=>{

//   //   //     if(json.code==200){
//   //   //      return request(url,options)
//   //   //     }else{
//   //   //       return "1001"
//   //   //     }
//   //   //   }
//   //   //   )
//   // }

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
//   let a = '';
//   try {
//     a = CookieHelp.getUserInfo().accessToken;
//     newOptions.headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json; charset=utf-8',
//       'Authorization': a,
//       ...newOptions.headers,
//     };
//   } catch (e) {
//     newOptions.headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json; charset=utf-8',
//       ...newOptions.headers,
//     };
//   }
//   newOptions.body = JSON.stringify(newOptions.body);
//   return fetch(url, newOptions)
//     .then(checkStatus)
//     .then(response => response.json())
//     .then(json => checkaccessToken(json, url, options))
//     .catch((error) => {
//       if (error.code) {
//         notification.error({
//           message: error.name,
//           description: error.message,
//         });
//       }
//       if ('stack' in error && 'message' in error) {
//         notification.error({
//           message: `请求错误: ${url}`,
//           description: error.message,
//         });
//       }
//       return error;
//     });
// }



// // function fetchcustom(url,type,data){
// //   return new Promise(function(resolve,reject){
// //       var xhr = new XMLHttpRequest();
// //       type = type.toUpperCase();
// //       xhr.open(type, url, true);
// //       xhr.setRequestHeader("Content-type", "application/json");
// //       xhr.onreadystatechange=function(){
// //           if(xhr.readyState===4){
// //               if(xhr.status===200 ||xhr.status<300 || xhr.status ===304){
// //                   let obj = xhr.response
// //                   if (typeof obj !== 'object') {
// //                       obj = JSON.parse(obj);
// //                   }
// //                   resolve(obj)
// //           }else{
// //                 reject(xhr.response)
// //           }
// //           }
// //       }
// //     xhr.send(data)
// //   })
// // }
