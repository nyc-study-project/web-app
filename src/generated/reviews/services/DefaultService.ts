/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Health } from '../models/Health';
import type { RatingCreate } from '../models/RatingCreate';
import type { RatingRead } from '../models/RatingRead';
import type { RatingUpdate } from '../models/RatingUpdate';
import type { ReviewCreate } from '../models/ReviewCreate';
import type { ReviewRead } from '../models/ReviewRead';
import type { ReviewUpdate } from '../models/ReviewUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Health No Path
     * @param echo Optional echo string
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
     * @param pathEcho Required echo in the URL path
     * @param echo Optional echo string
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
     * Add Review
     * @param spotId Study Spot UUID
     * @param userId User UUID
     * @param requestBody
     * @returns ReviewRead Successful Response
     * @throws ApiError
     */
    public static addReviewReviewSpotIdUserUserIdPost(
        spotId: string,
        userId: string,
        requestBody: ReviewCreate,
    ): CancelablePromise<ReviewRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/review/{spotId}/user/{userId}',
            path: {
                'spotId': spotId,
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Review
     * @param reviewId
     * @param requestBody
     * @returns ReviewRead Successful Response
     * @throws ApiError
     */
    public static updateReviewReviewReviewIdPatch(
        reviewId: string,
        requestBody: ReviewUpdate,
    ): CancelablePromise<ReviewRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/review/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Review
     * @param reviewId
     * @returns void
     * @throws ApiError
     */
    public static deleteReviewReviewReviewIdDelete(
        reviewId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/review/{reviewId}',
            path: {
                'reviewId': reviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Reviews
     * @param spotId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getReviewsReviewsSpotIdGet(
        spotId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/{spotId}',
            path: {
                'spotId': spotId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Rating
     * @param spotId Study Spot UUID
     * @param userId User UUID
     * @param requestBody
     * @returns RatingRead Successful Response
     * @throws ApiError
     */
    public static addRatingRatingSpotIdUserUserIdPost(
        spotId: string,
        userId: string,
        requestBody: RatingCreate,
    ): CancelablePromise<RatingRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rating/{spotId}/user/{userId}',
            path: {
                'spotId': spotId,
                'userId': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Rating
     * @param ratingId
     * @param requestBody
     * @returns RatingRead Successful Response
     * @throws ApiError
     */
    public static updateRatingRatingRatingIdPatch(
        ratingId: string,
        requestBody: RatingUpdate,
    ): CancelablePromise<RatingRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/rating/{ratingId}',
            path: {
                'ratingId': ratingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Rating
     * @param ratingId
     * @returns void
     * @throws ApiError
     */
    public static deleteRatingRatingRatingIdDelete(
        ratingId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/rating/{ratingId}',
            path: {
                'ratingId': ratingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ratings
     * @param spotId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getRatingsRatingsSpotIdGet(
        spotId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ratings/{spotId}',
            path: {
                'spotId': spotId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Average Rating
     * @param spotId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAverageRatingRatingsSpotIdAverageGet(
        spotId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ratings/{spotId}/average',
            path: {
                'spotId': spotId,
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
