// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** callback POST /api/thirdParty/alipay/callback */
export async function callbackUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>('/api/thirdParty/alipay/callback', {
    method: 'POST',
    ...(options || {}),
  });
}

/** alipay POST /api/thirdParty/alipay/pay */
export async function alipayUsingPost(body: API.OrderPayRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponsestring>('/api/thirdParty/alipay/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
