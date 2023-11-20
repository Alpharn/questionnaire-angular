import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';

import { IQuestion } from 'src/app/interfaces/question';
import { AnswerComponent } from '../answer/answer.component';
import { QuestionState } from "src/app/store/questions/reducers/question.reducer";
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { selectAnsweredQuestions, selectUnansweredQuestions } from 'src/app/store/questions/selectors/question.selectors';

@Component({
  selector: 'app-questions-page',
  templateUrl: './questions-page.component.html',
  styleUrls: ['./questions-page.component.scss']
})

export class QuestionsPageComponent implements OnInit {
  
  unansweredQuestions$!: Observable<IQuestion[]>;
  answeredQuestions$!: Observable<IQuestion[]>;

  constructor( 
    private dialog: MatDialog,
    private store: Store<QuestionState>,
    ){}

  ngOnInit(): void {
    this.store.dispatch(QuestionActions.loadQuestions());
    this.unansweredQuestions$ = this.store.select(selectUnansweredQuestions);
    this.answeredQuestions$ = this.store.select(selectAnsweredQuestions);
  }

  openAnswerDialog(questionId: string): void {
    this.unansweredQuestions$.pipe(
      take(1), 
      map(questions => questions.find(q => q.id === questionId))
    ).subscribe(question => {
      if (!question) return;
      
      const dialogRef = this.dialog.open(AnswerComponent, {
        width: '500px',
        data: question
      });
  
      dialogRef.afterClosed().subscribe(userAnswer => {
        if (userAnswer !== undefined) {
          this.store.dispatch(QuestionActions.answerQuestion({ id: questionId, answer: userAnswer }));
        }
      });
    });
  }
  
  rollbackAnswer(questionId: string): void {
    this.store.dispatch(QuestionActions.rollbackAnswer({ id: questionId }));
  }

}
