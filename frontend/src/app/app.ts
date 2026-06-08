import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatTabsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
