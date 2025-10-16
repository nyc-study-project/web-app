/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RatingRead = {
    /**
     * Server-generated Rating  ID.
     */
    id?: string;
    /**
     * The rating
     */
    rating: number;
    /**
     * Date/time the rating was posted.
     */
    postDate?: string;
    /**
     * Creation timestamp (UTC).
     */
    created_at: string;
    /**
     * Last update timestamp (UTC).
     */
    updated_at?: (string | null);
};

