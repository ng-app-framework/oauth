import {Injectable}                                                         from "@angular/core";
import {Observable}                                                         from "rxjs/Rx";
import {AsynchronousDefinition, Name, ObjectValidator, StringValidator}     from "@ng-app-framework/validation";
import {Endpoint, EndpointCaller, EndpointValidator, EndpointDocumentation} from "@ng-app-framework/api";
import {OAuthConfig}                                                        from "../Service/OAuthConfig";

@Name('RefreshTokenEndpoint')
@Injectable()
export class RefreshTokenEndpoint extends Endpoint {

    module              = 'OAuth';
    public path: string = 'api/oauth/v2/token';

    documentation: EndpointDocumentation[] = [
        {
            method   : 'get',
            name     : 'refresh',
            arguments: [
                {
                    name    : 'refreshToken',
                    type    : 'string',
                    required: true
                }
            ],
            request: {
                client_id    : "string",
                client_secret: "string",
                grant_type   : "'refresh-token'",
                refresh_token: "string"
            },
            response: {
                access_token: "string",
                refresh_token: "string"
            }
        }
    ];

    validator: EndpointValidator = new EndpointValidator(
        new AsynchronousDefinition(new ObjectValidator('Refresh Token Request', {
            refresh_token: new StringValidator('refresh_token')
        })),

        new AsynchronousDefinition(new ObjectValidator('Refresh Token Response', {
            access_token : new StringValidator('access_token'),
            refresh_token: new StringValidator('refresh_token')
        }))
    );

    constructor(public endpointCaller: EndpointCaller, public config: OAuthConfig) {
        super(endpointCaller);
    }

    public refresh(refreshToken: string): Observable<any> {
        return this.request('get', {
            client_id    : this.config.clientId,
            client_secret: this.config.clientSecret,
            grant_type   : 'refresh_token',
            refresh_token: refreshToken
        });
    }

    public transformResponse(response: { data: any, message: string }) {
        return response.data;
    }
}
