import {Observable} from "rxjs/Rx";

export class RefreshTokenEndpointMock {
    expectation:any = null;
    failure:any = {
        ok  : 401,
        json: () => {
            return {
                message: 'this does not matter'
            }
        }
    };
    success:any = {
        ok  : 200,
        json: () => {
            return {
                access_token : 'worked',
                refresh_token: 'worked'
            }
        }
    };

    constructor() {

    }

    setExpectation(type:string) {
        this.expectation = this[type];
    }

    refresh(refreshToken:string) {
        return Observable.create(observer => {
            if (this.failure === this.expectation) {
                observer.error(this.expectation);
                observer.complete();
                return;
            }
            observer.next(this.expectation);
            observer.complete();
        })
    }
}
