import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AgendamentoFormComponent } from './components/agendamento-form/agendamento-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'agendamento', component: AgendamentoFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }