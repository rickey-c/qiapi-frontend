// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** listTopInvokeInterfaceInfo GET /api/analysis/top/interface/invoke */
export async function listTopInvokeInterfaceInfoUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInterfaceInfoVO>('/api/analysis/top/interface/invoke', {
    method: 'GET',
    ...(options || {}),
  });
}

/** testUpdateCache GET /api/analysis/updateCache */
export async function testUpdateCacheUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>('/api/analysis/updateCache', {
    method: 'GET',
    ...(options || {}),
  });
}
