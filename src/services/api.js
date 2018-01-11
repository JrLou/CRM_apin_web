import { stringify } from 'qs';
import request from '../utils/request';
import md5 from 'md5'

/*一级菜单url*/





/*二级菜单url*/

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
  return request(`/api/demandPool/cheekPoolList`, { method: 'POST', body: params });
}
export async function queryUserList(params) {
  return request(`/api/userList?${stringify(params)}`);
}
//客户列表 华志林
export async function queryCustomerList(params) {// /api/member/getMemberList
  return request('/api/member/getMemberList', {
    method: 'POST',
    body: params,
  });
}
//拼团列表 暂时未使用，need reWrite
export async function queryFightGroupsList(params) {// /api/member/getMemberList
  return request('/api/demandPool/getGroupList', {
    method: 'POST',
    body: params,
  });
}

export async function entrust(params) {
  return request('/api/order/getOrderList', {
    method: 'POST',
    body: params,
  });
}
export async function addBannerImg(params) {
  return request('/crm/api/banner/addBanner', {
    method: 'POST',
    body: params,
  });
}
export async function queryBanner(params) {
  return request('/api/banner/getBannerList', {
    method: 'POST',
    body: params,
  });
}

//base64 banner图上传
export async function baseImg(params) {
  return request('/api/common/uploadImage', {
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
  return request('/api/order/getOrderList', {
    method: 'POST',
    body: params,
  });
}
//李斯奇 政策管理供应商资源
//供应商列表资源列表
export async function flightstockList(params) {
  return request('/api/resource/getAirLines', {
    method: 'POST',
    body: params,
  });
}
//上架 ()
export async function stateAirLine(params) {
  return request('/api/resource/stateAirLine', {
    method: 'POST',
    body: params,
  });
}
//日志
export async function getAirLineLogs(params) {
  return request('/api/resource/getAirLineLogs',{
    method: 'POST',
    body: params,
  });
}
//非常准航线查询
export async function getaddAirLine(params) {
  return request('/api/resource/searchAirLine',{
    method: 'POST',
    body: params,
  });
}
//编辑回显
export async function getdetailAirLine(params) {
  return request('/api/resource/detailAirLine',{
    method: 'POST',
    body: params,
  });
}

export async function AccountLogin(params) {
  const newparams = Object.assign({}, { account: params.account, type:0 })
  const response = await request('/api/user/getLogicCode',{
    method:"POST",
    body:newparams,
  });
  if (response && response.data && response.code>=1) {
    const newparams2 = Object.assign({}, { account: params.account, signature: md5(md5(params.account + md5(params.password)) + response.data) })
    return request('/api/user/loginByAccount',{
      method:'POST',
      body:newparams2,
    });
  }
}
export async function queryMenus() {
  return request('/uc/authapi/v1.1/modules');
}
export async function financePaymentList(params) {
  return request('/bo/orderapi/v1.0/orders/recordList', {
    method: 'POST',
    body: params,
  });
}
//刘园园权限管理
export async function roleManageList(params) {
  return request(`/cr/v2/accounts/role/list?${stringify(params)}`);
}
export async function getFlylist(params) {
  return request('/api/order/getOrderList', {
    method: 'POST',
    body: params,
  });
}
export async function getFlyDetail(params) {
  return request('/api/order/getOrderDetail', {
    method: 'POST',
    body: params,
  });
}
export async function flyDetailAddTicket(params) {
  return request('/api/order/addTicket', {
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
  return request('/api/demandPool/getPoolHistory', { method: 'POST', body: params });
}
export async function orderList(params) {
  return request('/api/demandPool/getPoolOrderList', { method: 'POST', body: params });
}
export async function logList(params) {
  return request(`/api/group/logs?${stringify(params)}`);
}
