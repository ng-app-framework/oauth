import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {OAuthRefresher} from "./OAuthRefresher";
import {OAuthToken} from "./OAuthToken";
import {Value} from "@ng-app-framework/core";
import {EndpointCaller, EndpointConfig, HttpProxy} from "@ng-app-framework/api";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class OAuthEndpointCaller extends EndpointCaller {

    static EXPIRED_TOKEN = 'The access token provided has expired.';

    constructor(public http: HttpProxy,
                public oauth: OAuthToken,
                public refresher: OAuthRefresher,
                public config: EndpointConfig) {
        super(http, config);
    }

    public call(absoluteUrl: string, method: string, requestData: any = {}): Observable<any> {
        this.appendAccessTokenToData(requestData);
        return this.refresher.currentRefresh.concat(
            super.call(
                this.getUrlWithAccessToken(method, absoluteUrl),
                method,
                requestData
            )
                .catch(
                    (error, caught) => this.catchErrors(error, absoluteUrl, method, requestData)
                )
        );
    }

    protected catchErrors(error: HttpErrorResponse, absoluteUrl, method, requestData) {
        if (this.isUnauthorized(error) && error.error.error_description === OAuthEndpointCaller.EXPIRED_TOKEN) {
            return this.refreshAccessTokenAndRetry(absoluteUrl, method, requestData);
        }
        if (this.isUnauthorized(error)) {
            return this.handleUnauthorized();
        }
        return Observable.throw(error);
    }

    private isUnauthorized(error: HttpErrorResponse) {
        return Value.isProvided(error['status']) && error.status === 401;
    }

    private appendAccessTokenToData(data: any) {
        data['access_token'] = this.oauth.state.accessToken;
    }

    protected handleUnauthorized() {
        this.oauth.events.onFailure.emit();
        return Observable.empty();
    }

    protected refreshAccessTokenAndRetry(absoluteUrl, method: string, requestData: any) {
        return this.refresher.refresh().catch((err, caught) => this.handleUnauthorized())
            .flatMap(response => {
                requestData.access_token = this.oauth.state.accessToken;
                return super.call(absoluteUrl, method, requestData);
            });
    }

    protected getUrlWithAccessToken(method: string, absoluteUrl: string) {
        if (method === 'get') {
            return absoluteUrl;
        }
        return absoluteUrl + '?access_token=' + this.oauth.state.accessToken;
    }
}
