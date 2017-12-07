import {ModuleWithProviders, NgModule} from '@angular/core';
import {OAuthConfig} from "./Service/OAuthConfig";
import {OAuthToken} from "./Service/OAuthToken";
import {OAuthEndpointCaller} from "./Service/OAuthEndpointCaller";
import {RefreshTokenEndpoint} from "./Endpoint/RefreshTokenEndpoint";
import {OAuthRefresher} from "./Service/OAuthRefresher";
import {ApiModule} from "@ng-app-framework/api";
import {ValidationModule} from "@ng-app-framework/validation";
import {StorageModule} from "@ng-app-framework/storage";


@NgModule({
    imports  : [
        ApiModule,
        StorageModule,
        ValidationModule
    ],
    providers: [
        OAuthConfig,
        OAuthRefresher,
        RefreshTokenEndpoint,
        OAuthEndpointCaller,
        OAuthToken
    ]
})
export class OAuthModule {

    constructor(oauth: OAuthToken) {
    }

    static forRoot(clientId: string, clientSecret: string): ModuleWithProviders {
        return {
            ngModule : OAuthModule,
            providers: [{
                provide : OAuthConfig,
                useValue: {
                    clientId,
                    clientSecret
                }
            }]
        };
    }
}

