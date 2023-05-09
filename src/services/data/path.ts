import {Php} from '../../global';
const isPhp = Php ?'.php':'';

export default {
  "getAllStudents":"/service/data/getAllStudents"+ isPhp, //获取所有学生信息
  "getStudentById":"/service/data/getStudentById"+ isPhp, //根据id获取学生信息
  "getAverage":"/service/data/getAverage"+ isPhp, //获取平均分
  "changeOneWork":"/service/data/changeOneWork"+ isPhp, //修改某一项作业成绩
  "changeOtherScore":"/service/data/changeOtherScore"+ isPhp, //修改其他成绩
  "addAssignments":"/service/data/addAssignments"+ isPhp, //添加作业
}
