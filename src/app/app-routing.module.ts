import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'add-task', component: TaskFormComponent },
  { path: 'archive', component: ArchiveComponent },
  // { path: '**', redirectTo: '' }, // optional: wildcard redirect to home
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'edit/:id', component: TaskFormComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }