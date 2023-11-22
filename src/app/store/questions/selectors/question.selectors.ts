import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionState } from "src/app/store/questions/reducers/question.reducer";

export const questionFeatureKey = 'questions';

/** Selector to get the entire question state */
export const selectQuestionState = createFeatureSelector<QuestionState>(questionFeatureKey);

/** Selector to get all questions sorted by date */
export const selectQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

/** Selector to get answered questions sorted by date */
export const selectAnsweredQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .filter(q => q.answered)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

/** Selector to get unanswered questions sorted by date */
export const selectUnansweredQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .filter(q => !q.answered)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

/** Selector to get a specific question by its ID */
export const selectQuestionById = (questionId: string) => createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions.find(question => question.id === questionId)
);