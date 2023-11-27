import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageQuestionsComponent } from '../app/components/manage-questions/manage-questions.component';
import { QuestionFormComponent } from '../app/components/question-form/question-form.component';
import { QuestionsPageComponent } from '../app/components/questions-page/questions-page.component';
import { AppRoutes } from "src/app/constants/routes";

const routes: Routes = [
  { path: AppRoutes.Home, redirectTo: AppRoutes.ManageQuestions, pathMatch: 'full' },
  { path: AppRoutes.ManageQuestions, component: ManageQuestionsComponent },
  { path: AppRoutes.CreateQuestion, component: QuestionFormComponent, data: { mode: 'create' } },
  { path: AppRoutes.EditQuestion, component: QuestionFormComponent, data: { mode: 'edit' } },
  { path: AppRoutes.QuestionsPage, component: QuestionsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
