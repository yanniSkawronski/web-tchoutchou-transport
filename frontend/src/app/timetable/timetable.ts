import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import apiBaseUrl from '../../constants';

interface Stop {
  departure: string | null;
  platform: string | null;
}

interface Entry {
  stop: Stop;
  category: string;
  number: string;
  to: string;
}

interface StationboardResponse {
  station: { name: string | null };
  stationboard: Entry[];
}

const TIME_FORMAT = new Intl.DateTimeFormat('fr-CH', {
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-timetable',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './timetable.html',
  styleUrl: './timetable.css',
})
export class Timetable {
  readonly STATIONS = ['Lausanne', 'Prilly-Malley', 'Temple de Broye'] as const;
  readonly STATION = signal<string>(this.STATIONS[0]);
  readonly LIMIT = 10;
  readonly displayedColumns = ['time', 'platform', 'transportName', 'to'];

  readonly resource = httpResource<StationboardResponse>(
    () =>
      apiBaseUrl +
      `/stationboard?station=${encodeURIComponent(this.STATION())}&limit=${this.LIMIT}`,
  );

  // resource.value() throws when the resource is in error state — gate access behind hasValue().
  readonly rows = computed<Entry[]>(() =>
    this.resource.hasValue() ? this.resource.value().stationboard : [],
  );

  formatTime(iso: string | null): string {
    if (!iso) return '—';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '—' : TIME_FORMAT.format(date);
  }

  reload(): void {
    this.resource.reload();
  }
}
