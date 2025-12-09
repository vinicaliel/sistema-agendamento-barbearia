import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-agendamento-form',
  templateUrl: './agendamento-form.component.html',
  styleUrls: ['./agendamento-form.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipe,
    NgFor
  ]
})
export class AgendamentoFormComponent {
  servicos = [
    { id: 1, nome: 'Corte Clássico', duracao: 30, preco: 50, icon: 'content_cut' },
    { id: 2, nome: 'Barba Completa', duracao: 45, preco: 35, icon: 'face' },
    { id: 3, nome: 'Pacote Premium', duracao: 90, preco: 80, icon: 'spa' },
    { id: 4, nome: 'Corte Infantil', duracao: 30, preco: 40, icon: 'child_care' }
  ];

  barbeiros = [
    { id: 1, nome: 'João Silva' },
    { id: 2, nome: 'Carlos Andrade' },
    { id: 3, nome: 'Marcos Oliveira' }
  ];

  form = new FormGroup({
    clientName: new FormControl('', [Validators.required]),
    clientEmail: new FormControl('', [Validators.required, Validators.email]),
    clientPhone: new FormControl('', []),
    servico: new FormControl('', [Validators.required]),
    barbeiro: new FormControl('', [Validators.required]),
    data: new FormControl('', [Validators.required]),
    horario: new FormControl('', [Validators.required]),
    observacoes: new FormControl('')
  });

  horariosDisponiveis = this.gerarHorarios();

  private gerarHorarios(): string[] {
    const horarios = [];
    for (let hora = 9; hora <= 18; hora++) {
      horarios.push(`${hora}:00`, `${hora}:30`);
    }
    return horarios;
  }

  constructor(private apiService: ApiService) { }

  agendar() {
    if (this.form.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const { data, horario, servico, barbeiro, clientName, clientEmail, clientPhone } = this.form.value;

    console.log('Raw form data:', { data, horario, servico, barbeiro });

    if (!data || !horario || !servico) {
      return;
    }

    // Parse e validação robusta da data
    const startAtDate = this.parseToDate(data);
    if (!startAtDate || isNaN(startAtDate.getTime())) {
      console.error('Data inválida DETECTADA:', data);
      alert('Erro: Data inválida selecionada.');
      return;
    }

    if (!horario || typeof horario !== 'string' || horario.indexOf(':') === -1) {
      console.error('Horário inválido:', horario);
      alert('Erro: Horário inválido.');
      return;
    }

    const parts = horario.split(':').map(p => Number(p));
    if (parts.length < 2 || parts.some(p => !isFinite(p))) {
      console.error('Horário inválido após parse:', parts);
      alert('Erro: Horário inválido.');
      return;
    }

    const [hora, minuto] = parts;
    startAtDate.setHours(hora, minuto, 0, 0);

    if (isNaN(startAtDate.getTime())) {
      console.error('Data inválida após setHours');
      alert('Erro ao processar horário.');
      return;
    }

    let startAt: string;
    let endAt: string;
    try {
      startAt = startAtDate.toISOString();
    } catch (e) {
      console.error('Erro ao converter startAt para ISO:', e, startAtDate);
      alert('Erro ao processar data/hora do agendamento.');
      return;
    }

    // Buscar objetos selecionados (os selects armazenam ids)
    const servicoId = Number(servico);
    const barbeiroId = Number(barbeiro);
    const selectedServico = this.servicos.find(s => s.id === servicoId) as any;
    const selectedBarbeiro = this.barbeiros.find(b => b.id === barbeiroId) as any;

    // Calcular endAt baseado na duração do serviço (fallback 30 minutos)
    const duracao = (selectedServico && selectedServico.duracao) ? selectedServico.duracao : 30;
    const endAtDate = new Date(startAtDate.getTime() + duracao * 60000);
    try {
      endAt = endAtDate.toISOString();
    } catch (e) {
      console.error('Erro ao converter endAt para ISO:', e, endAtDate);
      alert('Erro ao processar data/hora do agendamento.');
      return;
    }

    const payload: any = {
      startAt,
      endAt,
      // preencher campos esperados pelo backend
      clientName: clientName || 'Cliente',
      clientEmail: clientEmail || 'cliente@local.test',
      clientPhone: clientPhone || '',
      barberName: (selectedBarbeiro && selectedBarbeiro.nome) ? selectedBarbeiro.nome : '',
      service: (selectedServico && selectedServico.nome) ? selectedServico.nome : ''
    };

    console.log('Enviando agendamento:', payload);

    this.apiService.criarAgendamento(payload).subscribe({
      next: (response: any) => {
        console.log('Agendamento criado com sucesso!', response);
        alert('Agendamento realizado com sucesso!');
        this.form.reset();
      },
      error: (error: any) => {
        console.error('Erro ao agendar:', error);
        alert('Erro ao realizar agendamento. Tente novamente.');
      }
    });
  }

  // Tenta parsear vários formatos retornados pelo Datepicker/inputs
  private parseToDate(value: any): Date | null {
    if (value == null) return null;

    // Já é Date
    if (value instanceof Date) {
      return new Date(value.getTime());
    }

    // ISO / string clássica
    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;

      // try dd/mm/yyyy
      const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) {
        const day = Number(m[1]);
        const month = Number(m[2]) - 1;
        const year = Number(m[3]);
        const nd = new Date(year, month, day);
        if (!isNaN(nd.getTime())) return nd;
      }

      // try yyyy-mm-dd
      const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (iso) {
        const year = Number(iso[1]);
        const month = Number(iso[2]) - 1;
        const day = Number(iso[3]);
        const nd = new Date(year, month, day);
        if (!isNaN(nd.getTime())) return nd;
      }

      return null;
    }

    // Angular datepicker/NgbDate returns objeto {year,month,day}
    if (typeof value === 'object') {
      if ('year' in value && 'month' in value && 'day' in value) {
        const year = Number((value as any).year);
        const month = Number((value as any).month) - 1;
        const day = Number((value as any).day);
        const nd = new Date(year, month, day);
        if (!isNaN(nd.getTime())) return nd;
      }

      // Fallback: tentar new Date nos casos restantes
      try {
        const d = new Date(value as any);
        if (!isNaN(d.getTime())) return d;
      } catch (e) {
        // ignore
      }
    }

    return null;
  }
}