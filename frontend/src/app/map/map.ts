import { Component, inject } from '@angular/core';
import { MapWrapper } from '../components/map-wrapper.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  imports: [MapWrapper],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapRoute {
  private route = inject(ActivatedRoute);
  start: string | undefined;
  end: string | undefined;

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe((params) => {
      this.start = params['start'];
      this.end = params['end'];
    });
  }
}
