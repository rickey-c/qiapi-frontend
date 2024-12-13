// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** errorHtml GET /api/thirdParty/error */
export async function errorHtmlUsingGet(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/thirdParty/error', {
    method: 'GET',
    ...(options || {}),
  });
}

/** errorHtml PUT /api/thirdParty/error */
export async function errorHtmlUsingPut(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/thirdParty/error', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** errorHtml POST /api/thirdParty/error */
export async function errorHtmlUsingPost(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/thirdParty/error', {
    method: 'POST',
    ...(options || {}),
  });
}

/** errorHtml DELETE /api/thirdParty/error */
export async function errorHtmlUsingDelete(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/thirdParty/error', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** errorHtml PATCH /api/thirdParty/error */
export async function errorHtmlUsingPatch(options?: { [key: string]: any }) {
  return request<API.ModelAndView>('/api/thirdParty/error', {
    method: 'PATCH',
    ...(options || {}),
  });
}
