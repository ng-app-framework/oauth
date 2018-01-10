import {OAuthState} from "../../src/lib/Service/OAuthState";

describe('OAuthState', () => {

    it('should clear values when executing clear', () => {
        let state = new OAuthState();

        state.accessToken  = 'populated';
        state.refreshToken = 'populated';
        expect(state.accessToken.length > 0).toBeTruthy();
        expect(state.refreshToken.length > 0).toBeTruthy();
        state.clear();

        expect(state.accessToken.length > 0).toBeFalsy();
        expect(state.refreshToken.length > 0).toBeFalsy();
    })
});
