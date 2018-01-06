import { stringify } from 'qs';
import request from '../utils/request';

export async function getFlylist(params) {
  return request(`/api/flyList?${stringify(params)}`);
}

export async function getExample(params) {
  return request(`/api/get?${stringify(params)}`);
}

export async function postExample(params) {
  return request('/api/post', {
    method: 'POST',
    body: params,
  });
}

