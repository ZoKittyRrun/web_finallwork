import { request } from '@umijs/max';
import {Php as isPhp} from '../global';
export async function get<API>(url: string, params?: any, options?:{ [key: string]: any }) {
  url+=isPhp?'.php':'';
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
  url+=isPhp?'.php':'';
  return request<API>(url, {
    method: 'POST',
    data:{
      ...data
    },
    ...(options || {}),
  });
}

