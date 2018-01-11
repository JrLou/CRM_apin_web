import { stringify } from 'qs';
import request from '../utils/request';
import md5 from 'md5'
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}
export async function demandList(params) {
  return request(`/api/group/demandList`, { method: 'POST', body: params });
}
export async function queryUserList(params) {
  return request(`/api/userList?${stringify(params)}`);
}
export async function entrust(params) {
  return request(`/api/entrust?${stringify(params)}`);
}
export async function addBannerImg(params) {
  return request('/crm/api/banner/addBanner', {
    method: 'POST',
    body: params,
  });
}
export async function queryBanner(params) {
  return request('/crm/api/banner/getBannerList', {
    method: 'POST',
    body: params,
  });
}

//base64 banner图上传
export async function baseImg(params) {
    return request('/crm/api/common/uploadImage', {
      method: 'POST',
      body: params,
    });
}
export async function deleteBanner(params) {
  return request('/crm/api/banner/delBanner', {
    method: 'POST',
    body: params,
  });
}
export async function changeStatus(params) {
  return request(`/api/changeStatus?${stringify(params)}`);
}
export async function querySupplierList(params) {
  return request(`/api/suplierList?${stringify(params)}`);
}
export async function queryFlyList(params) {
  return request(`/api/flyList?${stringify(params)}`);
}
//李斯奇 政策管理供应商资源
//供应商列表资源列表
export async function flightstockList(params) {
  return request(`/api/flightstock?${stringify(params)}`);
}
//上架
export async function stateAirLine(params) {
  return request(`/api/resource/stateAirLine?${stringify(params)}`);
}
//日志
export async function getAirLineLogs(params) {
  return request(`/api/resource/getAirLineLogs?${stringify(params)}`);
}

export async function AccountLogin(params) {
  const newparams = Object.assign({}, { account: params.account, appid: '2ef8d902c12f454f9acdbb0484f8c05a' })
  const response = await request(`/crm/uc/authapi/v1.1/tokens/codes?${stringify(newparams)}`);
  if (response && response.data) {
    const newparams2 = Object.assign({}, { account: params.account, signature: md5(md5(params.account + md5(params.password)) + response.data) })
    return request(`/crm/uc/authapi/v1.1/tokens?${stringify(newparams2)}`);
  }
}

export async function queryMenus() {
  return request('/crm/uc/authapi/v1.1/modules');
}
export async function financePaymentList(params) {
  return request('/crm/bo/orderapi/v1.0/orders/recordList', {
    method: 'POST',
    body: params,
  });
}
//刘园园权限管理
export async function roleManageList(params) {
  return request(`/crm/cr/v2/accounts/role/list?${stringify(params)}`);
}
export async function getFlylist(params) {
  return request('/crm/api/order/getOrderList', {
    method: 'POST',
    body: params,
  });
}
export async function postGroupData(params) {
  return request('/api/group/postGroupData', { method: 'POST', body: params });
}
export async function searchFlights(params) {
  return request('/api/group/searchFlights', { method: 'POST', body: params });
}
export async function addFlights(params) {
  return request('/api/group/addFlights', { method: 'POST', body: params });
}
export async function viewList(params) {
  return request('/api/group/viewList', { method: 'POST', body: params });
}
export async function orderList(params) {
  return request('/api/group/orderList', { method: 'POST', body: params });
}
