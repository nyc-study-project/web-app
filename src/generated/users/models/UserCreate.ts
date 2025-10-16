/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Payload for creating a user account (adding password here)
 */
export type UserCreate = {
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
     * Raw password (will be hashed before storage)
     */
    password: string;
};

