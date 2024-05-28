import { get, post } from '@/utils/request';
import dataPath from './path';

/**
 * 获取全部学生信息
 * */
export async function getAllStudents() {
  try {
    return await get<API.response<dataAPI.allStudentsInfo>>(dataPath.getAllStudents);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 获取单个学生信息
 * */
export async function getStudentInfoById(id?: number) {
  try {
    return await get<API.response<dataAPI.studentInfo>>(dataPath.getStudentById, { id });
  } catch (e) {
    console.log(e);
  }
}

/**
 * 获取平均分
 * */
export async function getAverage() {
  try {
    return await get<API.response<dataAPI.allStudentsAVG>>(dataPath.getAverage);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 修改某一项作业成绩
 * */
export async function changeOneWork(values: dataAPI.changeOneWorkParams) {
  try {
    return await post<API.response<null>>(dataPath.changeOneWork, values);
  } catch (e) {
    console.log(e);
  }
}

/**
 * 修改其他成绩
 * */
export async function changeOtherScore(values: dataAPI.changeOtherScoreParams) {
  try {
    return await post<API.response<null>>(dataPath.changeOtherScore, values);
  } catch (e) {
    console.log(e);
  }
}

export async function addAssignments(values: dataAPI.addAssignmentsParams) {
  try {
    return await post<API.response<null>>(dataPath.addAssignments, values);
  } catch (e) {
    console.log(e);
  }
}
export async function bookingPlan(values: dataAPI.bookingPlanParma) {
  return await post<API.response<null>>(dataPath.bookingPlan, values);
}
