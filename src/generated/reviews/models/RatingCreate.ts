/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Creation payload; ID is generated server-side but present in the base model.
 */
export type RatingCreate = {
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
};

