import adminPath from './path'
import {get, post} from '@/utils/request'

/**
 * 获取配置信息
 * */
export async function getSettings() {
  try {
    return await get<API.response<adminAPI.settingsRes>>(adminPath.getSettings)
  } catch (e) {
    console.log(e)
  }
}

/**
 * 修改配置信息
 * */
export async function setSettings(values: adminAPI.settingsParams) {
  try {
    return await post<API.response<null>>(adminPath.setSettings, values)
  } catch (e) {
    console.log(e)
  }
}

