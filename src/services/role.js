import { stringify } from 'qs';
import request from '../utils/request';

export async function getV2RoleFunctionList(params) {
  debugger
  return request(`/crm/cr/v2/accounts/role/functionList`);
}

export async function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

