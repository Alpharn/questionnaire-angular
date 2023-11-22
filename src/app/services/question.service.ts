import { Injectable } from '@angular/core';
import { IQuestion } from '../interfaces/question';
import { Observable, of } from "rxjs";
import { v4 as uuidv4 } from 'uuid';

/**
 * This service handles operations related to questions such as retrieving,
 * saving, deleting, and updating questions. It uses localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  /** Array to hold questions */
  private questions: IQuestion[] = [];

   /** Key used for storing questions in localStorage */
  private storageKey = 'questions';

  constructor() {
    this.loadQuestions();
  }

  /**
   * Retrieves all questions.
   *
   * @returns An array of IQuestion objects.
   */
  getQuestions(): IQuestion[] {
    return this.questions;
  }

  /**
   * Retrieves a question by its ID.
   *
   * @param id The ID of the question to retrieve.
   * 
   * @returns The question object or undefined if not found.
   */
  getQuestionById(id: string): IQuestion | undefined {
    return this.questions.find(question => question.id === id);
  }

  /**
   * Saves a question. If the question is new, it is added; if it exists, it is updated.
   *
   * @param question The question object to be saved.
   * 
   * @returns An Observable containing the saved question.
   */
  saveQuestion(question: IQuestion): Observable<IQuestion> {
    const newQuestion = { ...question, id: question.id || uuidv4(), createdAt: question.createdAt || new Date() };
    this.questions = [...this.questions.filter(q => q.id !== newQuestion.id), newQuestion];
    this.saveQuestionsToStorage();
    return of(newQuestion);
  }

  /**
   * Deletes a question by its ID.
   *
   * @param id The ID of the question to delete.
   * 
   * @returns An Observable indicating the completion of the operation.
   */
  deleteQuestion(id: string): Observable<void> {
    this.questions = this.questions.filter(q => q.id !== id);
    this.saveQuestionsToStorage();
    return of();
  }

  /**
   * Updates the answer of a question.
   *
   * @param questionId The ID of the question to update.
   * 
   * @param answer The answer to be saved for the question.
   * 
   * @returns An Observable containing the updated question or null if not found.
   */
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
  
  /**
   * Rollbacks the answer of a question.
   *
   * @param questionId The ID of the question whose answer is to be rolled back.
   * 
   * @returns An Observable containing the updated question or null if not found.
   */
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

  /**
   * Saves the current state of questions to localStorage.
   */
  private saveQuestionsToStorage(): void {
    const questionsData = JSON.stringify(this.questions);
    localStorage.setItem(this.storageKey, questionsData);
  }

  /** Loads questions from localStorage into the questions array */
  private loadQuestions(): void {
    const questionsData = localStorage.getItem(this.storageKey);
    if (questionsData) {
      this.questions = JSON.parse(questionsData) || [];
    }
  }

}
