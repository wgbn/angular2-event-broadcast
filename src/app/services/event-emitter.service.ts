import { EventEmitter } from '@angular/core';

export class EventEmitterService {

    private static emitters: { [channel: string]: EventEmitter<any> } = {}

    static get (channel:string): EventEmitter<any> {
        if (!this.emitters[channel])
            this.emitters[channel] = new EventEmitter<any>();
        return this.emitters[channel];
    }

}