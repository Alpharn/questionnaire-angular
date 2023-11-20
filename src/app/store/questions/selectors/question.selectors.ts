import { createFeatureSelector, createSelector } from '@ngrx/store';
import { QuestionState } from "src/app/store/questions/reducers/question.reducer";

export const questionFeatureKey = 'questions';

export const selectQuestionState = createFeatureSelector<QuestionState>(questionFeatureKey);

export const selectQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

export const selectAnsweredQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .filter(q => q.answered)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

export const selectUnansweredQuestions = createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions
    .filter(q => !q.answered)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

export const selectQuestionById = (questionId: string) => createSelector(
  selectQuestionState,
  (state: QuestionState) => state.questions.find(question => question.id === questionId)
);