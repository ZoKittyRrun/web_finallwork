import {Php} from '../../global';
const isPhp = Php ?'.php':'';
export default {
  "login":"/service/user/login" + isPhp, //用户登录接口
  "register":"/service/user/register"+ isPhp, //用户注册接口
  "isLogin":"/service/user/isLogin"+ isPhp, //用户是否登录接口
  "getUserInfo":"/service/user/getUserInfo"+ isPhp, //获取用户信息接口
  "changePassword":"/service/user/changePwd"+ isPhp, //修改密码接口
  "changeUserInfo":"/service/user/changeUserInfo"+ isPhp, //修改用户信息接口
  "changeNickname":"/service/user/changeNickname"+ isPhp, //修改用户昵称接口
  "logout":"service/user/logout"+ isPhp, //用户登出接口
}
