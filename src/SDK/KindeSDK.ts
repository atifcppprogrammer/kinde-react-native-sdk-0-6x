import jwt_decode from 'jwt-decode';
import { Linking } from 'react-native';
import Url from 'url-parse';
import { UnAuthenticatedException } from '../common/exceptions/unauthenticated.exception';
import { UnexpectedException } from '../common/exceptions/unexpected.exception';
import { AdditionalParameters, TokenID, TokenType } from '../types/KindeSDK';
import { AuthStatus } from './Enums/AuthStatus.enum';
import AuthorizationCode from './OAuth/AuthorizationCode';
import { sessionStorage } from './Storage';
import { checkAdditionalParameters, checkNotNull } from './Utils';

class KindeSDK {
    public issuer: string;
    public redirectUri: string;
    public clientId: string;
    public logoutRedirectUri: string;
    public scope: string;
    public clientSecret?: string;
    public additionalParameters: AdditionalParameters;
    public authStatus: AuthStatus;

    /**
     * The constructor function takes in a bunch of parameters and sets them to the class properties
     * @param {string} issuer - The URL of the OIDC provider.
     * @param {string} redirectUri - The URI that the OIDC provider will redirect to after the user has
     * logged in.
     * @param {string} clientId - The client ID of your application.
     * @param {string} logoutRedirectUri - The URL to redirect to after logout.
     * @param {string} [scope=openid profile email offline] - The scope of the authentication. This is
     * a space-separated list of scopes.
     * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
     */
    constructor(
        issuer: string,
        redirectUri: string,
        clientId: string,
        logoutRedirectUri: string,
        scope: string = 'openid profile email offline',
        additionalParameters: AdditionalParameters = {}
    ) {
        this.issuer = issuer;
        checkNotNull(this.issuer, 'Issuer');

        this.redirectUri = redirectUri;
        checkNotNull(this.redirectUri, 'Redirect URI');

        this.clientId = clientId;
        checkNotNull(this.clientId, 'Client Id');

        this.logoutRedirectUri = logoutRedirectUri;
        checkNotNull(this.logoutRedirectUri, 'Logout Redirect URI');

        this.additionalParameters =
            checkAdditionalParameters(additionalParameters);

        this.scope = scope;

        this.clientSecret = '';
        this.authStatus = AuthStatus.UNAUTHENTICATED;
    }

    /**
     * The function takes an object as an argument, and if the object is empty, it will use the default
     * object
     * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
     * @returns A promise that resolves to void.
     */
    login(additionalParameters: AdditionalParameters = {}): Promise<void> {
        checkAdditionalParameters(additionalParameters);
        this.cleanUp();
        const auth = new AuthorizationCode();
        this.updateAuthStatus(AuthStatus.AUTHENTICATING);

        const additionalParametersMerged = {
            ...this.additionalParameters,
            ...additionalParameters
        };
        return auth.login(this, true, 'login', additionalParametersMerged);
    }

