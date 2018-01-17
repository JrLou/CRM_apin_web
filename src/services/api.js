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
  return request(`/api/demandPool/cheekPoolList`, { method: 'POST', body: params });
}
export async function queryUserList(params) {
  return request(`/api/userList?${stringify(params)}`);
}
//客户列表 华志林
export async function queryCustomerList(params) {
  return request('/api/member/getMemberList', {
    method: 'POST',
    body: params,
  });
}
//拼团列表 暂时未使用，need reWrite
export async function queryFightGroupsList(params) {
  return request('/api/demandPool/getGroupList', {
    method: 'POST',
    body: params,
  });
}

//查看拼团页面
export async function queryOrderInfo(params) {//拼团信息
  return request('/api/demandPool/detailGroup', {
    method: 'POST',
    body: params,
  });
}
export async function planClose(params) {//关闭拼团
  return request('/api/demandPool/planClose', {
    method: 'POST',
    body: params,
  });
}

export async function queryGroupOrders(params) {//订单信息
  return request('/api/demandPool/groupOrders', {
    method: 'POST',
    body: params,
  });
}
export async function queryPaidMember(params) {//拼团下成功支付的乘机人信息
  return request('/api/demandPool/getPaidMember', {
    method: 'POST',
    body: params,
  });
}
export async function loadExportPassenger(params) {//导出乘机人信息（已付款的)
  return request(`/api/demandPool/exportPassenger?${stringify(params)}`);
}
export async function saveTickets(params) {//确认录入票号信息
  return request('/api/demandPool/saveTickets', {
    method: 'POST',
    body: params,
  });
}

export async function queryPublishLogs(params) {//订单推送日志
  return request('/api/demandPool/publishLogs', {
    method: 'POST',
    body: params,
  });
}

export async function queryDetailGroupVoyage(params) {// 方案明细
  return request('/api/demandPool/detailGroupVoyage', {
    method: 'POST',
    body: params,
  });
}

