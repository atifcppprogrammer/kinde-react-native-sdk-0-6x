/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1.1.2
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import jwt_decode from 'jwt-decode';
import Url from 'url-parse';
import { UnAuthenticatedException } from '../common/exceptions/unauthenticated.exception';
import { UnexpectedException } from '../common/exceptions/unexpected.exception';
import {
    AdditionalParameters,
    OrgAdditionalParams,
    TokenResponse
} from '../types/KindeSDK';
import { TokenType } from './Enums';
import AuthorizationCode from './OAuth/AuthorizationCode';
import Storage from './Storage';
import {
    checkAdditionalParameters,
    checkNotNull,
    openWebBrowser
} from './Utils';
import { AuthBrowserOptions } from '../types/Auth';

/**
 * The KindeSDK module.
 * @module SDK/KindeSDK
 * @version 1.1.2
 */

class KindeSDK {
    public issuer: string;
    public redirectUri: string;
    public clientId: string;
    public logoutRedirectUri: string;
    public scope: string;
    public clientSecret?: string;
    public additionalParameters: AdditionalParameters;
    public authBrowserOptions?: AuthBrowserOptions;

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
     * @param {AuthBrowserOptions} [authBrowserOptions] - Authentication browser options.
     */
    constructor(
        issuer: string,
        redirectUri: string,
        clientId: string,
        logoutRedirectUri: string,
        scope: string = 'openid profile email offline',
        additionalParameters: Pick<AdditionalParameters, 'audience'> = {},
        authBrowserOptions?: AuthBrowserOptions
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

        this.authBrowserOptions = authBrowserOptions;
    }

    /**
     * The function takes an object as an argument, and if the object is empty, it will use the default
     * object
     * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
     * @param {AuthBrowserOptions} [authBrowserOptions] - Authentication browser options.
     * @returns A promise that resolves to void.
     */
    async login(
        additionalParameters: Omit<OrgAdditionalParams, 'is_create_org'> = {},
        authBrowserOptions?: AuthBrowserOptions
    ): Promise<TokenResponse | null> {
        checkAdditionalParameters(additionalParameters);
        await this.cleanUp();
        const auth = new AuthorizationCode();

        const additionalParametersMerged = {
            ...this.additionalParameters,
            ...additionalParameters
        };
        return auth.authenticate(
            this,
            true,
            'login',
            additionalParametersMerged,
            authBrowserOptions
        );
    }

    /**
     * This function registers an organization with additional parameters and authenticates it using an
     * authorization code.
     * @param {OrgAdditionalParams} additionalParameters - `additionalParameters` is an optional object
     * parameter that can be passed to the `register` function. It is used to provide additional
     * parameters that may be required for the registration process. These parameters can vary
     * depending on the specific implementation of the registration process.
     * @param {AuthBrowserOptions} [authBrowserOptions] - Authentication browser options.
     * @returns A Promise that resolves to void.
     */
    register(
        additionalParameters: OrgAdditionalParams = {},
        authBrowserOptions?: AuthBrowserOptions
    ): Promise<TokenResponse | null> {
        checkAdditionalParameters(additionalParameters);
        const auth = new AuthorizationCode();
        return auth.authenticate(
            this,
            true,
            'registration',
            additionalParameters,
            authBrowserOptions
        );
    }

    /**
     * This function creates an organization with additional parameters.
     * @param additionalParameters
     * @param {AuthBrowserOptions} [authBrowserOptions] - Authentication browser options.
     * @returns A promise that resolves to void.
     */
    createOrg(
        additionalParameters: Omit<OrgAdditionalParams, 'is_create_org'> = {},
        authBrowserOptions?: AuthBrowserOptions
    ) {
        return this.register(
            { is_create_org: true, ...additionalParameters },
            authBrowserOptions
        );
    }

    /**
     * It cleans up the local storage, and then opens a URL that will log the user out of the identity
     * provider
     * @param {AuthBrowserOptions} [authBrowserOptions] - Authentication browser options.
     */
    async logout(authBrowserOptions?: AuthBrowserOptions) {
        await this.cleanUp();
        const URLParsed = Url(this.logoutEndpoint, true);
        URLParsed.query['redirect'] = this.logoutRedirectUri;
        const response = await openWebBrowser(
            URLParsed.toString(),
            this.redirectUri,
            authBrowserOptions || this.authBrowserOptions
        );
        return response.type === 'success';
    }

