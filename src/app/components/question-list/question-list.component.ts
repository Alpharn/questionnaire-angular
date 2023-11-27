import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IQuestion } from 'src/app/interfaces/question';
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { multipleChoiceValidator } from "src/app/validators/question-validators";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})

export class QuestionListComponent implements OnInit, OnChanges {

  /** Array of questions to be displayed */
  @Input() questions: IQuestion[] = [];

  /** Flags to control the visibility of various elements in the template */
  @Input() showActions: boolean = true;
  @Input() showOptions: boolean = false; 
  @Input() showAnswerButtons: boolean = false;
  @Input() showAnswerForm: boolean = true;
  @Input() showAnswers: boolean = true;

  /** Events to emit when edit or delete actions are triggered */
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  /** Object to store answer forms for each question */
  answerForms: { [id: string]: FormGroup } = {};

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}
  
  /** OnInit lifecycle hook to initialize answer forms for each question */
  ngOnInit(): void {
    this.questions.forEach(question => {
      this.answerForms[question.id] = this.createAnswerForm(question);
    });
  }
  
  /**
   * OnChanges lifecycle hook to update answer forms when questions input changes.
   *
   * @param changes Object containing changes of input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] && changes['questions'].currentValue) {
      this.questions.forEach(question => {
        this.answerForms[question.id] = this.createAnswerForm(question);
      });
    }
  }
  
  /**
   * Creates a FormGroup for answering a question based on its type.
   *
   * @param question The question object based on which the form is created.
   * 
   * @return FormGroup for answering the provided question.
   */
  createAnswerForm(question: IQuestion): FormGroup {
    if (question.questionType === 'open' || question.questionType === 'single') {
      return this.fb.group({ answer: ['', Validators.required] });
    } else if (question.questionType === 'multiple') {
      const controls = question.options.map(() => new FormControl(false));
      return this.fb.group({ answer: new FormArray(controls, multipleChoiceValidator) });
    }
    return this.fb.group({});
  }

  /**
   * Submits an answer for a question.
   *
   * @param questionId The ID of the question being answered.
   */
  submitAnswer(questionId: string): void {
    const answerForm = this.answerForms[questionId];
    if (answerForm.valid) {
      let answer = answerForm.value.answer;
      if (Array.isArray(answer)) { 
        answer = answer.map((checked, i) => checked ? this.questions.find(q => q.id === questionId)?.options[i] : null)
        .filter(v => v !== null);
      }
      this.store.dispatch(QuestionActions.answerQuestion({ id: questionId, answer }));
    }
  }

  /**
   * Dispatches an action to rollback an answer for a question.
   *
   * @param questionId The ID of the question for which the answer is being rolled back.
   */
  onRollback(questionId: string): void {
    this.store.dispatch(QuestionActions.rollbackAnswer({ id: questionId }));
  }
  
}