export async function queryGroupLogs(params) {// 日志信息
  return request('/api/demandPool/getGroupLogs', {
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
//运营管理
export async function addBannerImg(params) {
  return request('/api/banner/addBanner', {
    method: 'POST',
    body: params,
  });
}
export async function editBannerImg(params) {
  return request('/api/banner/editBanner', {
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
    formData: true
  });
}
export async function deleteBanner(params) {
  return request('/api/banner/delBanner', {
    method: 'POST',
    body: params,
  });
}
export async function changeStatus(params) {
  return request('/api/banner/useBanner', {
    method: 'POST',
    body: params,
  });
}
export async function querySupplierList(params) {
  return request(`/api/suplierList?${stringify(params)}`);
}
export async function queryFlyList(params) {
  return request('/api/resource/getAirLinesFlyPigs', {
    method: 'POST',
    body: params,
  });
}
//李斯奇 政策管理供应商资源
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
  return request('/api/resource/getAirLineLogs', {
    method: 'POST',
    body: params,
  });
}
//非常准航线查询
export async function getaddAirLine(params) {
  return request('/api/resource/searchAirLine', {
    method: 'POST',
    body: params,
  });
}
//编辑回显
export async function getdetailAirLine(params) {
  return request('/api/resource/detailAirLine', {
    method: 'POST',
    body: params,
  });
}
//日历数据
export async function getpriceAirline(params) {
  return request('/api/resource/priceAirline', {
    method: 'POST',
    body: params,
  });
}
//新增政策
export async function getadd(params) {
  return request('/api/resource/addAirLine', {
    method: 'POST',
    body: params,
  });
}
//批量修改团期价格
export async function getmodifyPrice(params) {
  return request('/api/resource/modifyPrice',{
    method: 'POST',
    body: params,
  });
}
//批量修改团期库存
export async function getmodifyInventory(params) {
  return request('/api/resource/modifyInventory',{
    method: 'POST',
    body: params,
  });
}
//批量修改清位时间
  export async function getmodifyDays(params) {
  return request('/api/resource/modifyDays',{
    method: 'POST',
    body: params,
  });
}
//批量修改价格
  export async function getimportFile(params) {
  return request('/api/resource/importFile',{
    method: 'POST',
    body: params,
  });
}
//批量修改价格
  export async function geteditAirline(params) {
  return request('/api/resource/editAirline',{
    method: 'POST',
    body: params,
  });
}
//添加日志
  export async function getLogAirLine(params) {
  return request('/api/resource/LogAirLine',{
    method: 'POST',
    body: params,
  });
}
//冷门资源列表
  export async function geth5(params) {
  return request('/api/resource/getAirLinesRare',{
    method: 'POST',
    body: params,
  });
}
//冷门资源列表
  export async function geth5Add(params) {
  return request('/api/resource/addAirLinesRare',{
    method: 'POST',
    body: params,
  });
}

export async function AccountLogin(params) {
  const newparams = Object.assign({}, { account: params.account, type: 0 })
  const response = await request('/api/user/getLogicCode', {
    method: "POST",
    body: newparams,
  });
  if (response && response.data && response.code >= 1) {
    const newparams2 = Object.assign({}, { account: params.account, signature: md5(md5(params.account + md5(params.password)) + response.data) })
    return request('/api/user/loginByAccount', {
      method: 'POST',
      body: newparams2,
    });
  }
}
export async function queryMenus() {
  return request('/api/user/getNavigators', {
    method: 'POST',
    body: {}
  });
}
export async function authrouteApi(params) {
  return request('/api/user/getFunNavigators', {
    method: 'POST',
    body: params
  });
}
export async function financePaymentList(params) {
  return request('/bo/orderapi/v1.0/orders/recordList', {
    method: 'POST',
    body: params,
  });
}

export async function roleManageList(params) {
  return request(`/cr/v2/accounts/role/list?${stringify(params)}`);
}
//刘园园 订单管理
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
export async function updateSettleAmount(params) {
  return request('/api/order/updateSettleAmount', {
    method: 'POST',
    body: params,
  });
}
export async function addTicketFail(params) {
  return request('/api/order/addTicketFail', {
    method: 'POST',
    body: params,
  });
}
export async function getRefundList(params) {
  return request('/api/order/getRefundList', {
    method: 'POST',
    body: params,
  });
}
export async function offlineRefund(params) {
  return request('/api/order/offlineRefund', {
    method: 'POST',
    body: params,
  });
}
export async function retryRefund(params) {
  return request(' /api/order/retryRefund', {
    method: 'POST',
    body: params,
  });
}
export async function postGroupData(params) {
  return request('/api/demandPool/pushPlan', { method: 'POST', body: params });
}
export async function searchFlights(params) {
  return request('/api/resource/searchAirLine', { method: 'POST', body: params });
}
export async function addFlights(params) {
  return request('/api/group/addFlights', { method: 'POST', body: params });
}
export async function viewList(params) {
  return request('/api/demandPool/getPoolHistory', { method: 'POST', body: params });
}
export async function orderList(params) {
  // return request('http://localhost:3333/api/demandPool/getPoolOrderList', { method: 'POST', body: params });
  return request('/api/demandPool/getPoolOrderList', { method: 'POST', body: params });
}
export async function logList(params) {
  return request('/api/demandPool/publishLogs', { method: 'POST', body: params });
}
export async function continueAdd(params) {
  return request('/api/demandPool/pushPlanMore', { method: 'POST', body: params });
}
// 线下订单
export async function offlineList(params) {
  return request('/java/offline/order/list', { method: 'POST', body: params });
}
export async function delOrder(params) {
  return request('/java/offline/order/delete', { method: 'POST', body: params });
}
// 线下订单
export async function orderDetail(params) {
  return request('/java/offline/order/query', { method: 'POST', body: params });
}

//线下 客户管理
export async function offlineCustomerList(params) {
  return request('/java/offline/customer/list', { method: 'POST', body: params });
}
export async function offlineCustomerAdd(params) {
  return request('/java/offline/customer/create', { method: 'POST', body: params });
}
export async function offlineCustomerQuery(params) {
  return request('/java/offline/customer/query', { method: 'POST', body: params });
}
export async function offlineCustomerEdit(params) {
  return request('/java/offline/customer/update', { method: 'POST', body: params });
}
export async function offlineCustomerDelete(params) {
  return request('/java/offline/customer/delete', { method: 'POST', body: params });
}
//线下 供应商管理
export async function offlineSupporterList(params) {
  return request('/java/offline/supplier/v1.0/list', { method: 'POST', body: params });
}
export async function offlineSupporterAdd(params) {
  return request('/java/offline/supplier/v1.0/create', { method: 'POST', body: params });
}
export async function offlineSupporterQuery(params) {
  return request('/java/offline/supplier/v1.0/query', { method: 'POST', body: params });
}
export async function offlineSupporterEdit(params) {
  return request('/java/offline/supplier/v1.0/update', { method: 'POST', body: params });
}
export async function offlineSupporterDelete(params) {
  return request('/java/offline/supplier/v1.0/delete', { method: 'POST', body: params });
}
