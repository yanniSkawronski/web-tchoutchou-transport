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
  latitude = input(46.81);
  longitude = input(8.22);
  leaflet_options = {
    layers: [
      // tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/2056/{z}/{x}/{y}.jpeg', { maxZoom: 18, attribution: '...' }),
      // tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.bav.schienennetz/default/current/2056/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 7,
    center: latLng(46.81, 8.22)
  };

  ngOnInit() {
    // this.leaflet_options.center = latLng(this.latitude(), this.longitude());
  }
}
