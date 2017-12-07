import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {AsynchronousDefinition, Name, ObjectValidator, StringValidator} from "@ng-app-framework/validation";
import {Callable, Endpoint, EndpointValidator} from "@ng-app-framework/api";

@Name('RefreshTokenEndpoint')
@Injectable()
export class RefreshTokenEndpoint extends Endpoint {

    public path: string = 'security/refresh';

    validator: EndpointValidator = new EndpointValidator(
        new AsynchronousDefinition(new ObjectValidator('Refresh Token Request', {
            refresh_token: new StringValidator('refresh_token')
        })),

        new AsynchronousDefinition(new ObjectValidator('Refresh Token Response', {
            access_token : new StringValidator('access_token'),
            refresh_token: new StringValidator('refresh_token')
        }))
    );

    constructor(public endpointCaller: Callable) {
        super(endpointCaller);
    }

    public refresh(refreshToken: string): Observable<any> {
        return this.request('get', {refresh_token: refreshToken});
    }

    public transformResponse(response: { data: any, message: string }) {
        return response.data;
    }
}
