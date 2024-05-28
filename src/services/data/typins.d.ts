declare namespace dataAPI {
  type changeOneWorkParams = {
    id: number;
    score: number;
  };

  type changeOtherScoreParams = {
    userId: number;
    daily_score: number;
    examination_score: number;
    middle_score: number;
    review_score: number;
  };

  type studentScoreInfo = {
    assignments_score: number;
    daily_score: number;
    examination_score: number;
    review_score: number;
    middle_score: number;
    nickname: string;
    userId: number;
    username: string;
    average?: string;
  };

  type allStudentsInfo = studentScoreInfo[];

  type Assignment = {
    id?: number;
    score?: number;
    time?: number;
  };

  type studentInfo = {
    totalScore?: number;
    nickname: string;
    assignments: Assignment[];
    assignments_score: number;
    daily_score: number;
    examination_score: number;
    middle_score: number;
    review_score: number;
  };

  type allStudentsAVG = {
    dailyAVG: number;
    examinationAVG: number;
    middleAVG: number;
    reviewAVG: number;
  };

  type oneItem = {
    userId: number;
    score: number;
  };
  type addAssignmentsParams = {
    value: oneItem[];
  };
  type bookingPlanParma = {
    info: string;
    startTime: number;
    endTime: number;
  };
}
