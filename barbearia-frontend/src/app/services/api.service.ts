import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL: string;

  constructor(private http: HttpClient) {
    // Determinar a URL da API de forma segura (compatível com SSR)
    if (typeof window !== 'undefined') {
      // Ambiente do navegador
      this.API_URL = `${window.location.protocol}//${window.location.hostname}:8080`;
    } else {
      // Ambiente do servidor (SSR)
      this.API_URL = 'http://backend:8080';
    }
  }

  // ===== CLIENTES =====
  
  /**
   * Criar novo cliente
   * POST /clients
   */
  criarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.API_URL}/clients`, cliente);
  }

  /**
   * Listar todos os clientes
   * GET /clients
   */
  listarClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/clients`);
  }

  /**
   * Obter cliente por ID
   * GET /clients/{id}
   */
  obterClientePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/clients/${id}`);
  }

  /**
   * Atualizar cliente
   * PUT /clients/{id}
   */
  atualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.API_URL}/clients/${id}`, cliente);
  }

  /**
   * Deletar cliente
   * DELETE /clients/{id}
   */
  deletarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/clients/${id}`);
  }

  // ===== AGENDAMENTOS =====

  /**
   * Criar novo agendamento
   * POST /schedules
   */
  criarAgendamento(agendamento: any): Observable<any> {
    return this.http.post(`${this.API_URL}/schedules`, agendamento);
  }

  /**
   * Listar agendamentos do mês
   * GET /schedules/{year}/{month}
   */
  listarAgendamentosPorMes(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/schedules/${year}/${month}`);
  }

  /**
   * Listar todos os agendamentos
   * GET /listschedules
   */
  listarTodosAgendamentos(): Observable<any[]> {
    // backend exposes this under /schedules/listschedules
    return this.http.get<any[]>(`${this.API_URL}/schedules/listschedules`);
  }

  /**
   * Deletar agendamento
   * DELETE /schedules/{id}
   */
  deletarAgendamento(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/schedules/${id}`);
  }
}
