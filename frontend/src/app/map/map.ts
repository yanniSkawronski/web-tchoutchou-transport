import { Component } from '@angular/core';
import { MapWrapper } from '../components/map-wrapper.component';

@Component({
  selector: 'app-map',
  imports: [MapWrapper],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapRoute {}
