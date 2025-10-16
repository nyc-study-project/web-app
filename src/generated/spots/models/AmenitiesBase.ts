/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Environment } from './Environment';
import type { Seating } from './Seating';
export type AmenitiesBase = {
    /**
     * Persistent Amenities ID (server-generated).
     */
    id?: string;
    /**
     * WiFi availability.
     */
    wifi_available: boolean;
    /**
     * WiFi name, optional entry.
     */
    wifi_network?: (string | null);
    /**
     * Outlet availability.
     */
    outlets: boolean;
    /**
     * Seating capacity.
     */
    seating: Seating;
    /**
     * Food and/or drinks served, optional entry. Comma separated values.
     */
    refreshments?: (string | null);
    /**
     * Environment of the study space
     */
    environment: Array<Environment>;
};

