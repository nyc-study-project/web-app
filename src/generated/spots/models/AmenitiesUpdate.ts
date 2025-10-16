/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Environment } from './Environment';
import type { Seating } from './Seating';
/**
 * Partial update; address ID is taken from the path, not the body.
 */
export type AmenitiesUpdate = {
    /**
     * WiFi availability, optional entry.
     */
    wifi_available?: (boolean | null);
    /**
     * WiFi name, optional entry.
     */
    wifi_network?: (string | null);
    /**
     * Outlet availability.
     */
    outlets?: (boolean | null);
    /**
     * Seating capacity.
     */
    seating?: (Seating | null);
    /**
     * Food and/or drinks served, optional entry. Comma separated values.
     */
    refreshments?: (string | null);
    /**
     * Environment of the study space.
     */
    environment?: (Array<Environment> | null);
};

