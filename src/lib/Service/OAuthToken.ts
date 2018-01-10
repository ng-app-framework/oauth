import {Inject, Injectable} from "@angular/core";
import {OAuthEvents} from "./OAuthEvents";
import {OAuthState} from "./OAuthState";
import {StringValue} from "@ng-app-framework/core";
import {OAuthConfig} from "./OAuthConfig";

@Injectable()
export class OAuthToken {

    state: OAuthState;
    events = new OAuthEvents();

    constructor(@Inject(OAuthConfig) public config: OAuthConfig) {
        this.state = new OAuthState();
        this.load();
    }

    public save(accessToken: string, refreshToken: string): void {
        this.state.accessToken  = accessToken;
        this.state.refreshToken = refreshToken;
        this.state.store();
        this.events.onSave.emit({accessToken, refreshToken});
    }

    public load() {
        this.state.load();
        if (StringValue.isPopulated(this.state.accessToken) && StringValue.isPopulated(this.state.refreshToken)) {
            this.events.onLoad.emit({accessToken: this.state.accessToken, refreshToken: this.state.refreshToken});
        }
    }

    public destroy() {
        this.state.clear();
        this.events.onDestroy.emit();
    }

    public getClientId() {
        return this.config.clientId;
    }
}
