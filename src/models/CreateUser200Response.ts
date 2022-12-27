/* tslint:disable */
/* eslint-disable */
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

import { exists } from '../ApiClient';
import type { UserIdentity } from './UserIdentity';
import { UserIdentityFromJSON, UserIdentityToJSON } from './UserIdentity';

/**
 *
 * @export
 * @interface CreateUser200Response
 */
export interface CreateUser200Response {
    /**
     *
     * @type {string}
     * @memberof CreateUser200Response
     */
    id?: string;
    /**
     *
     * @type {boolean}
     * @memberof CreateUser200Response
     */
    created?: boolean;
    /**
     *
     * @type {Array<UserIdentity>}
     * @memberof CreateUser200Response
     */
    identities?: Array<UserIdentity>;
}

/**
 * Check if a given object implements the CreateUser200Response interface.
 */
export function instanceOfCreateUser200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function CreateUser200ResponseFromJSON(
    json: any
): CreateUser200Response {
    return CreateUser200ResponseFromJSONTyped(json, false);
}

export function CreateUser200ResponseFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean
): CreateUser200Response {
    if (json === undefined || json === null) {
        return json;
    }
    return {
        id: !exists(json, 'id') ? undefined : json['id'],
        created: !exists(json, 'created') ? undefined : json['created'],
        identities: !exists(json, 'identities')
            ? undefined
            : (json['identities'] as Array<any>).map(UserIdentityFromJSON)
    };
}

export function CreateUser200ResponseToJSON(
    value?: CreateUser200Response | null
): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        id: value.id,
        created: value.created,
        identities:
            value.identities === undefined
                ? undefined
                : (value.identities as Array<any>).map(UserIdentityToJSON)
    };
}
