/**
 *
 * */
export function getSumCount( studentInfo: dataAPI.studentInfo,settings: adminAPI.settingsRes){
  let num= (studentInfo.daily_score*settings.daily_score+
    studentInfo.examination_score*settings.examination_score+
    studentInfo.middle_score*settings.middle_score+
    studentInfo.review_score*settings.review_score+
    studentInfo.assignments_score*settings.assignments_score)/100
  return num.toFixed(2)
}
