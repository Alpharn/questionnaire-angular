import { createReducer, on } from '@ngrx/store';

import * as QuestionActions from '../actions/question.actions';
import { IQuestion } from 'src/app/interfaces/question';

/** QuestionState - Interface representing the state structure for questions */
export interface QuestionState {
  questions: IQuestion[];
  error: any;
}

export const initialState: QuestionState = {
  questions: [],
  error: null
};

/** This reducer updates the state based on different question actions */
export const questionReducer = createReducer(
  initialState,
  on(QuestionActions.loadQuestionsSuccess, (state, { questions }) => ({ 
    ...state, questions 
  })),
  on(QuestionActions.loadQuestionsFailure, (state, { error }) => ({ 
    ...state, error 
  })),
  on(QuestionActions.addQuestion, (state, { question }) => ({
    ...state,
    questions: [...state.questions, question]
  })),
  on(QuestionActions.addQuestionSuccess, (state, { question }) => ({
    ...state,
    questions: [...state.questions, question]
  })),
  on(QuestionActions.deleteQuestionSuccess, (state, { id }) => ({
    ...state,
    questions: state.questions.filter(q => q.id !== id)
  })),
  on(QuestionActions.deleteQuestionFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(QuestionActions.answerQuestionSuccess, (state, { question }) => {
    if (!question) return state;
    const updatedQuestions = state.questions.map(q => 
      q.id === question.id ? question : q
    );
    return { ...state, questions: updatedQuestions };
  }),
  on(QuestionActions.rollbackAnswerSuccess, (state, { question }) => {
    if (!question) return state;
    const updatedQuestions = state.questions.map(q => 
      q.id === question.id ? question : q
    );
    return { ...state, questions: updatedQuestions };
  }),
);