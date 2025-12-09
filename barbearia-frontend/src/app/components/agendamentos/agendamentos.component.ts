import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';
import { Cliente } from '../../models/cliente';
import { Agendamento } from '../../models/agendamento';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <h2>Gerenciar Agendamentos</h2>
      
      <div class="form-container">
        <h3>Novo Agendamento</h3>
        <form [formGroup]="form">
          <mat-form-field appearance="fill">
            <mat-label>Cliente</mat-label>
            <mat-select formControlName="clientId">
              <mat-option>Selecione um cliente</mat-option>
              <mat-option *ngFor="let cliente of clientes" [value]="cliente.id">
                {{ cliente.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field appearance="fill">
            <mat-label>Data e Hora Inicial</mat-label>
            <input matInput type="datetime-local" formControlName="startAt">
          </mat-form-field>
          
          <mat-form-field appearance="fill">
            <mat-label>Data e Hora Final</mat-label>
            <input matInput type="datetime-local" formControlName="endAt">
          </mat-form-field>
          
          <button mat-raised-button color="primary" (click)="salvarAgendamento()" [disabled]="!form.valid">
            Agendar
          </button>
        </form>
      </div>

      <div class="table-container">
        <h3>Agendamentos - {{ mesAtual }}</h3>
        <div class="month-controls">
          <button mat-icon-button (click)="mes = mes - 1">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span>{{ mesAtual }}</span>
          <button mat-icon-button (click)="mes = mes + 1">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>

        <table mat-table [dataSource]="agendamentos" class="agendamentos-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>
          
          <ng-container matColumnDef="clientName">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let element">{{ element.clientName || getClientName(element.clientId) }}</td>
          </ng-container>

          <ng-container matColumnDef="barberName">
            <th mat-header-cell *matHeaderCellDef>Barbeiro</th>
            <td mat-cell *matCellDef="let element">{{ element.barberName || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="service">
            <th mat-header-cell *matHeaderCellDef>Serviço</th>
            <td mat-cell *matCellDef="let element">{{ element.service || '-' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="startAt">
            <th mat-header-cell *matHeaderCellDef>Início</th>
            <td mat-cell *matCellDef="let element">{{ element.startAt | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="endAt">
            <th mat-header-cell *matHeaderCellDef>Fim</th>
            <td mat-cell *matCellDef="let element">{{ element.endAt | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="warn" (click)="deletarAgendamento(element.id)" matTooltip="Deletar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="agendamentos.length === 0" class="empty-state">
          Nenhum agendamento para este mês
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 30px;
    }

    h3 {
      color: #666;
      margin-bottom: 15px;
    }

    .form-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    mat-form-field {
      width: 100%;
    }

    .table-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .month-controls {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      justify-content: center;
    }

    .month-controls span {
      min-width: 150px;
      text-align: center;
      font-weight: bold;
    }

    .agendamentos-table {
      width: 100%;
      margin-top: 15px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class AgendamentosComponent implements OnInit {
  form: FormGroup;
  agendamentos: Agendamento[] = [];
  clientes: Cliente[] = [];
  // Columns: add barber and service
  displayedColumns = ['id', 'clientName', 'barberName', 'service', 'startAt', 'endAt', 'acoes'];
  ano = new Date().getFullYear();
  mes = new Date().getMonth() + 1;

  get mesAtual(): string {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${meses[this.mes - 1]} de ${this.ano}`;
  }

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      clientId: ['', [Validators.required]],
      startAt: ['', [Validators.required]],
      endAt: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarAgendamentos();
  }

  ngOnChanges(): void {
    this.carregarAgendamentos();
  }

  carregarClientes(): void {
    this.apiService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }

  carregarAgendamentos(): void {
    this.apiService.listarTodosAgendamentos().subscribe({
      next: (response) => {
        // backend returns array of schedules with fields: id, clientName, clientEmail, clientPhone, barberName, date, endAt, service
        this.agendamentos = (response || []).map((s: any) => ({
          id: s.id,
          startAt: s.date || s.startAt || s.start_at,
          endAt: s.endAt || s.end_at,
          clientId: (s.clientId) ? s.clientId : undefined,
          clientName: s.clientName || s.client_name || '' ,
          barberName: s.barberName || s.barber_name || '',
          service: s.service || ''
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar agendamentos:', error);
        this.snackBar.open('Erro ao carregar agendamentos', 'Fechar', { duration: 5000 });
      }
    });
  }

  salvarAgendamento(): void {
    if (!this.form.valid) return;

    const dadosAgendamento = this.form.value;
    this.apiService.criarAgendamento(dadosAgendamento).subscribe({
      next: () => {
        this.snackBar.open('Agendamento criado com sucesso', 'Fechar', { duration: 3000 });
        this.form.reset();
        this.carregarAgendamentos();
      },
      error: (error) => {
        console.error('Erro ao criar agendamento:', error);
        this.snackBar.open('Erro ao criar agendamento', 'Fechar', { duration: 5000 });
      }
    });
  }

  deletarAgendamento(id: number): void {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      this.apiService.deletarAgendamento(id).subscribe({
        next: () => {
          this.snackBar.open('Agendamento deletado com sucesso', 'Fechar', { duration: 3000 });
          this.carregarAgendamentos();
        },
        error: (error) => {
          console.error('Erro ao deletar agendamento:', error);
          this.snackBar.open('Erro ao deletar agendamento', 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  getClientName(clientId: number): string {
    const cliente = this.clientes.find(c => c.id === clientId);
    return cliente ? cliente.name : 'Desconhecido';
  }
}
