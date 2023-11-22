import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { IQuestion } from 'src/app/interfaces/question';
import { QuestionState } from "src/app/store/questions/reducers/question.reducer";
import * as QuestionActions from 'src/app/store/questions/actions/question.actions';
import { selectQuestionById } from 'src/app/store/questions/selectors/question.selectors';


/**
 * QuestionFormComponent - Component for creating and editing questions
 * This component handles both creating a new question and editing an existing one,
 * based on the mode ('create' or 'edit') provided as an input.
 */
@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})

export class QuestionFormComponent implements OnInit {

  /** Mode of the form: 'create' or 'edit' */
  @Input() mode: 'create' | 'edit' = 'create';

  /** The question object to be edited, if in edit mode */
  question: IQuestion | null = null;

  isSubmitted: boolean = false;

  /** The form group for question data */
  questionForm: FormGroup = this.fb.group({
    questionText: ['', Validators.required],
    questionType: ['single', Validators.required],
    options: this.fb.array([
      this.fb.group({ option: this.fb.control('', Validators.required) }),
      this.fb.group({ option: this.fb.control('', Validators.required) })
    ])
  })

   /** Available question types for selection */
  questionTypes = [
    { label: 'Single Choice', value: 'single' },
    { label: 'Multiple Choice', value: 'multiple' },
    { label: 'Open Question', value: 'open' },
  ];

  /** Getter for options FormArray */
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<QuestionState>,
    private router: Router,
    private route: ActivatedRoute,
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

  /** Adds an option to the options FormArray */
  addOption(): void {
    const optionGroup = this.fb.group({
      option: this.fb.control('', Validators.required)
    });
    this.options.push(optionGroup);
  }

  /**
   * Removes an option from the options FormArray at a specific index.
   * 
   * @param index The index of the option to remove.
   */
  removeOption(index: number): void {
    this.options.removeAt(index);
    this.options.updateValueAndValidity();
  }
  
  /**
   * Saves the question data to the store and navigates back to the manage questions page.
   * Handles both creation of a new question and updating an existing one.
   */
  saveQuestion(): void {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData: IQuestion = {
        id: this.mode === 'edit' && this.question ? this.question.id : uuidv4(),
        questionText: formValue.questionText,
        questionType: formValue.questionType,
        options: formValue.options.map((optionGroup: { option: string }) => optionGroup.option),
        createdAt: new Date(),
        answered: this.mode === 'edit' && this.question ? this.question.answered : false
      };

      this.store.dispatch(QuestionActions.addQuestion({ question: questionData }));
      this.router.navigate(['/manage-questions']);
    }
  }

  /** Cancels the form and navigates back to the manage questions page */
  cancel(): void {
    this.router.navigate(['/manage-questions']);
  }

  /**
   * Loads a question into the form for editing.
   * 
   * @param question The question to be loaded for editing.
   */
  private loadQuestion(question: IQuestion): void {
    this.question = question;
    this.questionForm.patchValue({
        questionText: question.questionText,
        questionType: question.questionType
    });

    const optionGroups = question.options.map(option => 
        this.fb.group({ option: option })
    );
    this.questionForm.setControl('options', this.fb.array(optionGroups));
  }

  /**
   * Sets up form changes to handle dynamic changes in the form, 
   * especially for changing question types.
   */
  private setupFormChanges(): void {
    const questionTypeControl = this.questionForm.get('questionType');
    if (questionTypeControl) {
      questionTypeControl.valueChanges.subscribe(value => {
        if (value === 'open') {
          this.options.clear();
        } else {
          while (this.options.length < 2) {
            this.addOption();
          }
        }
        this.options.updateValueAndValidity();
      });
    }
  }

}
