import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

import { IQuestion } from 'src/app/interfaces/question';
import { multipleChoiceValidator } from 'src/app/validators/question-validators';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {

  answerForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: IQuestion, 
    private dialogRef: MatDialogRef<AnswerComponent>
    ){}

  ngOnInit(): void {
    this.answerForm = this.fb.group({
      answer: this.initAnswerControl()
    });

    if (this.data.questionType === 'multiple') {
      this.answerForm.get('answer')!.setValidators(multipleChoiceValidator);
    }
  }

  initAnswerControl() {
    if (this.data.questionType === 'open') {
      return new FormControl('', Validators.required);
    } else if (this.data.questionType === 'single') {
      return new FormControl('', Validators.required);
    } else if (this.data.questionType === 'multiple') {
      const controls = this.data.options.map(option => new FormControl(false));
      return new FormArray(controls, multipleChoiceValidator); 
    } else {
      return new FormControl('');
    }
  }

  submitAnswer() {
    if (this.answerForm.invalid) {
      return; 
    }
    
    let answer;
    if (this.data.questionType === 'open' || this.data.questionType === 'single') {
      answer = this.answerForm.get('answer')!.value;
    } else if (this.data.questionType === 'multiple') {
      answer = this.answerForm.get('answer')!.value
        .map((checked: boolean, i: number) => checked ? this.data.options[i] : null)
        .filter((v: string | null) => v !== null);
    }
  
    this.dialogRef.close(answer);
  }
  
}
