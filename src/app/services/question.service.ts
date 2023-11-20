import { Injectable } from '@angular/core';
import { IQuestion } from '../interfaces/question';
import { Observable, of } from "rxjs";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questions: IQuestion[] = [];
  private storageKey = 'questions';

  constructor() {
    this.loadQuestions();
  }

  private loadQuestions(): void {
    const questionsData = localStorage.getItem(this.storageKey);
    if (questionsData) {
      this.questions = JSON.parse(questionsData) || [];
    }
  }

  getQuestions(): IQuestion[] {
    return this.questions;
  }

  getQuestionById(id: string): IQuestion | undefined {
    return this.questions.find(question => question.id === id);
  }

  saveQuestion(question: IQuestion): Observable<IQuestion> {
    const newQuestion = { ...question, id: question.id || uuidv4(), createdAt: question.createdAt || new Date() };
    this.questions = [...this.questions.filter(q => q.id !== newQuestion.id), newQuestion];
    this.saveQuestionsToStorage();
    return of(newQuestion);
  }

  deleteQuestion(id: string): Observable<void> {
    this.questions = this.questions.filter(q => q.id !== id);
    this.saveQuestionsToStorage();
    return of();
  }
  
  private saveQuestionsToStorage(): void {
    const questionsData = JSON.stringify(this.questions);
    localStorage.setItem(this.storageKey, questionsData);
  }

  updateQuestionAnswer(questionId: string, answer: any): Observable<IQuestion | null> {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      const updatedQuestion = { 
        ...this.questions[questionIndex], 
        answered: true, 
        answer: answer,
        createdAt: new Date()
       };
      this.questions = [
        ...this.questions.slice(0, questionIndex),
        updatedQuestion,
        ...this.questions.slice(questionIndex + 1)
      ];
      this.saveQuestionsToStorage();
      return of(updatedQuestion);
    } else {
      return of(null);
    }
  }
  
  rollbackQuestionAnswer(questionId: string): Observable<IQuestion | null> {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      const updatedQuestion = { ...this.questions[questionIndex], answered: false, answer: null };
      this.questions = [
        ...this.questions.slice(0, questionIndex),
        updatedQuestion,
        ...this.questions.slice(questionIndex + 1)
      ];
      this.saveQuestionsToStorage();
      return of(updatedQuestion);
    } else {
      return of(null); 
    }
  }

}
