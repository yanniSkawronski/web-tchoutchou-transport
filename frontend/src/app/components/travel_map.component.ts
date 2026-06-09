import { Component, computed, effect, input, signal } from '@angular/core';
import { LeafletDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';
import { icon, Icon, latLng, LatLng, marker, tileLayer } from 'leaflet';
import { httpResource } from '@angular/common/http';
import apiBaseUrl from '../../constants';

interface Station {
  id: string;
  name: string;
  coordinate: {
    x: number,
    y: number
  }
}

interface StationsQueryResponse {
  stations: Station[];
}

@Component({
  selector: 'travel-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  providers: [],
  template: `
  <div style="height: 100%; width: 100%;"
      leaflet
      [leafletLayers]="[...(start_layer()), ...(end_layer())]"
      [leafletOptions]="leaflet_options"
      (leafletClick)="onClick($event)">
  </div>
  `,
})
export class TravelMap {

  start = input<string>();
  end = input<string>();
  start_station_name = signal<string>('');
  end_station_name = signal<string>('');

  constructor() {
    effect(() => {
      this.start_station_name.set(this.start() ?? '');
    });
    effect(() => {
      this.end_station_name.set(this.end() ?? '');
    });
  }

  state = computed<"empty" | "start" | "full">(
    () => {
      if (this.start())
        return "empty";
      if (this.end())
        return "start";
      return "full";
    }
  );
  readonly start_query = httpResource<StationsQueryResponse>(() => {
    const start = this.start_station_name();
    return start === undefined ? undefined : {
      url: apiBaseUrl + '/transport/locations',
      params: { query: start },
    }
  });
  readonly start_station = computed(() => {
    if (this.start_query.hasValue()) {
      const q = this.start_query.value();
      return q.stations.at(0);
    }
    return undefined;
  });

  readonly end_query = httpResource<StationsQueryResponse>(() => {
    const end = this.end_station_name();
    return end === undefined ? undefined : {
      url: apiBaseUrl + '/transport/locations',
      params: { query: end },
    }
  });
  readonly end_station = computed(() => {
    if (this.end_query.hasValue()) {
      const q = this.end_query.value();
      return q.stations.at(0);
    }
    return undefined;
  });

  readonly start_layer = computed(() => {
    const s = this.start_station();
    console.log(s);
    if (s !== undefined)
      return [this.marker_start(s.coordinate.x, s.coordinate.y)];
    return []
  })

  readonly end_layer = computed(() => {
    const s = this.end_station();
    console.log(s);
    if (s !== undefined)
      return [this.marker_start(s.coordinate.x, s.coordinate.y)];
    return []
  })

  layers: any[] = [];
  leaflet_options = {
    layers: [
      tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', { maxZoom: 12, attribution: '...', minZoom: 8 }),
    ],
    zoom: 9,
    center: latLng(46.534710, 6.580459)
  };

  onClick({ latlng, ...rest }: {latlng: LatLng}) {
    this.layers.push(marker([latlng.lat, latlng.lng]));
  }

  addStop(lat: number, lng: number) {}

  private marker_start(lat: number, lng: number) {
    return marker([lat, lng], {
	    icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    });
  }

}