    /**
     * It takes a URL as a parameter, parses it, and then sends a POST request to the token endpoint
     * with the code, client id, client secret, grant type, redirect URI, state, and code verifier
     * @param {string} url - The URL that the user is redirected to after they have logged in.
     * @returns A promise that resolves to the response from the token endpoint.
     */
    getToken(url: string): Promise<void> {
        if (this.checkIsUnAuthenticated()) {
            throw new UnAuthenticatedException();
        }
        checkNotNull(url, 'URL');

        const URLParsed = Url(url, true);
        const { code, error, error_description } = URLParsed.query;
        if (error) {
            const msg = error_description ?? error;
            throw new UnAuthenticatedException(msg);
        }
        checkNotNull(code, 'code');

        const formData = new FormData();
        formData.append('code', code);
        formData.append('client_id', this.clientId);
        formData.append('client_secret', this.clientSecret);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', this.redirectUri);

        const state = sessionStorage.getState();
        if (state) {
            formData.append('state', state);
        }
        const codeVerifier = sessionStorage.getCodeVerifier();
        if (codeVerifier) {
            formData.append('code_verifier', codeVerifier);
        }

        return new Promise(async (resolve, reject) => {
            const response = await fetch(this.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            });

            const dataResponse = await response.json();
            if (dataResponse.error) {
                reject(dataResponse);
                return;
            }

            this.saveUserDetails(dataResponse.id_token);
            sessionStorage.setAccessToken(dataResponse.access_token);
            sessionStorage.setIdToken(dataResponse.id_token);

            const now = new Date().getTime();
            const expiredAt = now + dataResponse.expires_in * 1000;
            sessionStorage.setExpiredAt(expiredAt);

            this.updateAuthStatus(AuthStatus.AUTHENTICATED);
            resolve(dataResponse);
        });
    }

    /**
     * The function calls the login function of the AuthorizationCode class, passing in the current
     * instance of the class, a boolean value of true, and the string 'registration'
     * @returns A promise that resolves to void.
     */
    register(additionalParameters = {}): Promise<void> {
        checkAdditionalParameters(additionalParameters);
        const auth = new AuthorizationCode();
        this.updateAuthStatus(AuthStatus.AUTHENTICATING);
        return auth.login(this, true, 'registration', additionalParameters);
    }

    createOrg(additionalParameters = {}) {
        return this.register({ is_create_org: true, additionalParameters });
    }

    /**
     * It cleans up the local storage, and then opens a URL that will log the user out of the identity
     * provider
     */
    logout() {
        this.cleanUp();
        const URLParsed = Url(this.logoutEndpoint, true);
        URLParsed.query['redirect'] = this.logoutRedirectUri;
        return Linking.openURL(URLParsed.toString());
    }

    /**
     * It clears the session storage and sets the authentication status to unauthenticated
     * @returns The sessionStorage.clear() method is being returned.
     */
    cleanUp(): void {
        this.updateAuthStatus(AuthStatus.UNAUTHENTICATED);
        return sessionStorage.clear();
    }

    /**
     * It updates the authStatus variable and then saves the new value to the sessionStorage
     * @param {AuthStatus} _authStatus - The new auth status to set.
     */
    updateAuthStatus(_authStatus: AuthStatus): void {
        this.authStatus = _authStatus;
        sessionStorage.setAuthStatus(this.authStatus);
    }

    /**
     * If the authStatus is UNAUTHENTICATED, then return true
     * @returns A boolean value.
     */
    checkIsUnAuthenticated() {
        const authStatusStorage = sessionStorage.getAuthStatus();
        if (
            (!this.authStatus ||
                this.authStatus === AuthStatus.UNAUTHENTICATED) &&
            (!authStatusStorage ||
                authStatusStorage === AuthStatus.UNAUTHENTICATED)
        ) {
            return true;
        }
        return false;
    }

    /**
     * It returns the user profile from session storage
     * @returns The user profile object.
     */
    getUserDetails() {
        return sessionStorage.getUserProfile();
    }

    /**
     * If the idToken is not a string or is empty, remove the userProfile from sessionStorage.
     * Otherwise, decode the idToken and save the userProfile to sessionStorage
     * @param {string} idToken - The idToken is a JWT token that contains information about the user.
     * @returns The user profile is being returned.
     */
    saveUserDetails(idToken: string) {
        if (!idToken || typeof idToken !== 'string') {
            sessionStorage.removeItem('userProfile');
            return;
        }

        const token = jwt_decode(idToken) as TokenID;
        sessionStorage.setUserProfile({
            id: token.sub,
            given_name: token.given_name,
            family_name: token.family_name,
            email: token.email
        });
    }

    /**
     * It returns the claims of the token stored in sessionStorage
     * @param {TokenType} [tokenType=accessToken] - The type of token to get the claims from.
     * @returns The claims of the token.
     */
    getClaims(tokenType: TokenType = 'accessToken'): Record<string, any> {
        if (!['accessToken', 'id_token'].includes(tokenType)) {
            throw new UnexpectedException('tokenType');
        }

        const token = sessionStorage.getItem(tokenType);
        if (!token) {
            throw new UnAuthenticatedException();
        }

        return jwt_decode(token);
    }

    /**
     * It returns the value of the claim with the given key name from the claims object of the given
     * token type
     * @param {string} keyName - The name of the claim you want to get.
     * @param {TokenType} [tokenType=accessToken] - This is the type of token you want to get the
     * claims from. It can be either 'accessToken' or 'idToken'.
     * @returns The value of the claim with the given key name.
     */
    getClaim(keyName: string, tokenType: TokenType = 'accessToken') {
        return this.getClaims(tokenType)[keyName];
    }

    /**
     * It returns an object with the orgCode and permissions properties
     * @returns The orgCode and permissions of the user.
     */
    getPermissions() {
        const claims = this.getClaims();
        return {
            orgCode: claims['org_code'],
            permissions: claims['permissions']
        };
    }

    /**
     * It returns an object with the orgCode and a boolean value indicating whether the user has the
     * permission
     * @param {string} permission - The permission you want to check for.
     * @returns An object with two properties: orgCode and isGranted.
     */
    getPermission(permission: string) {
        const allClaims = this.getClaims();
        const permissions = allClaims['permissions'];
        return {
            orgCode: allClaims['org_code'],
            isGranted: permissions?.includes(permission)
        };
    }

    /**
     * It returns an object with a single property, `orgCode`, which is set to the value of the
     * `org_code` claim in the JWT
     * @returns An object with the orgCode property set to the value of the org_code claim.
     */
    getOrganization() {
        return {
            orgCode: this.getClaim('org_code')
        };
    }

    /**
     * It returns an object with a property called orgCodes that contains the value of the org_codes
     * claim from the id_token
     * @returns The orgCodes claim from the id_token.
     */
    getUserOrganizations() {
        return {
            orgCodes: this.getClaim('org_codes', 'id_token')
        };
    }

    /**
     * If the user is unauthenticated, return false. Otherwise, return true if the current time is less
     * than the time the user's session expires
     * @returns A boolean value.
     */
    get isAuthenticated() {
        if (this.checkIsUnAuthenticated()) {
            return false;
        }

        const timeExpired = sessionStorage.getExpiredAt();
        const now = new Date().getTime();
        return timeExpired > now;
    }

    get authorizationEndpoint(): string {
        return `${this.issuer}/oauth2/auth`;
    }

    get tokenEndpoint(): string {
        return `${this.issuer}/oauth2/token`;
    }

    get logoutEndpoint(): string {
        return `${this.issuer}/logout`;
    }
}

export default KindeSDK;
