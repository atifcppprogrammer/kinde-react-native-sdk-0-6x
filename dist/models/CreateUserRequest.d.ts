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
import type { CreateUserRequestIdentitiesInner } from './CreateUserRequestIdentitiesInner';
import type { CreateUserRequestProfile } from './CreateUserRequestProfile';
/**
 *
 * @export
 * @interface CreateUserRequest
 */
export interface CreateUserRequest {
    /**
     *
     * @type {CreateUserRequestProfile}
     * @memberof CreateUserRequest
     */
    profile?: CreateUserRequestProfile;
    /**
     *
     * @type {Array<CreateUserRequestIdentitiesInner>}
     * @memberof CreateUserRequest
     */
    identities?: Array<CreateUserRequestIdentitiesInner>;
}
/**
 * Check if a given object implements the CreateUserRequest interface.
 */
export declare function instanceOfCreateUserRequest(value: object): boolean;
export declare function CreateUserRequestFromJSON(json: any): CreateUserRequest;
export declare function CreateUserRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateUserRequest;
export declare function CreateUserRequestToJSON(value?: CreateUserRequest | null): any;
