import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe
  ]
})
export class HomeComponent {
  servicos = [
    { 
      nome: 'Corte Clássico', 
      descricao: 'Corte tradicional com tesoura e máquina', 
      preco: 50,
      icon: 'content_cut'
    },
    { 
      nome: 'Barba Completa', 
      descricao: 'Hidratação, modelagem e acabamento', 
      preco: 35,
      icon: 'face'
    },
    { 
      nome: 'Pacote Premium', 
      descricao: 'Corte + Barba + Hidratação', 
      preco: 80,
      icon: 'spa'
    }
  ];
}