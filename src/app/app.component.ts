import { Component, OnDestroy } from '@angular/core';

import { EventEmitterService } from "./services/event-emitter.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'app works!';

  constructor() {
    EventEmitterService.get('textChange').subscribe(data => this.title = data);
    EventEmitterService.get('showAlert').subscribe(this.onAlertListener);
  }

  onTextoListener(_title) {
    this.title = _title;
  }

  onAlertListener(_title) {
    alert(_title);
  }

  ngOnDestroy() {
    EventEmitterService.get('textChange').unsubscribe();
    EventEmitterService.get('showAlert').unsubscribe();
  }
}
