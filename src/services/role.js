import request from '../utils/request';
import { stringify } from 'qs';

export async function getV2RoleFunctionList() {
  return request(`/cr/v2/accounts/role/functionList`);
}

export async function getV2RoleOwnFunctionList(params) {
  return request(`/cr/v2/accounts/role/ownFunctionList?${stringify(params)}`);
}

export async function modifyRole(params) {
  return request('/cr/v2/accounts/role/modifyRole', {
    method: 'PUT',
    body: params,
  });
}

export async function addRole(params) {
  return request('/cr/v2/accounts/role/addRole', {
    method: 'POST',
    body: params,
  });
}

