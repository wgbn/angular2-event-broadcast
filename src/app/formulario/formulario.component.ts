import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { EventEmitterService } from "../services/event-emitter.service";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  texto: string;
  //@Output() onTexto: any = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  clica() {
    //this.onTexto.emit(this.texto);
    EventEmitterService.get('text_change').emit(this.texto);
  }

  alerta() {
    EventEmitterService.get('showAlert').emit(this.texto);
  }

}
