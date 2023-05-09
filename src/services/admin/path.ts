import {Php} from '../../global';
const isPhp = Php ?'.php':'';

export default {
  "getSettings":"/service/admin/getSettings" + isPhp, //获取设置
  "setSettings":"/service/admin/setSettings" + isPhp, //设置设置
}
