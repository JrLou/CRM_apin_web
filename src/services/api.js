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
export async function queryUserList(params) {
  return request(`/api/userList?${stringify(params)}`);
}

export async function querySupplierList(params) {
  return request(`/api/suplierList?${stringify(params)}`);
}

export async function AccountLogin(params) {
  const newparams = Object.assign({},{account:params.account,appid:'2ef8d902c12f454f9acdbb0484f8c05a'})
  const response = await request(`/crm/uc/authapi/v1.1/tokens/codes?${stringify(newparams)}`);
  if(response&&response.data){
    const newparams2 = Object.assign({},{account:params.account,signature:md5(md5(params.account + md5(params.password)) + response.data)})
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
