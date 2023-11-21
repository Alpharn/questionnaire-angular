import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IQuestion } from 'src/app/interfaces/question';
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
    private store: Store<QuestionState>,
    ){}

  ngOnInit(): void {
    this.store.dispatch(QuestionActions.loadQuestions());
    this.unansweredQuestions$ = this.store.select(selectUnansweredQuestions);
    this.answeredQuestions$ = this.store.select(selectAnsweredQuestions);
  }

}
