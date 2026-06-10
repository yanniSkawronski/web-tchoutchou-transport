import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import apiBaseUrl, { Station } from '../../constants';

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
  readonly destroyRef = inject(DestroyRef);
  readonly STATION = signal<string>('');
  readonly LIMIT = 10;
  readonly displayedColumns = ['time', 'platform', 'transportName', 'to'];

  readonly favoritesResource = httpResource<Station[]>(() => ({
    url: apiBaseUrl + '/favorites/stations',
    params: { userId: 1 },
  }));

  readonly favorites = computed<Station[]>(() =>
    this.favoritesResource.hasValue() ? this.favoritesResource.value() : [],
  );

  readonly effectiveStation = computed(() => {
    const selected = this.STATION();
    if (selected) return selected;
    return this.favorites()[0]?.stationName ?? '';
  });

  readonly stationboardResource = httpResource<StationboardResponse>(() => {
    const station = this.effectiveStation();
    if (!station){
      // no station => no call because we don't know where to fetch from
      // note : the template handle this case with a disabled select :)
      return undefined;
    }
    return (
      apiBaseUrl +
      `/transport/stationboard?station=${encodeURIComponent(station)}&limit=${this.LIMIT}`
    );
  });

  constructor() {
    const intervalId = setInterval(() => this.stationboardResource.reload(), 30000);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  // resource.value() throws when the resource is in error state — gate access behind hasValue().
  readonly rows = computed<Entry[]>(() =>
    this.stationboardResource.hasValue() ? this.stationboardResource.value().stationboard : [],
  );

  formatTime(iso: string | null): string {
    if (!iso) return '—';
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? '—' : TIME_FORMAT.format(date);
  }

  reload(): void {
    this.stationboardResource.reload();
  }
}
