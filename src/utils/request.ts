import { request } from '@umijs/max';

export async function get<API>(url: string, params?: any, options?:{ [key: string]: any }) {
  return request<API>(url, {
    method: 'GET',
    params:{
      ...params
    },
    ...(options || {}),
  });
}
export async function post<API>(url: string, data?: any, options?:{ [key: string]: any }) {
  console.log('path',url)
  return request<API>(url, {
    method: 'POST',
    data:{
      ...data
    },
    ...(options || {}),
  });
}

