import { AdditionalParameters } from '../types/KindeSDK';
/**
 * It generates a random string of a given length, and returns it
 * @param {number} [byteLength=32] - The number of bytes to generate. Defaults to 32.
 * @returns A random string of 32 bytes.
 */
export declare function generateRandomString(byteLength?: number): string;
/**
 * It generates a random string, hashes it, and then base64 encodes it
 * @returns An object with three properties: state, codeVerifier, and codeChallenge.
 */
export declare function generateChallenge(): {
    state: string;
    codeVerifier: string;
    codeChallenge: string;
};
/**
 * If the reference is null or undefined, throw an error, otherwise return the reference.
 * @param {T | undefined | null} reference - The value to check.
 * @param {string} name - The name of the parameter that is being checked.
 * @returns A function that takes two parameters and returns either the first parameter or an Error.
 */
export declare function checkNotNull<T>(reference: T | undefined | null, name: string): T | Error;
/**
 * It checks if the additionalParameters object is valid
 * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
 * @returns An object with the keys and values of the additionalParameters object.
 */
export declare const checkAdditionalParameters: (additionalParameters?: AdditionalParameters) => AdditionalParameters;
/**
 * It takes a target object and an additionalParameters object and adds the additionalParameters
 * object's key/value pairs to the target object
 * @param target - Record<string, string | undefined>
 * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
 * @returns A function that takes two parameters, target and additionalParameters.
 */
export declare const addAdditionalParameters: (target: Record<string, string | undefined>, additionalParameters?: AdditionalParameters) => Record<string, string | undefined>;
