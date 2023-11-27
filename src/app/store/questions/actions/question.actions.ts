import { createAction, props } from '@ngrx/store';

import { IQuestion } from 'src/app/interfaces/question';

/** Load question actions */
export const loadQuestions = createAction(
  '[Questions] Load Questions'
);

export const loadQuestionsSuccess = createAction(
  '[Questions] Load Questions Success', 
  props<{ questions: IQuestion[] }>()
);

export const loadQuestionsFailure = createAction(
  '[Questions] Load Questions Failure', 
  props<{ error: any }>()
);

/** Add question actions */
export const addQuestion = createAction(
  '[Questions] Add Question', 
  props<{ question: IQuestion }>()
);

export const addQuestionSuccess = createAction(
  '[Questions] Add Question Success',
  props<{ question: IQuestion }>()
);

export const addQuestionFailure = createAction(
  '[Questions] Add Question Failure',
  props<{ error: any }>()
);

/** Delete question actions */
export const deleteQuestion = createAction(
  '[Questions] Delete Question', 
  props<{ id: string }>()
);

export const deleteQuestionSuccess = createAction(
  '[Questions] Delete Question Success',
  props<{ id: string }>()
);

export const deleteQuestionFailure = createAction(
  '[Questions] Delete Question Failure',
  props<{ error: any }>()
);

/** Answer question actions */
export const answerQuestion = createAction(
  '[Questions] Answer Question',
  props<{ id: string, answer: string | string[] | null }>()
);

export const answerQuestionSuccess = createAction(
  '[Questions] Answer Question Success',
  props<{ question: IQuestion | null }>()
);

export const answerQuestionFailure = createAction(
  '[Questions] Answer Question Failure',
  props<{ error: any }>()
);

/** Rollback answer question actions */
export const rollbackAnswer = createAction(
  '[Questions] Rollback Answer',
  props<{ id: string }>()
);

export const rollbackAnswerSuccess = createAction(
  '[Questions] Rollback Answer Success',
  props<{ question: IQuestion | null }>()
);

export const rollbackAnswerFailure = createAction(
  '[Questions] Rollback Answer Failure',
  props<{ error: any }>()
);
