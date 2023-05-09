import userPath from './path'
import {get, post} from '@/utils/request'

/**
 * 用户登录接口
 * @param {userAPI.LoginParams} data 用户登录参数
 * @returns {Promise<userAPI.response<any>>}
 * */
export async function login(data: userAPI.LoginParams) {
  try {
    return await post<userAPI.response<any>>(userPath.login, data);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 用户注册接口
 * @param {userAPI.RegisterParams} data 用户注册参数
 * @returns {Promise<userAPI.response<any>>}
 * */
export async function register(data: userAPI.RegisterParams) {
  try {
    return await post<userAPI.response<any>>(userPath.register, data);
  } catch (e) {
    console.log(e)
  }
}

/**
 * 获取用户信息
 * @returns {Promise<userAPI.response<userAPI.userInfo>>} 返回res数据
 * */
export async function getUserInfo() {
  try {
    return await get<userAPI.response<userAPI.userInfo>>(userPath.getUserInfo)
  } catch (e) {
    console.log(e)
  }
}

/**
 * 登出接口
 * @returns {Promise<userAPI.response<any>>} 返回res数据
 * */
export async function logout() {
  try {
    return await get<userAPI.response<null>>(userPath.logout)
  } catch (e) {
    console.log(e)
  }
}

/**
 *  修改用户信息
 *  @param {userAPI.changeUserInfoParams} values 修改用户信息参数
 * */
export async function changeUserInfo(values: userAPI.changeUserInfoParams) {
  try {
    return await post<userAPI.response<null>>(userPath.changeUserInfo, values)
  } catch (e) {
    console.log(e)
  }
}


/**
 *  修改密码
 *  @param {userAPI.changePasswordParams} values 修改密码参数
 * */
export async function changePassword(values: userAPI.changePasswordParams) {
  try {
    return await post<userAPI.response<null>>(userPath.changePassword, values)
  } catch (e) {
    console.log(e)
  }
}

/**
 * 忘记密码
 * @param {userAPI.changePasswordParams} values 忘记密码参数
 * */
export async function changeNickname(values: userAPI.changeNicknameParams) {
  try {
    return await post<userAPI.response<null>>(userPath.changeNickname, values)
  } catch (e) {
    console.log(e)
  }
}


