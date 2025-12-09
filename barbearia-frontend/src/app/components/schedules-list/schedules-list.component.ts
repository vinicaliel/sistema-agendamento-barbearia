import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Agendamento } from '../../models/agendamento';

@Component({
  selector: 'app-schedules-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="schedules-container">
      <mat-card class="schedules-card">
        <mat-card-header>
          <mat-card-title>Lista de Agendamentos</mat-card-title>
          <mat-card-subtitle>Exibe todos os agendamentos registrados</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="agendamentos" class="schedules-table">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let el">{{ el.id }}</td>
            </ng-container>

            <ng-container matColumnDef="clientName">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let el">{{ el.clientName }}</td>
            </ng-container>

            <ng-container matColumnDef="barberName">
              <th mat-header-cell *matHeaderCellDef>Barbeiro</th>
              <td mat-cell *matCellDef="let el">{{ el.barberName || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="service">
              <th mat-header-cell *matHeaderCellDef>Serviço</th>
              <td mat-cell *matCellDef="let el">{{ el.service || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="startAt">
              <th mat-header-cell *matHeaderCellDef>Início</th>
              <td mat-cell *matCellDef="let el">{{ el.startAt | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="endAt">
              <th mat-header-cell *matHeaderCellDef>Fim</th>
              <td mat-cell *matCellDef="let el">{{ el.endAt | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef>Ações</th>
              <td mat-cell *matCellDef="let el">
                <button mat-icon-button (click)="deletar(el.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <div *ngIf="agendamentos.length === 0" class="empty">Nenhum agendamento encontrado.</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .schedules-container { max-width: 1100px; margin: 24px auto; }
    .schedules-card { padding: 8px 12px; }
    .schedules-table { width: 100%; margin-top: 12px; }
    .empty { padding: 32px; text-align: center; color: #888; }
    th.mat-header-cell { background: #f5f5f5; }
  `]
})
export class SchedulesListComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  displayedColumns = ['clientName','barberName','service','startAt','endAt','acoes'];

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.listarTodosAgendamentos().subscribe({
      next: (res) => {
        this.agendamentos = (res || []).map((s: any) => ({
          id: s.id,
          startAt: s.date || s.startAt || s.start_at,
          endAt: s.endAt || s.end_at,
          clientId: s.clientId || s.client_id || 0,
          clientName: s.clientName || s.client_name || '',
          barberName: s.barberName || s.barber_name || '',
          service: s.service || ''
        }));
      },
      error: (err) => {
        console.error('Erro listar agendamentos:', err);
        this.snack.open('Erro ao carregar agendamentos', 'Fechar', { duration: 4000 });
      }
    });
  }

  deletar(id?: number): void {
    if (!id) return;
    if (!confirm('Deseja deletar este agendamento?')) return;
    this.api.deletarAgendamento(id).subscribe({
      next: () => { this.snack.open('Agendamento removido', 'Fechar', { duration: 3000 }); this.load(); },
      error: (e) => { console.error('Erro deletar', e); this.snack.open('Erro ao deletar', 'Fechar', { duration: 4000 }); }
    });
  }
}
