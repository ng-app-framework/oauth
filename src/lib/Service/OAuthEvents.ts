import {EventEmitter} from "@angular/core";

export class OAuthEvents {

    onSave: EventEmitter<any>    = new EventEmitter<any>();
    onLoad: EventEmitter<any>    = new EventEmitter<any>();
    onDestroy: EventEmitter<any> = new EventEmitter<any>();
    onFailure: EventEmitter<any> = new EventEmitter<any>();

    constructor() {

    }
}