    /**
     * This function retrieves a token from a given URL using authorization code grant type and checks
     * for validity before doing so.
     * @param {string} [url] - The URL to fetch the token from. It is an optional parameter with a
     * default value of an empty string.
     * @returns The function `getToken` is returning a Promise that resolves to a `TokenResponse`
     * object.
     */
    async getToken(url?: string): Promise<TokenResponse> {
        // Checking for case token still valid or not
        try {
            if (await this.isAuthenticated) {
                const token = await Storage.getToken();
                return token!;
            }
        } catch (_) {}

        checkNotNull(url, 'URL');

        const URLParsed = Url(String(url), true);
        const { code, error, error_description } = URLParsed.query;
        if (error) {
            const msg = error_description ?? error;
            throw new UnAuthenticatedException(msg);
        }
        checkNotNull(code, 'code');

        const formData = new FormData();
        formData.append('code', code);
        formData.append('client_id', this.clientId);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', this.redirectUri);

        const state = Storage.getState();
        if (state) {
            formData.append('state', state);
        }
        const codeVerifier = Storage.getCodeVerifier();
        if (codeVerifier) {
            formData.append('code_verifier', codeVerifier);
        }

        return this.fetchToken(formData);
    }

    /**
     * This function refreshes an access token using a refresh token.
     * @param {TokenResponse} [token] - The `token` parameter is an optional parameter of type
     * `TokenResponse`. It represents the token that needs to be refreshed. If this parameter is not
     * provided, the function will try to retrieve the token from the storage using the
     * `Storage.getToken()` method.
     * @returns The `useRefreshToken` function is returning the result of calling the `fetchToken`
     * function with a `FormData` object containing the necessary parameters for refreshing an access
     * token.
     */
    async useRefreshToken(token: TokenResponse | null = null) {
        const newToken = token || (await Storage.getToken());
        if (!newToken) {
            throw new UnAuthenticatedException();
        }

        const formData = new FormData();
        formData.append('client_id', this.clientId);
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', newToken?.refresh_token);
        return this.fetchToken(formData);
    }

    /**
     * This function fetches a token from a server using a POST request with form data and stores it in
     * local storage.
     * @param {FormData} formData - FormData object containing the data to be sent in the request body.
     * This can include files, text, or a combination of both.
     * @returns A Promise that resolves to a TokenResponse object.
     */
    fetchToken(formData: FormData): Promise<TokenResponse> {
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

            await Storage.setToken(dataResponse);
            resolve(dataResponse);
        });
    }

    /**
     * It clears the session storage and sets the authentication status to unauthenticated
     * @returns The Storage.clear() method is being returned.
     */
    async cleanUp() {
        return Storage.clearAll();
    }

    /**
     * It returns the user profile from session storage
     * @returns The user profile object.
     */
    async getUserDetails() {
        return Storage.getUserProfile();
    }

    /**
     * It returns the claims of the token stored in Storage
     * @param {TokenType} [tokenType=accessToken] - The type of token to get the claims from.
     * @returns The claims of the token.
     */
    async getClaims(
        tokenType: TokenType = TokenType.ACCESS_TOKEN
    ): Promise<Record<string, any>> {
        if (![TokenType.ACCESS_TOKEN, TokenType.ID_TOKEN].includes(tokenType)) {
            throw new UnexpectedException('tokenType');
        }

        const token = await Storage.getTokenType(tokenType);
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
    async getClaim(
        keyName: string,
        tokenType: TokenType = TokenType.ACCESS_TOKEN
    ) {
        const claims = await this.getClaims(tokenType);
        return claims[keyName];
    }

    /**
     * It returns an object with the orgCode and permissions properties
     * @returns The orgCode and permissions of the user.
     */
    async getPermissions() {
        const claims = await this.getClaims();
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
    async getPermission(permission: string) {
        const allClaims = await this.getClaims();
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
    async getOrganization() {
        const orgCode = await this.getClaim('org_code');
        return {
            orgCode
        };
    }

    /**
     * It returns an object with a property called orgCodes that contains the value of the org_codes
     * claim from the id_token
     * @returns The orgCodes claim from the id_token.
     */
    async getUserOrganizations() {
        const orgCodes = await this.getClaim('org_codes', TokenType.ID_TOKEN);
        return {
            orgCodes
        };
    }

    /**
     * This is a TypeScript function that checks if a user is authenticated by checking if their token
     * has expired or if a refresh token can be used to obtain a new token.
     * @returns A promise is being returned, which resolves to a boolean value indicating whether the
     * user is authenticated or not. The function uses asynchronous operations to check if the user's
     * authentication token is still valid, and if not, it tries to use a refresh token to obtain a new
     * token.
     */
    get isAuthenticated() {
        return (async () => {
            const timeExpired = await Storage.getExpiredAt();
            const now = new Date().getTime();

            const isAuthenticated = timeExpired * 1000 > now;
            if (isAuthenticated) {
                return true;
            }

            try {
                const token = await this.useRefreshToken();
                return (token?.expires_in || 0) > 0;
            } catch (_) {
                return false;
            }
        })();
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
