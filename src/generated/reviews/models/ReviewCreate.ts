/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Creation payload; ID is generated server-side but present in the base model.
 */
export type ReviewCreate = {
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
};

