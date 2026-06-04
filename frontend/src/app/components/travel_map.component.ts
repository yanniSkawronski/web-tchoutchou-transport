import { Component, input } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'travel-map',
  imports: [LeafletDirective],
  template: `
  <div style="height: 100%; width: 100%;"
      leaflet
      [leafletOptions]="leaflet_options">
  </div>
  `,
})
export class TravelMap {
  latitude = input(46.534710);
  longitude = input(6.580459);
  leaflet_options = {
    layers: [
      tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', { maxZoom: 18, attribution: '...', minZoom: 5 }),
    ],
    zoom: 13,
    center: latLng(46.534710, 6.580459)
  };

  ngOnInit() {
    this.leaflet_options.center = latLng(this.latitude(), this.longitude());
  }
}
