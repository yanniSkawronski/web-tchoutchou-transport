import { Component, computed, DestroyRef, inject, input, model, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import apiBaseUrl, { Station } from '../../constants';

interface LocationsApiResponse {
  stations: Array<{ id: string | null; name: string }>;
}

@Component({
  selector: 'app-station-autocomplete',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  styles: ['mat-form-field { width: 100%; }'],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        type="text"
        [value]="value()"
        [placeholder]="placeholder()"
        [matAutocomplete]="auto"
        (input)="onInput($event)"
        autocomplete="off"
      />
      @if (locationsResource.isLoading()) {
        <mat-spinner matSuffix diameter="18" />
      }
    </mat-form-field>

    <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onOptionSelected($event)">
      @if (favorites().length > 0) {
        <mat-optgroup label="Favoris">
          @for (fav of favorites(); track fav.id) {
            <mat-option [value]="fav.stationName">
              <span style="flex: 1">{{ fav.stationName }}</span>
              <button
                mat-icon-button
                tabindex="-1"
                aria-label="Retirer des favoris"
                (mousedown)="$event.preventDefault(); $event.stopPropagation()"
                (click)="removeFavorite($event, fav)"
              >
                <mat-icon>star</mat-icon>
              </button>
            </mat-option>
          }
        </mat-optgroup>
      }
      @if (locationsFiltered().length > 0 && debouncedQuery().length >= 2) {
        <mat-optgroup label="Résultats">
          @for (loc of locationsFiltered(); track loc.stationId) {
            <mat-option [value]="loc.stationName">
              <span style="flex: 1">{{ loc.stationName }}</span>
              <button
                mat-icon-button
                tabindex="-1"
                aria-label="Ajouter aux favoris"
                (mousedown)="$event.preventDefault(); $event.stopPropagation()"
                (click)="addFavorite($event, loc)"
              >
                <mat-icon>star_border</mat-icon>
              </button>
            </mat-option>
          }
        </mat-optgroup>
      }
    </mat-autocomplete>
  `,
})
export class StationAutocompleteComponent {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly label = input<string>('Station');
  readonly placeholder = input<string>('');
  readonly value = model<string>('');

  readonly debouncedQuery = signal<string>('');

  readonly favoritesResource = httpResource<Station[]>(() => apiBaseUrl + '/favorites/stations');
  readonly favorites = computed<Station[]>(() => this.favoritesResource.value() ?? []);

  readonly locationsResource = httpResource<LocationsApiResponse>(() => {
    const q = this.debouncedQuery();
    if (q.length < 2) return undefined;
    return `${apiBaseUrl}/transport/locations?query=${encodeURIComponent(q)}`;
  });

  readonly locationsFiltered = computed<Station[]>(() => {
    const favIds = new Set(this.favorites().map((s) => s.stationId));
    return (this.locationsResource.value()?.stations ?? [])
      .filter((l) => l.id !== null && !favIds.has(l.id))
      .map((l) => ({ id: l.id!, stationId: l.id!, stationName: l.name }));
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
    });
  }

  onInput(event: Event): void {
    const text = (event.target as HTMLInputElement).value;
    this.value.set(text);
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.debouncedQuery.set(text), 300);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.value.set(event.option.value as string);
  }

  addFavorite(event: MouseEvent, station: Station): void {
    event.stopPropagation();
    this.http
      .post(apiBaseUrl + '/favorites/stations', {
        stationId: station.stationId,
        stationName: station.stationName,
      })
      .subscribe(() => this.favoritesResource.reload());
  }

  removeFavorite(event: MouseEvent, station: Station): void {
    event.stopPropagation();
    this.http
      .delete(`${apiBaseUrl}/favorites/stations/${station.id}`)
      .subscribe(() => this.favoritesResource.reload());
  }
}
