

import fetch from 'dva/fetch';
import { notification } from 'antd';
import Cookies from './cookies.js';
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
  // 200 请求成功
  // 400  请求失败
  // 403  未授权
  // 410  此账户在线人数超出上线
  // 411  非法的账户名
  // 412  用户已存在
  // 413  账户被禁止     ****************
  // 414  用户不存在
  // 420  密码错误
  // 421  无效凭证        ****************
  // 422  凭证过期，需刷新 ****************
  // 423  验证码错误
  // 430  无效参数
  // 431  手机格式不正确
  // 432  邮箱格式不正确
  // 490  您请求过于频繁，请稍后重试！
  // 500  服务器繁忙
  //
  // };
  if (json.code && json.code != 200) {
    // const errortext = codeMessage[json.code * -1];
    notification.error({
      message: `提示`,
      description: json.msg || json.message || "",
    });
    if (json.code == 422 || json.code == 411 || json.code == 413 || json.code == -2 || json.code == -8 || json.code == -4 || json.code== -11|| json.code== -12) {
      Cookies.clearCookie()
      setTimeout(() => {
        location.reload()
      }, 1000)
    }
  }
  return json
}
const _fetch = (requestPromise, timeout = 5000) => {
  let timeoutAction = null;
  const fun = () => {
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
  setTimeout(() => {
    timeoutAction()
  }, timeout)
  return Promise.race([requestPromise, timerPromise]);
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
    let Authorization = decodeURIComponent(Cookies.getCookieInfo('token'));
    if (Authorization.indexOf('{') > -1) {
      Authorization = JSON.parse(Authorization).accessToken;
    }
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': options.formData ? 'application/x-www-form-urlencoded; charset=utf-8' : 'application/json; charset=utf-8',
      'Authorization': Authorization,
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
      if (response.headers.get('Content-Type') == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // const b = response.blob()
        // const a = window.URL.createObjectURL(response.blob());
        return response.blob();
      }
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    }).then(checkCode).catch((fun) => {
      if (typeof fun === 'function') {
        fun()
      }
    }
    )
}


