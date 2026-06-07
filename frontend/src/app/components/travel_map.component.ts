import { Component, input } from '@angular/core';
import { LeafletDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'travel-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  template: `
  <div style="height: 100%; width: 100%;"
      leaflet
      [leafletOptions]="leaflet_options"
      [leafletLayers]="layers"
      (leafletClick)="onClick($event)">
  </div>
  `,
})
export class TravelMap {
  latitude = input(46.534710);
  longitude = input(6.580459);
  layers: any[] = [];
  leaflet_options = {
    layers: [
      tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', { maxZoom: 12, attribution: '...', minZoom: 8 }),
    ],
    zoom: 9,
    center: latLng(46.534710, 6.580459)
  };

  onClick({ latlng, ...rest }: {latlng: LatLng}) {
    console.log(latlng);
    this.layers.push(marker([latlng.lat, latlng.lng]));
  }

  addStop(lat: number, lng: number) {}

  ngOnInit() {
    this.leaflet_options.center = latLng(this.latitude(), this.longitude());
  }
}
