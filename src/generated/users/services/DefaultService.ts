/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Health } from '../models/Health';
import type { PreferencesRead } from '../models/PreferencesRead';
import type { PreferencesUpdate } from '../models/PreferencesUpdate';
import type { UserCreate } from '../models/UserCreate';
import type { UserRead } from '../models/UserRead';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Register User
     * @param requestBody
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static registerUserAuthRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login User
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginUserAuthLoginPost(
        requestBody: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Logout User
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static logoutUserAuthLogoutPost(
        requestBody: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current User
     * @param authorization
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static getCurrentUserAuthMeGet(
        authorization?: (string | null),
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            headers: {
                'authorization': authorization,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Users
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static listUsersUsersGet(): CancelablePromise<Array<UserRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
        });
    }
    /**
     * Get User
     * @param id
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static getUserUsersIdGet(
        id: string,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param id
     * @param requestBody
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static updateUserUsersIdPut(
        id: string,
        requestBody: UserUpdate,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteUserUsersIdDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Preferences
     * @param id
     * @returns PreferencesRead Successful Response
     * @throws ApiError
     */
    public static getPreferencesUsersIdPreferencesGet(
        id: string,
    ): CancelablePromise<PreferencesRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}/preferences',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Preferences
     * @param id
     * @param requestBody
     * @returns PreferencesRead Successful Response
     * @throws ApiError
     */
    public static updatePreferencesUsersIdPreferencesPut(
        id: string,
        requestBody: PreferencesUpdate,
    ): CancelablePromise<PreferencesRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}/preferences',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Preferences
     * @param id
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePreferencesUsersIdPreferencesDelete(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}/preferences',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Health No Path
     * @param echo
     * @returns Health Successful Response
     * @throws ApiError
     */
    public static getHealthNoPathHealthGet(
        echo?: (string | null),
    ): CancelablePromise<Health> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            query: {
                'echo': echo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Health With Path
     * @param pathEcho
     * @param echo
     * @returns Health Successful Response
     * @throws ApiError
     */
    public static getHealthWithPathHealthPathEchoGet(
        pathEcho: string,
        echo?: (string | null),
    ): CancelablePromise<Health> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health/{path_echo}',
            path: {
                'path_echo': pathEcho,
            },
            query: {
                'echo': echo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static rootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
}
