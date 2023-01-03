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
/// <reference types="react-native" />
import * as runtime from '../ApiClient';
import type { UserProfile, UserProfileV2 } from '../models';
/**
 *
 */
export declare class OAuthApi extends runtime.BaseAPI {
    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    getUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserProfile>>;
    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    getUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserProfile>;
    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    getUserProfileV2Raw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserProfileV2>>;
    /**
     * Contains the id, names and email of the currently logged in user
     * Returns the details of the currently logged in user
     */
    getUserProfileV2(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserProfileV2>;
}
