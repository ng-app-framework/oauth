import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgApiModule, EndpointCaller}                from "@ng-app-framework/api";
import {OAuthConfig}                   from "./Service/OAuthConfig";
import {OAuthToken}                    from "./Service/OAuthToken";
import {OAuthEndpointCaller}           from "./Service/OAuthEndpointCaller";
import {RefreshTokenEndpoint}          from "./Endpoint/RefreshTokenEndpoint";
import {OAuthRefresher}                from "./Service/OAuthRefresher";
import {NgValidationModule}            from "@ng-app-framework/validation";
import {NgStorageModule}               from "@ng-app-framework/storage";
import {NgCoreModule}                  from "@ng-app-framework/core";


@NgModule({
    imports  : [
        NgCoreModule,
        NgApiModule,
        NgStorageModule,
        NgValidationModule
    ],
    providers: [
        OAuthConfig,
        OAuthRefresher,
        RefreshTokenEndpoint,
        OAuthEndpointCaller,
        OAuthToken
    ]
})
export class NgOAuthModule {

    constructor(oauth: OAuthToken, refreshAccessToken: RefreshTokenEndpoint) {
    }

    static forRoot(clientId: string, clientSecret: string): ModuleWithProviders {
        return {
            ngModule : NgOAuthModule,
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

