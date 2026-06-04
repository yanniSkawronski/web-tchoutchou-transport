import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'map-wrapper',
  template: `<div style="height: 300px; width: 300px">
    <ng-container #host />
  </div>`,
})
export class MapWrapper implements AfterViewInit {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { TravelMap } = await import("../components/travel_map.component");

    this.host.createComponent(TravelMap);
  }
}
