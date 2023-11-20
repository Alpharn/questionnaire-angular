import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { QuestionState } from "src/app/store/questions/reducers/question.reducer";
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { selectQuestions } from 'src/app/store/questions/selectors/question.selectors';

@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.scss']
})
export class ManageQuestionsComponent implements OnInit {
  questions$ = this.store.select(selectQuestions);

  constructor(
    private router: Router,
    private store: Store<QuestionState>,
    ) {}

    ngOnInit(): void {
      this.store.dispatch(QuestionActions.loadQuestions());
    }

    navigateToCreateQuestion(): void {
      this.router.navigate(['/create-question']);
    }
  
    navigateToListOfQuestions(): void {
      this.router.navigate(['/lists-of-questions']);
    }
    
    editQuestion(id: string): void {
      this.router.navigate(['/edit-question', id]);
    }
  
    deleteQuestion(id: string): void {
      this.store.dispatch(QuestionActions.deleteQuestion({ id }));
    }

}