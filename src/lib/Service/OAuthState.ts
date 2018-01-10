import {Storage} from "@ng-app-framework/storage";

export class OAuthState extends Storage {

    public accessToken: string  = '';
    public refreshToken: string = '';


    constructor() {
        super('oauth');
    }

    clear() {
        super.clear();
        this.accessToken  = '';
        this.refreshToken = '';
    }
}
