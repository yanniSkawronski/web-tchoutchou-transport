import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MapWrapper } from '../components/map-wrapper.component';
import { Connection, ConnectionsResponse } from './connections.types';

const FR_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: { day: 'numeric', month: 'short', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

interface SearchParams {
  from: string;
  to: string;
  date: string;
  time: string;
  isArrivalTime: 0 | 1;
}

@Component({
  selector: 'app-connections',
  imports: [
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MapWrapper,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-CH' },
    ...provideNativeDateAdapter(FR_DATE_FORMATS),
  ],
  templateUrl: './connections.html',
  styleUrl: './connections.css',
})
export class Connections {
  readonly stationFrom = signal<string>('');
  readonly stationTo = signal<string>('');
  readonly date = signal<Date | null>(null);
  readonly time = signal<string>('');
  readonly timeType = signal<'departure' | 'arrival'>('departure');

  readonly isValid = computed(
    () =>
      this.stationFrom().trim().length > 0 &&
      this.stationTo().trim().length > 0 &&
      this.date() !== null &&
      this.time().length > 0,
  );

  readonly searchParams = signal<SearchParams | null>(null);

  readonly connectionsResource = httpResource<ConnectionsResponse>(() => {
    const params = this.searchParams();
    if (!params) return undefined;
    return {
      url: 'https://transport.opendata.ch/v1/connections',
      params: { ...params },
    };
  });

  readonly connections = computed(() => this.connectionsResource.value()?.connections ?? []);
  readonly loading = this.connectionsResource.isLoading;
  readonly error = this.connectionsResource.error;

  readonly displayedColumns = ['departure', 'arrival', 'duration', 'changes'];
  readonly expandedConnection = signal<Connection | null>(null);

  toggleExpand(c: Connection): void {
    this.expandedConnection.update((curr) => (curr === c ? null : c));
  }

  onStationFromInput(event: Event): void {
    this.stationFrom.set((event.target as HTMLInputElement).value);
  }

  onStationToInput(event: Event): void {
    this.stationTo.set((event.target as HTMLInputElement).value);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.date.set(event.value);
  }

  onTimeInput(event: Event): void {
    this.time.set((event.target as HTMLInputElement).value);
  }

  search(): void {
    if (!this.isValid()) return;
    this.searchParams.set({
      from: this.stationFrom(),
      to: this.stationTo(),
      date: this.date()!.toISOString().slice(0, 10),
      time: this.time(),
      isArrivalTime: this.timeType() === 'arrival' ? 1 : 0,
    });
  }

  changesCount(c: Connection): number {
    return c.sections.filter((s) => s.journey !== null).length - 1;
  }

  formatDuration(raw: string): string {
    const m = /^(\d+)d(\d+):(\d+):/.exec(raw);
    if (!m) return raw;
    const days = +m[1];
    const hours = +m[2];
    const minutes = m[3];
    return days > 0 ? `${days}j ${hours}h${minutes}` : `${hours}h${minutes}`;
  }
}
