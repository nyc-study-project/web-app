/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddressBase } from './AddressBase';
import type { AmenitiesBase } from './AmenitiesBase';
import type { HoursBase } from './HoursBase';
/**
 * Creation payload for a Study Spot.
 */
export type StudySpotCreate = {
    /**
     * Persistent Study Spot ID (server-generated).
     */
    id?: string;
    /**
     * Name of the study spot
     */
    name: string;
    /**
     * Address linked to this study spot (carries a persistent Address ID).
     */
    address: AddressBase;
    /**
     * Amenities linked to this study spot (carries a persistent Amenities ID).
     */
    amenity: AmenitiesBase;
    /**
     * Hours linked to this study spot.
     */
    hour: HoursBase;
};

