/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Neighborhood } from './Neighborhood';
/**
 * Partial update; address ID is taken from the path, not the body.
 */
export type AddressUpdate = {
    /**
     * Street address and number.
     */
    street?: (string | null);
    /**
     * City or locality.
     */
    city?: (string | null);
    /**
     * State/region code if applicable.
     */
    state?: (string | null);
    /**
     * Postal or ZIP code.
     */
    postal_code?: (string | null);
    /**
     * Neighborhood.
     */
    neighborhood?: (Neighborhood | null);
};

