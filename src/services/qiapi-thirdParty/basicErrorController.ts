// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** error GET /api/thirdParty/error */
export async function errorUsingGet(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/thirdParty/error', {
    method: 'GET',
    ...(options || {}),
  });
}

/** error PUT /api/thirdParty/error */
export async function errorUsingPut(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/thirdParty/error', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** error POST /api/thirdParty/error */
export async function errorUsingPost(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/thirdParty/error', {
    method: 'POST',
    ...(options || {}),
  });
}

/** error DELETE /api/thirdParty/error */
export async function errorUsingDelete(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/thirdParty/error', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** error PATCH /api/thirdParty/error */
export async function errorUsingPatch(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/thirdParty/error', {
    method: 'PATCH',
    ...(options || {}),
  });
}
