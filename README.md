# Broadcast de eventos no Angular 2

O Angular 2 veio com uma forma diferente de trabalhar com propriedades e eventos dos components. Quem desenvolvia em Angular 1.x conhece os métodos **broadcast()** e **emit()** disparados à partir do escopo. Isso nos permitia usar o **$rootScope** para disparar eventos globais, acessíveis em toda a aplicação, fazendo com que cada component que tivesse interesse nesse evento o escutasse utilizando o método **on()**.

Na nova versão, temos um novo conceito de *properties bindings* e *events bindings*, que agora são conhecidos como os **inputs** e **outputs** dos components. Ficou até mais fácil de trabalhar essas relações de binding agora.

Mas tem um porém: o *event binding* disparado com o *Output* num component só consegue ser escutado por seu pai, mas não se propaga para o pai do seu pai, e o pai deste, e assim por diante. Ficou confuso? Basicamente é que, no método tradicional de *event binding* do Angular 2 não da pra emitir um *boadcast* para qualquer component da aplicação escutar, mesmo não sendo pai de quem emitiu.

E esta semana me vi com esta necessidade de emitir um evento num component interno, pequeno, mas que estava encapsulado dentro de pelo menos outros dois components, e eu queria que a page (meu component principal) escutasse esse evento vindo de lá de dentro.

Foi aí que passei a estudar e pesquisar os eventos dentro do Angular 2 e cheguei a uma solução bem simples: usar um service.

### Usando um service para registrar os eventos globais

*Uma observação: continue usando os Outputs para emissão de eventos entre pai e filho, isso é a melhor forma de se fazer. Só use a emissão de eventos através de um service quando você quiser globalizar esse evento.*

Angular 2 te uma classe **EventEmitter** que trata do eventos dentro do framework. Mas se formos reparar bem, o *EventEmitter* é uma implementação em cima do **RxJs**, que trabalha, dentre outras coisas, com **subscribers**. Ou seja, nós podemos usar os *subscribers* no *EventEmitter* também. Para isso vamos implementar uma classe service bem simples:

```
import { EventEmitter } from '@angular/core';

export class EventEmitterService {

    private static emitters: {
        [nomeEvento: string]: EventEmitter<any>
    } = {}

    static get (nomeEvento:string): EventEmitter<any> {
        if (!this.emitters[nomeEvento])
            this.emitters[nomeEvento] = new EventEmitter<any>();
        return this.emitters[nomeEvento];
    }

}
```

Basicamente estamos criando uma classe que importa o *EventEmitter* do core do Angular 2. Nesta classe, se você reparar, estamos definindo propriedades e métodos **estáticos**, isso é interessante para que eu não precise ter uma instância do service em cada classe que eu for usar. Vamos apenas importar o service nas classes e executar diretamente os métodos.

`EventEmitterService.nomeDoMetodo();`

Então estamos definindo uma propriedade estática do tipo *EventEmitter*, porém genérica `[nomeEvento: string]: EventEmitter<any>`, já que vamos adicionar novos eventos dinamicamente.

E o método estático **get()** vai expor esta propriedade. Se ela já existir, nós a devolvemos, se não, nós a criamos antes de devolver.

À partir do momento que temos o objeto *EventEmitter*, podemos usar os métodos **emit()** e **subscribe()** para manipular os eventos.

### Emitindo um evento global

Na classe que vamos disparar o evento, vamos importar nosso service e somente emitir o evento, é tudo bem simples:

```
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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

  botaoClick() {
    EventEmitterService.get('textChange').emit(this.texto);
  }

  alertaClick() {
    EventEmitterService.get('showAlert').emit(this.texto);
  }

}
```

Como você pode notar, definimos dois eventos, **textChange** e **showAlert**. Esses eventos são criados dinamicamente passando seu nome para o método *get()*.

Como *get()* devolve um objeto *EventEmitter*, basta chamar o método *emit()* e disparar o valor que você quiser com seu evento. Neste exemplo estou passando somente **strings**, mas você poderia passar outros tipos primitivos ou um objeto mais complexo:

```
EventEmitterService.get('testeObject').emit({
    nome: 'John Snow',
    email: 'snow.john@got.com'
});
```

### Assinando (ou escutando) eventos globais

Agora é hora de registrar as classes que vão escutar esses eventos. O processo é igualmente simples, basta importar o service e, no construtor da classe, dizer quais eventos quer escutar:

```
import { Component } from '@angular/core';

import { EventEmitterService } from "./services/event-emitter.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor() {
    EventEmitterService.get('textChange').subscribe(data => this.title = data);
    EventEmitterService.get('showAlert').subscribe(this.onAlertListener);
  }

  onAlertListener(_title) {
    alert(_title);
  }
}
```

O processo todo é bem fácil. Aqui nós também usamos o método *get()* passando o *nome do evento* que queremos acessar, mas desta vez vamos nos **inscrever** para escutar esse evento através do método *subscribe()*.

Note que aqui fiz de duas formas, em uma eu escuto e já encadeio uma ação usando uma **arrow function**, que recebe o dado do evento e o atribui à propriedade local *title*. Na outra, eu passo uma função, *onAlertListener*, para o método *subscribe()* e essa função se encarregará de receber o dado do evento e exibir o alerta.

### Evitando problemas
Por fim, para evitar problemas de desempenho em sua aplicação Angular 2 que trabalha com eventos globais, eu sugiro que, em cada classe que você estiver escutando um evento global, você faca o **unsubscribe()** desse evento no método **OnDestroy** do seu component.

Dessa forma, você não deixará lixo na memória de sua aplicação:

```
ngOnDestroy() {
    EventEmitterService.get('nomeDoEvrnto').unsubscribe();
}
```

### Conclusão

Haverá momentos em que precisaremos disparar eventos globais que sejam escutados por um component distante do emissor ou por vários components ao mesmo tempo. Sabemos que isso pode não ser uma boa prática, mas isso vai depender muito da especificação de cada projeto e suas particularidades. Mas se temos de fazer isso, o Angular 2 nos dá uma ótima forma de fazer, e o que é melhor, bem simples e descomplicada.

## Como executar este exemplo

Primeiro, certifique-se que tenha o angular-cli instalado globalmente:

`sudo npm install -g angular-cli`

Feito isso, clone este repositório:

`git clone https://github.com/wgbn/angular2-event-broadcast.git`

Entre na pasta criada:

`cd angular2-event-broadcast`

Instale as dependências:

`npm install`

E rode o servidor:

`ng serve`

Agora, basta abrir o endereço http://localhost:4200 no browser de sua preferência.