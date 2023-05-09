declare namespace adminAPI {
  type settingsRes = {
    assignments_count: number;
    assignments_score: number;
    daily_score:       number;
    examination_score: number;
    middle_score:      number;
    review_score:      number;
    show_examination:  number;

  }

  type settingsParams = {
    assignments_count: number;
    assignments_score: number;
    daily_score: number;
    examination_score: number;
    middle_score: number;
    review_score: number;
    show_examination: number;
  }
}
