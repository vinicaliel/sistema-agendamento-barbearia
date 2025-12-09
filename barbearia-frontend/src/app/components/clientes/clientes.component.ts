import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'app-clientes',
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
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <h2>Gerenciar Clientes</h2>
      
      <div class="form-container">
        <h3>{{ editando ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
        <form [formGroup]="form">
          <mat-form-field appearance="fill">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="name" placeholder="Nome completo">
          </mat-form-field>
          
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="email@example.com">
          </mat-form-field>
          
          <mat-form-field appearance="fill">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone" placeholder="(11) 99999-9999">
          </mat-form-field>
          
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="salvarCliente()" [disabled]="!form.valid">
              {{ editando ? 'Atualizar' : 'Salvar' }}
            </button>
            <button mat-raised-button (click)="limparForm()" *ngIf="editando">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div class="table-container">
        <h3>Clientes Cadastrados</h3>
        <table mat-table [dataSource]="clientes" class="clientes-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>
          
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>
          
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Telefone</th>
            <td mat-cell *matCellDef="let element">{{ element.phone }}</td>
          </ng-container>
          
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button (click)="editarCliente(element)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletarCliente(element.id)" matTooltip="Deletar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <div *ngIf="clientes.length === 0" class="empty-state">
          Nenhum cliente cadastrado
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

    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .table-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .clientes-table {
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
export class ClientesComponent implements OnInit {
  form: FormGroup;
  clientes: Cliente[] = [];
  displayedColumns = ['id', 'name', 'email', 'phone', 'acoes'];
  editando = false;
  clienteIdEditando: number | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.apiService.listarClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.snackBar.open('Erro ao carregar clientes', 'Fechar', { duration: 5000 });
      }
    });
  }

  salvarCliente(): void {
    if (!this.form.valid) return;

    const dadosCliente = this.form.value;

    if (this.editando && this.clienteIdEditando) {
      this.apiService.atualizarCliente(this.clienteIdEditando, dadosCliente).subscribe({
        next: () => {
          this.snackBar.open('Cliente atualizado com sucesso', 'Fechar', { duration: 3000 });
          this.limparForm();
          this.carregarClientes();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
          this.snackBar.open('Erro ao atualizar cliente', 'Fechar', { duration: 5000 });
        }
      });
    } else {
      this.apiService.criarCliente(dadosCliente).subscribe({
        next: () => {
          this.snackBar.open('Cliente criado com sucesso', 'Fechar', { duration: 3000 });
          this.limparForm();
          this.carregarClientes();
        },
        error: (error) => {
          console.error('Erro ao criar cliente:', error);
          this.snackBar.open('Erro ao criar cliente', 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  editarCliente(cliente: Cliente): void {
    this.editando = true;
    this.clienteIdEditando = cliente.id || null;
    this.form.patchValue({
      name: cliente.name,
      email: cliente.email,
      phone: cliente.phone
    });
  }

  deletarCliente(id: number): void {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      this.apiService.deletarCliente(id).subscribe({
        next: () => {
          this.snackBar.open('Cliente deletado com sucesso', 'Fechar', { duration: 3000 });
          this.carregarClientes();
        },
        error: (error) => {
          console.error('Erro ao deletar cliente:', error);
          this.snackBar.open('Erro ao deletar cliente', 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  limparForm(): void {
    this.form.reset();
    this.editando = false;
    this.clienteIdEditando = null;
  }
}
