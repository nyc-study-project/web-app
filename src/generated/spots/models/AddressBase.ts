/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Neighborhood } from './Neighborhood';
export type AddressBase = {
    /**
     * Persistent Address ID (server-generated).
     */
    id?: string;
    /**
     * Street address and number.
     */
    street: string;
    /**
     * City (fixed).
     */
    city?: string;
    /**
     * State (fixed).
     */
    state?: string;
    /**
     * ZIP code.
     */
    postal_code: string;
    /**
     * Optional longitude value.
     */
    longitude?: (number | null);
    /**
     * Optional latitude value.
     */
    latitude?: (number | null);
    /**
     * Neighborhood.
     */
    neighborhood: Neighborhood;
};

