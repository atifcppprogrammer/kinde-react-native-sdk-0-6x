import { AdditionalParameters, TokenType } from '../types/KindeSDK';
import { AuthStatus } from './Enums/AuthStatus.enum';
declare class KindeSDK {
    issuer: string;
    redirectUri: string;
    clientId: string;
    logoutRedirectUri: string;
    scope: string;
    clientSecret?: string;
    additionalParameters: AdditionalParameters;
    authStatus: AuthStatus;
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
    constructor(issuer: string, redirectUri: string, clientId: string, logoutRedirectUri: string, scope?: string, additionalParameters?: AdditionalParameters);
    /**
     * The function takes an object as an argument, and if the object is empty, it will use the default
     * object
     * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
     * @returns A promise that resolves to void.
     */
    login(additionalParameters?: AdditionalParameters): Promise<void>;
    /**
     * It takes a URL as a parameter, parses it, and then sends a POST request to the token endpoint
     * with the code, client id, client secret, grant type, redirect URI, state, and code verifier
     * @param {string} url - The URL that the user is redirected to after they have logged in.
     * @returns A promise that resolves to the response from the token endpoint.
     */
    getToken(url: string): Promise<void>;
    /**
     * The function calls the login function of the AuthorizationCode class, passing in the current
     * instance of the class, a boolean value of true, and the string 'registration'
     * @returns A promise that resolves to void.
     */
    register(additionalParameters?: {}): Promise<void>;
    createOrg(additionalParameters?: {}): Promise<void>;
    /**
     * It cleans up the local storage, and then opens a URL that will log the user out of the identity
     * provider
     */
    logout(): Promise<any>;
    /**
     * It clears the session storage and sets the authentication status to unauthenticated
     * @returns The sessionStorage.clear() method is being returned.
     */
    cleanUp(): void;
    /**
     * It updates the authStatus variable and then saves the new value to the sessionStorage
     * @param {AuthStatus} _authStatus - The new auth status to set.
     */
    updateAuthStatus(_authStatus: AuthStatus): void;
    /**
     * If the authStatus is UNAUTHENTICATED, then return true
     * @returns A boolean value.
     */
    checkIsUnAuthenticated(): boolean;
    /**
     * It returns the user profile from session storage
     * @returns The user profile object.
     */
    getUserDetails(): import("../types/KindeSDK").UserProfile | null;
    /**
     * If the idToken is not a string or is empty, remove the userProfile from sessionStorage.
     * Otherwise, decode the idToken and save the userProfile to sessionStorage
     * @param {string} idToken - The idToken is a JWT token that contains information about the user.
     * @returns The user profile is being returned.
     */
    saveUserDetails(idToken: string): void;
    /**
     * It returns the claims of the token stored in sessionStorage
     * @param {TokenType} [tokenType=accessToken] - The type of token to get the claims from.
     * @returns The claims of the token.
     */
    getClaims(tokenType?: TokenType): Record<string, any>;
    /**
     * It returns the value of the claim with the given key name from the claims object of the given
     * token type
     * @param {string} keyName - The name of the claim you want to get.
     * @param {TokenType} [tokenType=accessToken] - This is the type of token you want to get the
     * claims from. It can be either 'accessToken' or 'idToken'.
     * @returns The value of the claim with the given key name.
     */
    getClaim(keyName: string, tokenType?: TokenType): any;
    /**
     * It returns an object with the orgCode and permissions properties
     * @returns The orgCode and permissions of the user.
     */
    getPermissions(): {
        orgCode: any;
        permissions: any;
    };
    /**
     * It returns an object with the orgCode and a boolean value indicating whether the user has the
     * permission
     * @param {string} permission - The permission you want to check for.
     * @returns An object with two properties: orgCode and isGranted.
     */
    getPermission(permission: string): {
        orgCode: any;
        isGranted: any;
    };
    /**
     * It returns an object with a single property, `orgCode`, which is set to the value of the
     * `org_code` claim in the JWT
     * @returns An object with the orgCode property set to the value of the org_code claim.
     */
    getOrganization(): {
        orgCode: any;
    };
    /**
     * It returns an object with a property called orgCodes that contains the value of the org_codes
     * claim from the id_token
     * @returns The orgCodes claim from the id_token.
     */
    getUserOrganizations(): {
        orgCodes: any;
    };
    /**
     * If the user is unauthenticated, return false. Otherwise, return true if the current time is less
     * than the time the user's session expires
     * @returns A boolean value.
     */
    get isAuthenticated(): boolean;
    get authorizationEndpoint(): string;
    get tokenEndpoint(): string;
    get logoutEndpoint(): string;
}
export default KindeSDK;
