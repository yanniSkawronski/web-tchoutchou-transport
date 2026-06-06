import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

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
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTableModule],
  templateUrl: './timetable.html',
  styleUrl: './timetable.css',
})
export class Timetable {
  readonly apiBaseUrl = 'https://transport.opendata.ch/v1';
  readonly STATION = 'Lausanne';
  readonly LIMIT = 10;
  readonly displayedColumns = ['time', 'platform', 'transportName', 'to'];

  readonly resource = httpResource<StationboardResponse>(
    () =>
      this.apiBaseUrl +
      `/stationboard?station=${encodeURIComponent(this.STATION)}&limit=${this.LIMIT}`,
  );

  // resource.value() throws when the resource is in error state, which would crash change
  // detection. Gate it behind hasValue() so the template can render unconditionally.
  readonly stationLabel = computed(() =>
    this.resource.hasValue() ? (this.resource.value().station.name ?? this.STATION) : this.STATION,
  );

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
