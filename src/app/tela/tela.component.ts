import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService } from "../services/event-emitter.service";

@Component({
  selector: 'app-tela',
  templateUrl: './tela.component.html',
  styleUrls: ['./tela.component.css']
})
export class TelaComponent implements OnInit, OnDestroy {

  constructor() {
    EventEmitterService.get('textChange').subscribe(data => console.log('TelaComponent:', data));
  }

  ngOnInit() { }

  ngOnDestroy() {
    EventEmitterService.get('textChange').unsubscribe();
  }

}
