import {OAuthRefresher} from "../../src/lib/Service/OAuthRefresher";
import {RefreshTokenEndpointMock} from "../Mock/RefreshTokenEndpointMock";
import {Observable} from "rxjs/Rx";
import {UnsubscribeAll} from "@ng-app-framework/core";
import {OAuthEvents} from "../../src/lib/Service/OAuthEvents";

describe('OAuthRefresher', () => {

    let mockOAuth: any      = {
        events: new OAuthEvents(),
        state : {
            accessToken : '',
            refreshToken: ''
        },
        save  : () => {
        }
    };
    let mockRefreshEndpoint = new RefreshTokenEndpointMock();
    let refresher: OAuthRefresher;
    let expectFailure       = function (message, done) {
        refresher.oauth.events.onFailure.takeUntil(UnsubscribeAll).first().subscribe((actualMessage) => {
            expect(actualMessage).toEqual(message);
            done();
        });
    };
    beforeEach(() => {
        refresher = new OAuthRefresher(mockOAuth, <any>mockRefreshEndpoint);
    });

    describe('Refresh While Already Refreshing', () => {
        it('should return the existing observable instead of creating a new one', (done) => {
            refresher.isRefreshing   = true;
            refresher.currentRefresh = Observable.from(['IS EXISTING OBSERVABLE']);
            setRefreshToken();
            refresher.refresh().subscribe(value => {
                expect(value).toEqual('IS EXISTING OBSERVABLE');
                done();
            })

        });
    });

    let setRefreshToken = function () {
        mockOAuth.state.refreshToken = 'test-123';
    };
    describe('On Successful Refresh', () => {
        it('should provide an access token to use for chained requests', (done) => {
            mockRefreshEndpoint.setExpectation('success');
            setRefreshToken();
            refresher.refresh().finally(() => done()).subscribe({
                next : (accessToken) => {
                    expect(accessToken).toEqual('worked');
                },
                error: (error) => {
                    throw "This should not have failed";
                }
            })
        });
    });
    describe('On Failed Refresh', () => {
        it('should emit an event to logout when it fails', (done) => {
            mockRefreshEndpoint.setExpectation('failure');
            setRefreshToken();
            expectFailure(OAuthRefresher.EXPIRED_SESSION_MESSAGE, done);
            refresher.refresh().subscribe(() => {
                throw "This should have failed";
            });
        });
        it('should return a not logged in message when refreshing without a refresh token', (done) => {
            mockRefreshEndpoint.setExpectation('failure');
            mockOAuth.state.refreshToken = '';
            expectFailure(OAuthRefresher.NOT_LOGGED_IN_MESSAGE, done);
            refresher.refresh().subscribe(() => {
                throw "This should have failed";
            });
        });
    });
});
