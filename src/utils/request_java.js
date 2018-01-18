

import fetch from 'dva/fetch';
import { notification } from 'antd';
import Cookies from './cookies.js'
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
  // -199 ~ -100  用户输入信息校验错误
  // -299 ~ -200  后端业务提交错误
  // const codeMessage = {
  //   1: '系统未捕获异常',
  //   2: '未登录',
  //   3: '没有权限访问',
  //   4: '用户被禁用',
  //   6: '接口不存在',
  //   7: '非法请求',
  //   8: '凭证过期',
  //   9: '用户不存在',
  //   10: '未授权的功能',
  //   11: '用户失效',
  //   12: '过期凭证',
  //   13: '访问频繁'
  //   14: '登录密码错误'
  // };
  if (json.code && json.code * 1 < 1 && json.code * 1 > -100) {
    // const errortext = codeMessage[json.code * -1];
    notification.error({
      message: `提示`,
      description: json.msg || "",
    });
    if (json.code == -2 || json.code == -8 || json.code == -4 || json.code== -11|| json.code== -12) {
      Cookies.clearCookie()
      setTimeout(()=>{
        location.reload()
      },1000)
    }
  } else if (json.code && json.code * 1 <= -100 && json.code * 1 >= -199) {
    notification.error({
      message: "用户输入信息校验错误",
      description: json.msg || "",
    });
  } else if (json.code && json.code * 1 <= -200 && json.code * 1 >= -299) {
    notification.error({
      message: "后端业务提交错误",
      description: json.msg || "",
    });
  }
  return json
}
const _fetch = (requestPromise, timeout=5000) => {
  let timeoutAction = null;
  const fun = ()=>{
    notification.error({
      message: `提示`,
      description: '请求超时',
    });
  }
  const timerPromise = new Promise((resolve, reject) => {
    timeoutAction = () => {
      reject(fun);
    }
  })
  setTimeout(()=>{
    timeoutAction()
  }, timeout)
  return Promise.race([requestPromise,timerPromise]);
}
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  // let Authorization = '';
  // try {
  //   Authorization = CookieHelp.getUserInfo().accessToken;
  //   newOptions.headers = {
  //     'Authorization': Authorization,
  //     ...newOptions.headers,
  //   };
  // } catch (e) {
  // }
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': options.formData ? 'application/x-www-form-urlencoded; charset=utf-8' : 'application/json; charset=utf-8',
      'Authorization':'eyJpZCI6Ijk4OGIzNWJiOGYxZjRkZmM5YjU5Mzg0NDQ0YTk5ZDNmIiwidXNlcklkIjoiMTU1YTU0NDY5ZWViNDRkMmI3MGFkZDkwYWFjMGIzNGEiLCJ1c2VyTmFtZSI6IuWPmOaAgeeuoeeQhuWRmCIsInNlY3JldCI6ImY0ZGUzZTYzM2MxZDQ5NGFhMGY5NTE1Nzk4NDA0OTM0In0=',
      ...newOptions.headers,
    };
    if (options.formData) {
      let paramsDemo = '';
      let i = 0;
      for (let key in newOptions.body) {
        paramsDemo += i == 0 ? (key + '=' + newOptions.body[key]) : ('&' + key + '=' + newOptions.body[key]);
        ++i;
      }
      newOptions.body = paramsDemo;
    } else {
      newOptions.body = JSON.stringify(newOptions.body);
    }

  }

  return _fetch(fetch(url, newOptions))
    .then(checkStatus)
    .then((response) => {
      if(response.headers.get('Content-Type')=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        // const b = response.blob()
        // const a = window.URL.createObjectURL(response.blob());
        return response.blob();
      }
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    }).then(checkCode).catch((fun)=>{
      if(typeof fun ==='function'){
        fun()
      }
    }
  )
}


