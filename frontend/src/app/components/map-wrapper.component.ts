import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, Inject, input, PLATFORM_ID, ViewChild, ViewContainerRef } from "@angular/core";


// This components purpose is to save us from SSR problems
// The fact is that leaflet<2 is not ssr compatible,
// so we can't import anything referencing it in an
// SSR context
@Component({
  selector: 'map-wrapper',
  template: `<ng-container #host />`,
})
export class MapWrapper implements AfterViewInit {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  start = input();
  end = input();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { TravelMap } = await import("../components/travel_map.component");

    const map = this.host.createComponent(TravelMap);
    map.setInput('start', this.start());
    map.setInput('end', this.end());
  }
}
