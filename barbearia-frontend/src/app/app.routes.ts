import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { AgendamentosComponent } from './components/agendamentos/agendamentos.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Barbearia Style - Home'
  },
  { 
    path: 'clientes', 
    component: ClientesComponent,
    title: 'Clientes'
  },
  { 
    path: 'agendamentos', 
    component: AgendamentosComponent,
    title: 'Agendamentos'
  },
  {
    path: 'listschedules',
    loadComponent: () => import('./components/schedules-list/schedules-list.component')
      .then(m => m.SchedulesListComponent),
    title: 'Lista de Agendamentos'
  },
  { 
    path: 'agendamento', 
    loadComponent: () => import('./components/agendamento-form/agendamento-form.component')
      .then(m => m.AgendamentoFormComponent),
    title: 'Agendamento'
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];