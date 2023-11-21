import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IQuestion } from 'src/app/interfaces/question';
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { multipleChoiceValidator } from 'src/app/validators/question-validators';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit, OnChanges {
  @Input() questions: IQuestion[] = [];
  @Input() showActions: boolean = true;
  @Input() showOptions: boolean = false; 
  @Input() showAnswerButtons: boolean = false;
  @Input() showAnswerForm: boolean = true;
  @Input() showAnswers: boolean = true;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  answerForms: { [id: string]: FormGroup } = {};

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.questions.forEach(question => {
      this.answerForms[question.id] = this.createAnswerForm(question);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] && changes['questions'].currentValue) {
      this.questions.forEach(question => {
        this.answerForms[question.id] = this.createAnswerForm(question);
      });
    }
  }
  
  createAnswerForm(question: IQuestion): FormGroup {
  if (question.questionType === 'open') {
    return this.fb.group({ answer: ['', Validators.required] });
  } else if (question.questionType === 'single') {
    return this.fb.group({ answer: ['', Validators.required] });
  } else if (question.questionType === 'multiple') {
    const controls = question.options.map(() => new FormControl(false));
    return this.fb.group({
      answer: new FormArray(controls, multipleChoiceValidator) 
    });
  }
  return this.fb.group({});
 }

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

  onRollback(questionId: string): void {
    this.store.dispatch(QuestionActions.rollbackAnswer({ id: questionId }));
  }
}
