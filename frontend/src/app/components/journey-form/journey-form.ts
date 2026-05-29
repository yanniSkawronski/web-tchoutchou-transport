import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';

interface TripRequestData {
  stationFrom: string;
  stationTo: string;
  schedule: string;
  scheduleForArrivalTime: boolean;
}

@Component({
  selector: 'app-journey-form',
  imports: [MatFormFieldModule, MatInputModule, MatSlideToggleModule, FormField],
  templateUrl: './journey-form.html',
  styleUrl: './journey-form.css',
})
export class JourneyForm {
  tripRequestModel = signal<TripRequestData>({
    stationFrom: '',
    stationTo: '',
    schedule: '',
    scheduleForArrivalTime: false,
  });

  tripRequestForm = form(this.tripRequestModel);
}
