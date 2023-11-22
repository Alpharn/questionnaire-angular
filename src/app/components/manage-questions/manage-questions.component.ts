import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { QuestionState } from "src/app/store/questions/reducers/question.reducer";
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { selectQuestions } from 'src/app/store/questions/selectors/question.selectors';

/**
 * ManageQuestionsComponent - Component for managing questions
 * This component provides functionalities to load, create, edit, and delete questions.
 * It uses NgRx for state management.
 */
@Component({
  selector: 'app-manage-questions',
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.scss']
})
export class ManageQuestionsComponent implements OnInit {
  
  /** Observable stream of questions */
  questions$ = this.store.select(selectQuestions);

  constructor(
    private router: Router,
    private store: Store<QuestionState>,
    ) {}

    /** OnInit lifecycle hook to dispatch the loadQuestions action */
    ngOnInit(): void {
      this.store.dispatch(QuestionActions.loadQuestions());
    }

    navigateToCreateQuestion(): void {
      this.router.navigate(['/create-question']);
    }
  
    navigateToListOfQuestions(): void {
      this.router.navigate(['/lists-of-questions']);
    }
    
    /**
     * Navigate to the Edit Question page for a given question ID
     *
     * @param id The ID of the question to edit
     */
    editQuestion(id: string): void {
      this.router.navigate(['/edit-question', id]);
    }
    
    /**
     * Dispatch an action to delete a question by its ID
     *
     * @param id The ID of the question to delete
     */
    deleteQuestion(id: string): void {
      this.store.dispatch(QuestionActions.deleteQuestion({ id }));
    }

}