import { Component, OnInit } from '@angular/core';

import { EventEmitterService } from "../services/event-emitter.service";

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  texto: string;

  constructor() { }

  ngOnInit() { }

  clica() {
    EventEmitterService.get('textChange').emit(this.texto);
  }

  alerta() {
    EventEmitterService.get('showAlert').emit(this.texto);
  }

}
