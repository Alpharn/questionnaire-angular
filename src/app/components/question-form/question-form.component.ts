import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { IQuestion } from 'src/app/interfaces/question';
import { minOptionsValidator } from 'src/app/validators/question-validators';
import { QuestionState } from "src/app/store/questions/reducers/question.reducer";
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { selectQuestionById } from 'src/app/store/questions/selectors/question.selectors';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})

export class QuestionFormComponent implements OnInit {

  @Input() mode: 'create' | 'edit' = 'create';
  question: IQuestion | null = null;
  isSubmitted: boolean = false;
  
  questionForm: FormGroup = this.fb.group({
    questionText: ['', Validators.required],
    questionType: ['single', Validators.required],
    options: this.fb.array([], minOptionsValidator())
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<QuestionState>,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.mode = 'edit';
          return this.store.select(selectQuestionById(id));
        }
        return [];
      }),
      take(1)
    ).subscribe(question => {
      if (question) {
        this.loadQuestion(question);
      }
    });

    this.setupFormChanges();
  }

  private setupFormChanges(): void {
    const questionTypeControl = this.questionForm.get('questionType');
    if (questionTypeControl) {
      questionTypeControl.valueChanges.subscribe(value => {
        if (value === 'open') {
          while (this.options.length !== 0) {
            this.options.removeAt(0);
          }
        }
        this.options.updateValueAndValidity();
      });
    }
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(): void {
    const optionGroup = this.fb.group({
      option: this.fb.control('', Validators.required)
    });
  
    this.options.push(optionGroup);
    this.cdr.detectChanges();
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
    this.options.updateValueAndValidity();
  }

  private loadQuestion(question: IQuestion): void {
    this.question = question;
    this.questionForm.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options
    });

    this.questionForm.setControl(
      'options', 
      this.fb.array(question.options.map(option => this.fb.group({ option: option })))
    );
  }
  
  saveQuestion(): void {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData: IQuestion = {
        id: this.mode === 'edit' && this.question ? this.question.id : uuidv4(),
        questionText: formValue.questionText,
        questionType: formValue.questionType,
        options: formValue.options.map((optionGroup: { option: string }) => optionGroup.option),
        createdAt: this.mode === 'edit' && this.question ? this.question.createdAt : new Date(),
        answered: this.mode === 'edit' && this.question ? this.question.answered : false
      };

      this.store.dispatch(QuestionActions.addQuestion({ question: questionData }));
      this.router.navigate(['/manage-questions']);
    }
  }

  cancel(): void {
    this.router.navigate(['/manage-questions']);
  }

}
