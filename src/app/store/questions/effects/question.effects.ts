import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

import * as QuestionActions from '../actions/question.actions';
import { QuestionService } from 'src/app/services/question.service';
/**
 * This class contains the effects that handle the side effects of actions related to questions,
 * such as adding, loading, deleting, answering, and rolling back answers to questions.
 */
@Injectable()
export class QuestionEffects {

  constructor(
    private actions$: Actions,
    private questionService: QuestionService,
    private router: Router
  ) {}
  
  /**
   * Effect to handle the addition of a new question.
   * Upon successful addition, it navigates to the manage questions page.
   */
  public addQuestion$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.addQuestion),
    switchMap(action => this.questionService.saveQuestion(action.question).pipe(
      map(question => QuestionActions.addQuestionSuccess({ question })),
      tap(() => this.router.navigate(['/manage-questions'])),
      catchError(error => of(QuestionActions.addQuestionFailure({ error })))
    ))
  ));
  
  /** Effect to handle the loading of questions */
  public loadQuestions$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.loadQuestions),
    mergeMap(() => of(this.questionService.getQuestions()).pipe(
      map(questions => QuestionActions.loadQuestionsSuccess({ questions })),
      catchError(error => of(QuestionActions.loadQuestionsFailure({ error })))
    ))
  ));

  /** Effect to handle the deletion of a question */    
  public deleteQuestion$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.deleteQuestion),
    switchMap((action) => {
      this.questionService.deleteQuestion(action.id);
      return of(QuestionActions.deleteQuestionSuccess({ id: action.id }));
    }),
    catchError(error => of(QuestionActions.deleteQuestionFailure({ error })))
  ))
  
  /** Effect to handle the answering of a question */
  public answerQuestion$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.answerQuestion),
    switchMap(action => {
      return this.questionService.updateQuestionAnswer(action.id, action.answer).pipe(
        map(question => QuestionActions.answerQuestionSuccess({ question })),
        catchError(error => of(QuestionActions.answerQuestionFailure({ error })))
      );
    })
  ));

  /** Effect to handle the rollback of an answer to a question */
  public rollbackAnswer$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionActions.rollbackAnswer),
    switchMap(action => {
      return this.questionService.rollbackQuestionAnswer(action.id).pipe(
        map(question => QuestionActions.rollbackAnswerSuccess({ question })),
        catchError(error => of(QuestionActions.rollbackAnswerFailure({ error })))
      );
    })
  ));

}