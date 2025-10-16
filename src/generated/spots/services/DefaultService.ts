/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Health } from '../models/Health';
import type { StudySpotCreate } from '../models/StudySpotCreate';
import type { StudySpotRead } from '../models/StudySpotRead';
import type { StudySpotUpdate } from '../models/StudySpotUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
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
     * Create Studyspot
     * @param requestBody
     * @returns StudySpotRead Successful Response
     * @throws ApiError
     */
    public static createStudyspotStudyspotsPost(
        requestBody: StudySpotCreate,
    ): CancelablePromise<StudySpotRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/studyspots',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Studyspots
     * @param name
     * @param wifi
     * @param outlets
     * @param seating
     * @param refreshments
     * @param city
     * @returns StudySpotRead Successful Response
     * @throws ApiError
     */
    public static listStudyspotsStudyspotsGet(
        name?: (string | null),
        wifi?: (boolean | null),
        outlets?: (boolean | null),
        seating?: (number | null),
        refreshments?: (string | null),
        city?: (string | null),
    ): CancelablePromise<Array<StudySpotRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/studyspots',
            query: {
                'name': name,
                'wifi': wifi,
                'outlets': outlets,
                'seating': seating,
                'refreshments': refreshments,
                'city': city,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Studyspot
     * @param studyspotId
     * @returns StudySpotRead Successful Response
     * @throws ApiError
     */
    public static getStudyspotStudyspotsStudyspotIdGet(
        studyspotId: string,
    ): CancelablePromise<StudySpotRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/studyspots/{studyspot_id}',
            path: {
                'studyspot_id': studyspotId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Studyspot
     * @param studyspotId
     * @param requestBody
     * @returns StudySpotRead Successful Response
     * @throws ApiError
     */
    public static updateStudyspotStudyspotsStudyspotIdPatch(
        studyspotId: string,
        requestBody: StudySpotUpdate,
    ): CancelablePromise<StudySpotRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/studyspots/{studyspot_id}',
            path: {
                'studyspot_id': studyspotId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Studyspot
     * @param studyspotId
     * @returns void
     * @throws ApiError
     */
    public static deleteStudyspotStudyspotsStudyspotIdDelete(
        studyspotId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/studyspots/{studyspot_id}',
            path: {
                'studyspot_id': studyspotId,
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
