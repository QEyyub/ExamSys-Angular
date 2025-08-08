import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentComponent } from './pages/student/student.component';
import { ExamComponent } from './pages/exam/exam.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { BlankComponent } from './pages/blank/blank.component';

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'students', component: StudentComponent },
  { path: 'exams', component: ExamComponent },
  { path: 'lessons', component: LessonComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
