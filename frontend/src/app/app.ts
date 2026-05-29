import { Component, signal } from '@angular/core';
import { JourneyForm } from './components/journey-form/journey-form';

@Component({
  selector: 'app-root',
  imports: [JourneyForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
