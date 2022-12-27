import crypto, { LibWordArray } from 'crypto-js';
import { InvalidTypeException } from '../common/exceptions/invalid-type.exception';
import { PropertyRequiredException } from '../common/exceptions/property-required.exception';
import { UnexpectedException } from '../common/exceptions/unexpected.exception';
import { AdditionalParameters } from '../types/KindeSDK';
import { AdditionalParametersAllow } from './constants';

/**
 * It takes a string or a LibWordArray and returns a string
 * @param {string | LibWordArray} str - The string to encode.
 * @returns A string
 */
function base64URLEncode(str: string | LibWordArray): string {
    return str
        .toString()
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * It takes a string or a LibWordArray and returns a string
 * @param {string | LibWordArray} buffer - The string or word array to hash.
 * @returns A string
 */
function sha256(buffer: string | LibWordArray): string {
    return crypto.SHA256(buffer).toString(crypto.enc.Base64);
}

/**
 * It generates a random string of a given length, and returns it
 * @param {number} [byteLength=32] - The number of bytes to generate. Defaults to 32.
 * @returns A random string of 32 bytes.
 */
export function generateRandomString(byteLength: number = 32): string {
    return base64URLEncode(crypto.lib.WordArray.random(byteLength));
}

/**
 * It generates a random string, hashes it, and then base64 encodes it
 * @returns An object with three properties: state, codeVerifier, and codeChallenge.
 */
export function generateChallenge(): {
    state: string;
    codeVerifier: string;
    codeChallenge: string;
} {
    const state = generateRandomString();
    const codeVerifier = generateRandomString();
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    return {
        state,
        codeVerifier,
        codeChallenge
    };
}

/**
 * If the reference is null or undefined, throw an error, otherwise return the reference.
 * @param {T | undefined | null} reference - The value to check.
 * @param {string} name - The name of the parameter that is being checked.
 * @returns A function that takes two parameters and returns either the first parameter or an Error.
 */
export function checkNotNull<T>(
    reference: T | undefined | null,
    name: string
): T | Error {
    if (reference === null || reference === undefined) {
        throw new PropertyRequiredException(name);
    }
    return reference;
}

const getValueByKey = (obj: Record<string, any>, key: string) => obj[key];

type AdditionalParametersKeys = keyof AdditionalParameters;

/**
 * It checks if the additionalParameters object is valid
 * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
 * @returns An object with the keys and values of the additionalParameters object.
 */
export const checkAdditionalParameters = (
    additionalParameters: AdditionalParameters = {}
) => {
    if (typeof additionalParameters !== 'object') {
        throw new UnexpectedException('additionalParameters');
    }
    const keyExists = Object.keys(
        additionalParameters
    ) as AdditionalParametersKeys[];
    if (keyExists.length) {
        const keysAllow = Object.keys(
            AdditionalParametersAllow
        ) as AdditionalParametersKeys[];
        for (const key of keyExists) {
            if (!keysAllow.includes(key)) {
                throw new UnexpectedException(key);
            }
            if (
                typeof additionalParameters[key] !==
                AdditionalParametersAllow[key]
            ) {
                throw new InvalidTypeException(
                    key,
                    getValueByKey(AdditionalParametersAllow, key)
                );
            }
        }
        return additionalParameters;
    }
    return {};
};

/**
 * It takes a target object and an additionalParameters object and adds the additionalParameters
 * object's key/value pairs to the target object
 * @param target - Record<string, string | undefined>
 * @param {AdditionalParameters} additionalParameters - AdditionalParameters = {}
 * @returns A function that takes two parameters, target and additionalParameters.
 */
export const addAdditionalParameters = (
    target: Record<string, string | undefined>,
    additionalParameters: AdditionalParameters = {}
) => {
    const keyExists = Object.keys(additionalParameters);
    if (keyExists.length) {
        keyExists.forEach((key) => {
            target[key] = getValueByKey(additionalParameters, key);
        });
    }
    return target;
};
