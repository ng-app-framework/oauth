import {OAuthConfig} from "../../src/lib";
import {RefreshTokenEndpoint} from "../../src/lib/Endpoint/RefreshTokenEndpoint";
import {EndpointCallerMock} from "@ng-app-framework/api";

describe('Refresh Token Endpoint', () => {
    describe('After Instantiation', () => {
        let endpoint: RefreshTokenEndpoint;
        let endpointCallerMock = new EndpointCallerMock();
        beforeEach(() => {
            endpoint = new RefreshTokenEndpoint(<any>endpointCallerMock, new OAuthConfig());
        });

        describe('Refresh', () => {
            it('should error if the request did not contain an refresh token', (done) => {
                endpointCallerMock.mockResponse = {
                    data: {
                        access_token : 'word',
                        refresh_token: 'word'
                    }
                };
                endpoint.refresh('').subscribe({
                    error   : (err) => {
                        done();
                    },
                    complete: () => {
                        throw "Should have erred!";
                    }
                });
            });
            it('should error if the response does not contain access and refresh tokens', (done) => {
                endpointCallerMock.mockResponse = {
                    data: {}
                };
                endpoint.refresh('word').subscribe({
                    error   : (err) => {
                        done();
                    },
                    complete: () => {
                        throw "Should have erred!";
                    }
                });
            });
            it('should be successful if the input and output were validated properly', (done) => {
                endpointCallerMock.mockResponse = {
                    data: {
                        access_token : 'word',
                        refresh_token: 'word'
                    }
                };
                endpoint.refresh('word').subscribe({
                    error   : (err) => {
                        throw "Should not have erred!";
                    },
                    complete: () => {
                        done();
                    }
                });
            });
        });
    });
});
