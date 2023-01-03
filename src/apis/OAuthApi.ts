/**
 * Kinde Management API
 * Provides endpoints to manage your Kinde Businesses
 *
 * The version of the OpenAPI document: 1.1.0
 * Contact: support@kinde.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import * as runtime from '../ApiClient';
import type { UserProfile, UserProfileV2 } from '../models';
import {
    UserProfileFromJSON,
    UserProfileToJSON,
    UserProfileV2FromJSON,
    UserProfileV2ToJSON
} from '../models';

/**
 *
 */
export class OAuthApi extends runtime.BaseAPI {
    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    async getUserRaw(
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<UserProfile>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token('kindeBearerAuth', []);

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request(
            {
                path: `/oauth2/user_profile`,
                method: 'GET',
                headers: headerParameters,
                query: queryParameters
            },
            initOverrides
        );

        return new runtime.JSONApiResponse(response, (jsonValue) =>
            UserProfileFromJSON(jsonValue)
        );
    }

    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    async getUser(
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<UserProfile> {
        const response = await this.getUserRaw(initOverrides);
        return await response.value();
    }

    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    async getUserProfileV2Raw(
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<runtime.ApiResponse<UserProfileV2>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token('kindeBearerAuth', []);

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request(
            {
                path: `/oauth2/v2/user_profile`,
                method: 'GET',
                headers: headerParameters,
                query: queryParameters
            },
            initOverrides
        );

        return new runtime.JSONApiResponse(response, (jsonValue) =>
            UserProfileV2FromJSON(jsonValue)
        );
    }

    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    async getUserProfileV2(
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<UserProfileV2> {
        const response = await this.getUserProfileV2Raw(initOverrides);
        return await response.value();
    }
}
