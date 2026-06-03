import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatDateFormats, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

const FR_DATE_FORMATS: MatDateFormats = {
  parse: { dateInput: null },
  display: {
    dateInput: { day: 'numeric', month: 'short', year: 'numeric' },
    monthYearLabel: { month: 'short', year: 'numeric' },
    dateA11yLabel: { day: 'numeric', month: 'long', year: 'numeric' },
    monthYearA11yLabel: { month: 'long', year: 'numeric' },
  },
};

@Component({
  selector: 'app-connections',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
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
    console.log({
      stationFrom: this.stationFrom(),
      stationTo: this.stationTo(),
      date: this.date(),
      time: this.time(),
      timeType: this.timeType(),
    });
  }
}
