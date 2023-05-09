// @ts-ignore
/* eslint-disable */

declare namespace userAPI {
  type LoginParams = {
    username: string;
    password: string;
  }
  type RegisterParams = {
    username: string;
    password: string;
    nickname: string;
  }

  type response<T> ={
    code: number;
    data?: T;
    msg: string;
  }

  type userInfo = {
    name?: string;
    username: string;
    nickname: string;
    avatar?: string;
    email?: string;
    phone?: string;
  }

  type changeUserInfoParams = {
    avatar?: string;
    email?: string;
    phone?: string;
  }

  type changePasswordParams = {
    oldPassword: string;
    newPassword: string;
  }
  type changeNicknameParams = {
    value: string;
  }
}
