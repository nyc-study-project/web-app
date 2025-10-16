/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ReviewRead = {
    /**
     * Server-generated Review  ID.
     */
    id?: string;
    /**
     * The review
     */
    review: string;
    /**
     * Date/time the review was posted.
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

