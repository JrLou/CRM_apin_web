import { stringify } from 'qs';
import request from '../utils/request';

export async function getRefundList(params) {
  return request(`/api/getRefundList?${stringify(params)}`);
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

