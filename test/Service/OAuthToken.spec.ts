import {OAuthToken} from "../../src/app/Service/OAuthToken";
import {StringValue, Value} from "@ng-app-framework/core";
import {OAuthConfig} from "../../src/app/Service/OAuthConfig";

describe('OAuthToken', () => {

    let oauth: OAuthToken = null;
    describe('After Instantiation', () => {
        beforeEach(() => {
            oauth = new OAuthToken(new OAuthConfig());
        });

        it('should contain an access token and a refresh token', () => {
            expect(Value.isProvided(oauth.state.accessToken)).toBeTruthy('Access Token did not exist on OAuthToken');
            expect(Value.isProvided(oauth.state.refreshToken)).toBeTruthy('Refresh Token did not exist on OAuthToken');
        });

        describe('Save', () => {

            it('should put values in the state, call store, and emit an event', (done) => {
                oauth.state.accessToken  = '';
                oauth.state.refreshToken = '';
                let calledStore          = false;
                oauth.state.store        = () => {
                    expect(oauth.state.accessToken).not.toEqual('');
                    expect(oauth.state.refreshToken).not.toEqual('');
                    calledStore = true;
                };
                oauth.events.onSave.first().subscribe(() => {
                    expect(calledStore).toBeTruthy();
                    done();
                });
                oauth.save('bob', 'dave');
            });
        });

        describe('Load', () => {
            it('should call load and emit an event if there are values loaded', (done) => {
                let calledLoad   = false;
                oauth.state.load = () => {
                    calledLoad               = true;
                    oauth.state.accessToken  = 'bob';
                    oauth.state.refreshToken = 'dave';
                };
                oauth.events.onLoad.first().subscribe((value) => {
                    expect(calledLoad).toBeTruthy('calledLoad');
                    expect(StringValue.isPopulated(value.accessToken)).toBeTruthy('accessToken');
                    expect(StringValue.isPopulated(value.refreshToken)).toBeTruthy('refreshToken');
                    done();
                });
                oauth.load();
            });
        });

        describe('Destroy', () => {
            it('should clear the cache and emit an onDestroy event', (done) => {
                let calledClear   = false;
                oauth.state.clear = () => {
                    calledClear = true;
                };
                oauth.events.onDestroy.first().subscribe(() => {
                    expect(calledClear).toBeTruthy();
                    done();
                });
                oauth.destroy();
            });
        });
        describe('Get Client Id', () => {
            it('should return the value of the config\'s client ID', () => {
                oauth.config.clientId = 'weirdValueThatTheGetClientIdMethodShouldReturn';
                expect(oauth.getClientId()).toEqual(oauth.config.clientId);
            })
        });
    });
});
