export interface Agendamento {
  id?: number;
  startAt: string;
  endAt: string;
  clientId: number;
  clientName?: string;
  barberName?: string;
  service?: string;
}

export interface SaveScheduleRequest {
  startAt: string;
  endAt: string;
  clientId: number;
}

export interface SaveScheduleResponse {
  id: number;
  startAt: string;
  endAt: string;
  clientId: number;
}

export interface ScheduleAppointmentMonthResponse {
  year: number;
  month: number;
  appointments: ClientScheduleAppointmentResponse[];
}

export interface ClientScheduleAppointmentResponse {
  id: number;
  day: number;
  startAt: string;
  endAt: string;
  clientId: number;
  clientName?: string;
}
