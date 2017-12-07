import {OAuthEndpointCaller} from "../../src/app/Service/OAuthEndpointCaller";
import {Observable} from "rxjs/Rx";
import {OAuthEndpointCallerShunt} from "../Mock/OAuthEndpointCallerShunt";
import {UnsubscribeAll, Value} from "@ng-app-framework/core";

describe('OAuthEndpointCaller', () => {
    let endpoint: OAuthEndpointCallerShunt = null;
    let path                               = 'http://frontend.dev/test/endpoint';

    // Setup

    let getNewCaller = function () {
        return new OAuthEndpointCallerShunt();
    };
    describe('On New Instance', () => {
        it('should provide coverage of the constructor', () => {
            endpoint = getNewCaller();
        })
    });
    describe('After Instantiation', () => {
        beforeEach(() => {
            endpoint                = getNewCaller();
            endpoint.config.baseUri = 'http://www.local.dev/';
        });

        // Fixture Helpers

        let getErrorResponse   = function (message) {
            return {
                error_description: message
            };
        };
        let getSuccessResponse = function (message) {
            return {
                message: message
            };
        };
        let getMockResponse    = function (status, message) {
            let body = status === 200 ? getSuccessResponse(message) : getErrorResponse(message);
            return {
                ok    : status === 200,
                status: status,
                [status === 200 ? 'body' : 'error']  : body
            };
        };

        // Assertions

        let assertCallErred                        = function (done) {
            endpoint.call(path, 'get').subscribe({
                complete: () => {
                    expect('Did Not Error').toEqual('Erred');
                    done();
                },
                error   : () => {
                    done();
                }
            });
        };
        let assertLogoutCalled                     = function (done) {
            let triggered = false;
            endpoint.oauth.events.onFailure.takeUntil(UnsubscribeAll).first().subscribe(() => {
                triggered = true;
                expect(triggered).toBeTruthy('Logout should have been called');
                done();
            });
            endpoint.call(path, 'get').subscribe();
        };
        let assertRefreshGetsCalledAndIsSuccessful = function (done) {
            let triggered              = false;
            endpoint.refresher.refresh = () => {
                triggered             = true;
                endpoint.mockResponse = getMockResponse(200, 'success!');
                return Observable.from([
                    'success'
                ]);
            };
            let nextTriggered          = false;
            endpoint.call(path, 'get').finally(() => {
                expect(triggered).toBeTruthy('Refresh was not triggered');
                expect(nextTriggered).toBeTruthy('Next was not triggered');
                done();
            }).subscribe({
                next: (response) => {
                    expect(Value.isProvided(response['message'])).toBeTruthy('message did not exist on response');
                    expect(response['message']).toEqual('success!');
                    nextTriggered = true;
                }
            });
        };

        // Test Cases

        let assertDataAppended = function (method, done) {
            endpoint.oauth.state.accessToken = 'It Works!';

            let data = {
                exists: true
            };
            endpoint.call(path, method, data).finally(() => done()).subscribe({
                next: () => {
                    if (method === 'get') {
                        expect(endpoint.lastRequest.url.indexOf('exists=') > -1).toBeTruthy('Exists was not appended to the request');
                    } else {
                        expect(endpoint.lastRequest.url.indexOf('exists=') === -1).toBeTruthy('Exists was appended to the request');
                    }
                    expect(endpoint.lastRequest.url.indexOf('access_token=') > -1).toBeTruthy('Access token was not appended to the request');
                }
            });
        };
        describe('Appending data', () => {

            describe('GET', () => {

                it('should add an access_token field', (done) => {
                    endpoint.mockResponse = getMockResponse(200, 'yay');
                    assertDataAppended('get', done);
                });
            });
            describe('POST', () => {
                it('should add an access_token field', (done) => {
                    endpoint.mockResponse = getMockResponse(200, 'yay');
                    assertDataAppended('post', done);
                });
            })
        });
        describe('Error Handling', () => {
            it('should logout when a 401 is reached that isn\'t caused by an expired access token', (done) => {
                endpoint.mockResponse = getMockResponse(401, 'The access token provided is invalid.');
                assertLogoutCalled(done);
            });
            it('should logout when the refresh endpoint errors', (done) => {
                endpoint.mockResponse      = getMockResponse(401, OAuthEndpointCaller.EXPIRED_TOKEN);
                endpoint.refresher.refresh = () => {
                    return Observable.throw('Erred!');
                };
                assertLogoutCalled(done);
            });
            it('should error when anything other than 401 or 200 is detected', (done) => {

                endpoint.mockResponse = getMockResponse(406, 'Request was invalid');

                assertCallErred(done);
            });
            it('should refresh the access token if a 401 for expired access token is encountered', (done) => {
                endpoint.mockResponse = getMockResponse(401, OAuthEndpointCaller.EXPIRED_TOKEN);
                assertRefreshGetsCalledAndIsSuccessful(done);
            });
        });
    });
});
