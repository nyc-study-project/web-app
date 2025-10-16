/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressUpdate } from './AddressUpdate';
import type { AmenitiesUpdate } from './AmenitiesUpdate';
import type { HoursBase } from './HoursBase';
/**
 * Partial update for a StudySpot; supply only fields to change.
 */
export type StudySpotUpdate = {
    name?: (string | null);
    /**
     * Update the address linked to this study spot.
     */
    address?: (AddressUpdate | null);
    /**
     * Update the amenities linked to this study spot.
     */
    amenity?: (AmenitiesUpdate | null);
    /**
     * Update the hours linked to this study spot.
     */
    hour?: (HoursBase | null);
};

