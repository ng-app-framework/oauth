import {OAuthEndpointCaller} from "../../src/app/Service/OAuthEndpointCaller";
import {Observable} from "rxjs/Rx";
import {HttpSpy, MockedResponse} from "@ng-app-framework/api";
import {EventEmitter} from "@angular/core";
import {HttpRequest} from "@angular/common/http";

export class OAuthEndpointCallerShunt extends OAuthEndpointCaller {


    mockResponse: MockedResponse | any = {};

    constructor() {
        super(<any>new HttpSpy(),
            <any>{
                events     :
                    <any>{
                        onFailure: new EventEmitter<any>()
                    },
                accessToken: '',
                state      : {
                    accessToken: ''
                }
            },
            <any>{
                currentRefresh: Observable.from([]),
                refresh       : () => Observable.from(['accessTokenString'])
            },
            {
                baseUri: ''
            });
    }

    protected createRequestObject(path: string, method: string, requestData: any): HttpRequest<any> {
        return Object.assign(
            super.createRequestObject(path, method, requestData),
            {mockResponse: this.mockResponse}
        );
    }
}
