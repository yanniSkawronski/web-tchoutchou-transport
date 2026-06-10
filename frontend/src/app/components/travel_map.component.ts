import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LeafletDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';
import { circle, circleMarker, icon, Icon, latLng, LatLng, LeafletMouseEventHandlerFn, marker, polyline, tileLayer } from 'leaflet';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import apiBaseUrl from '../../constants';
import { ActivatedRoute, Params, Router } from '@angular/router';

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

interface Section {
  journey: {
    category?: string,
    number?: string,
    operator?: string,
    to: string,
    passList: {
      station: Station
    }[]
  }
}

const section_colors = [
  'red',
  'lime',
  'fuchsia',
  'aqua',
  'yellow',
  'green',
  'orange',
  'purple'
]

interface Connection {
  sections: Section[]
}

interface ConnectionsResponse {
  connections: Connection[]
}

@Component({
  selector: 'travel-map',
  imports: [LeafletDirective, LeafletLayersDirective],
  providers: [],
  template: `
  <div style="height: 100%; width: 100%;"
      leaflet
      [leafletLayers]="[...(start_layer()), ...(end_layer()), ...(itinerary_layer())]"
      [leafletOptions]="leaflet_options"
      (leafletClick)="onClick($event)"
      >
  </div>
  `,
})
export class TravelMap {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

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
      if (!this.start_station_name())
        return "empty";
      if (!this.end_station_name())
        return "start";
      return "full";
    }
  );

  readonly start_query = httpResource<StationsQueryResponse>(() => this.build_station_query(this.start_station_name()));
  readonly start_station = computed(() => this.station_from_query(this.start_query));
  readonly start_layer = computed(() => this.create_marker(this.start_station(), (e) => this.click_start.apply(this)));

  readonly end_query = httpResource<StationsQueryResponse>(() => this.build_station_query(this.end_station_name()));
  readonly end_station = computed(() => this.station_from_query(this.end_query));
  readonly end_layer = computed(() => this.create_marker(this.end_station(), (e) => this.click_end.apply(this)));

  readonly itinerary_query = httpResource<ConnectionsResponse>(() => {
    return this.state() !== "full" ? undefined : {
      url: apiBaseUrl + '/transport/connections',
      params: { from: this.start_station_name(), to: this.end_station_name() },
    }
  });
  readonly itinerary = computed(() => {
    if (this.itinerary_query.hasValue()) {
      return this.itinerary_query.value().connections.at(0)?.sections
    }
    return undefined;
  });

  readonly itinerary_layer = computed(() => this.create_itinerary(this.itinerary()));

  leaflet_options = {
    layers: [
      tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg', { maxZoom: 12, attribution: '...', minZoom: 8 }),
    ],
    zoom: 9,
    center: latLng(46.534710, 6.580459)
  };

  onClick({ latlng, ...rest }: {latlng: LatLng}) {
    if (this.state() !== 'full') {
      this.http.get<{stations: Station[]}>(
        apiBaseUrl + '/transport/locations',
        {
          params: {
            x: latlng.lat,
            y: latlng.lng,
            type: 'station'
          }
        }
      ).subscribe((s) => {
        const station_name = s.stations.filter((s) => s.coordinate.x !== null && s.coordinate.y !== null).at(0)?.name;
        if (this.state() === 'empty') {
          this.set_start_station(station_name);
        }
        else {
          this.set_end_station(station_name);
        }
      });
    }
  }

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

  private create_marker(station: Station | undefined, onClick: LeafletMouseEventHandlerFn | undefined = undefined){
    if (station !== undefined) {
      let marker = this.marker_start(station.coordinate.x, station.coordinate.y);
      if (onClick !== undefined) {
        marker.on('click', onClick);
      }
      return [marker];
    }
    return []
  };

  private station_from_query(query_res: HttpResourceRef<StationsQueryResponse | undefined>) {
    if (query_res.hasValue()) {
      const q = query_res.value();
      return q.stations.at(0);
    }
    return undefined;
  }

  private build_station_query(station_name: string){
    return station_name == '' ? undefined : {
      url: apiBaseUrl + '/transport/locations',
      params: { query: station_name },
    }
  }

  private create_itinerary(itinerary: Section[] | undefined){
    if (itinerary !== undefined) {
      let layers: any[] = [];
      let i = 0;
      for (const s of itinerary) {
        if (!s.journey)
          continue;
        layers = layers.concat(this.make_section_layer(s, i));
        i++;
      }
      return layers;
    }
    return []
  };

  private make_section_layer(section: Section, id: number = 0) {
    const color = section_colors[id % section_colors.length];
    let path: number[][] = section.journey.passList.map((s) => [s.station.coordinate.x, s.station.coordinate.y]);
    return [
        polyline(path as any, { color: color, weight: 7, opacity: 0.6 }),
        ...(path.map(([x, y]) => circleMarker([x, y], {color: 'blue', weight: 2, opacity: 1.0, fillOpacity: 0.7, radius: 3})))
      ]
  }

  private click_start(){
    if (this.state() === 'full')
      return;
    this.start_station_name.set('');
    const queryParams: Params = {};

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams
      }
    );
  }
  private click_end(){
    this.end_station_name.set('');
    const queryParams: Params = { start: this.start_station_name() };

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams
      }
    );
  }

  private set_start_station(name: string | undefined) {
    if (name === undefined)
      return;
    this.start_station_name.set(name);
    const queryParams: Params = { start: name };

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams
      }
    );
  }

  private set_end_station(name: string | undefined) {
    if (name === undefined)
      return;
    this.end_station_name.set(name);
    const queryParams: Params = { start: this.start_station_name(), end: name };

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams
      }
    );
  }
}
