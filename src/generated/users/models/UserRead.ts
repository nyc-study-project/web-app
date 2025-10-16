/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserRead = {
    /**
     * Unique username used for login.
     */
    username: string;
    /**
     * Age of the user.
     */
    age?: (number | null);
    /**
     * Occupation (e.g., student, professional).
     */
    occupation?: (string | null);
    /**
     * Location (borough or ZIP).
     */
    location?: (string | null);
    /**
     * Server-generated User ID
     */
    id?: string;
    /**
     * Account creation time (UTC)
     */
    created_at?: string;
    /**
     * Last update time (UTC)
     */
    updated_at?: string;
};

