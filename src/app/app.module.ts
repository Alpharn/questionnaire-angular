import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { ManageQuestionsComponent } from './components/manage-questions/manage-questions.component';
import { QuestionFormComponent } from './components/question-form/question-form.component';
import { QuestionListComponent } from './components/question-list/question-list.component';
import { QuestionsPageComponent } from './components/questions-page/questions-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { questionReducer } from './store/questions/reducers/question.reducer';
import { QuestionEffects } from './store/questions/effects/question.effects';

@NgModule({
  declarations: [
    AppComponent,
    ManageQuestionsComponent,
    QuestionFormComponent,
    QuestionListComponent,
    QuestionsPageComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatToolbarModule,
    StoreModule.forRoot({questions: questionReducer}, {}),
    EffectsModule.forRoot([QuestionEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
