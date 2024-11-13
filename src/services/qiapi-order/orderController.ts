// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addOrder POST /api/order/add */
export async function addOrderUsingPost(
  body: API.OrderAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponselong>('/api/order/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteOrder POST /api/order/delete */
export async function deleteOrderUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getOrderById GET /api/order/get */
export async function getOrderByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseOrder>('/api/order/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listOrder GET /api/order/list */
export async function listOrderUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListOrder>('/api/order/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listOrderByPage GET /api/order/list/page */
export async function listOrderByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderByPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageOrder>('/api/order/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateOrder POST /api/order/update */
export async function updateOrderUsingPost(
  body: API.OrderUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
