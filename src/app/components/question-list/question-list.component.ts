import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IQuestion } from 'src/app/interfaces/question';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent {
  @Input() questions: IQuestion[] = [];
  @Input() showActions: boolean = true;
  @Input() showOptions: boolean = false; 
  @Input() showAnswerButtons: boolean = false;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() answer = new EventEmitter<string>();
  @Output() rollback = new EventEmitter<string>();
  
  onAnswer(questionId: string) {
    this.answer.emit(questionId);
  }

  onRollback(questionId: string) {
    this.rollback.emit(questionId);
  }
}
