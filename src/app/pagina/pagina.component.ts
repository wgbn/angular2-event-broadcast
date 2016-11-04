import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService } from "../services/event-emitter.service";

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.css']
})
export class PaginaComponent implements OnInit, OnDestroy {

  constructor() {
    EventEmitterService.get('textChange').subscribe(data => console.log('PaginaComponent:', data));
  }

  ngOnInit() { }

  ngOnDestroy() {
    EventEmitterService.get('textChange').unsubscribe();
  }

}
