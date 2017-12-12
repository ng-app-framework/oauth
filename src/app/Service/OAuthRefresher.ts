import {Injectable} from "@angular/core";
import {RefreshTokenEndpoint} from "../Endpoint/RefreshTokenEndpoint";
import {OAuthToken} from "./OAuthToken";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Rx";
import {StringValue} from "@ng-app-framework/core";

@Injectable()
export class OAuthRefresher {
    public static EXPIRED_SESSION_MESSAGE = 'Session has expired. Please login again.';
    public static NOT_LOGGED_IN_MESSAGE   = 'Not logged in. Please login.';

    public currentRefresh: Observable<any> = Observable.empty();

    public isRefreshing = false;


    constructor(public oauth: OAuthToken,
                public refreshEndpoint: RefreshTokenEndpoint) {
    }

    public refresh(): Observable<string> {
        if (StringValue.isPopulated(this.oauth.state.refreshToken)) {
            return this.getRefreshObservable();
        }
        return this.error(OAuthRefresher.NOT_LOGGED_IN_MESSAGE);
    }

    private success(accessToken: string, refreshToken: string): string {
        this.oauth.save(accessToken, refreshToken);
        // Return access token to consume while chaining
        return accessToken;
    }

    private error(message: string): Observable<any> {
        this.oauth.events.onFailure.emit(message);
        // Consume the error and abort further operations.
        return Observable.empty();
    }

    private getRefreshObservable(): Observable<any> {
        if (this.isRefreshing) {
            return this.currentRefresh;
        }
        this.isRefreshing = true;
        return this.currentRefresh = this.callRefreshEndpoint();
    }

    private callRefreshEndpoint(): Observable<string> {
        this.isRefreshing = true;
        let observer      = new Subject<any>();
        this.refreshEndpoint.refresh(this.oauth.state.refreshToken)
            .catch((e, caught) => {
                return this.error(OAuthRefresher.EXPIRED_SESSION_MESSAGE);
            })
            .map((response, index) => {
                return this.success(response.access_token, response.refresh_token);
            }).finally(() => this.isRefreshing = false)
            .subscribe({
                next    : (result) => observer.next(result),
                complete: () => observer.complete()
            });
        return observer.asObservable();
    }
}
