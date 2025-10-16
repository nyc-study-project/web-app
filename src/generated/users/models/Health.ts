/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Health = {
    /**
     * Numeric status code (e.g., 200 for OK)
     */
    status: number;
    /**
     * Human-readable status message
     */
    status_message: string;
    /**
     * Timestamp in ISO 8601 format (UTC)
     */
    timestamp: string;
    /**
     * IP address of the responding service
     */
    ip_address: string;
    /**
     * Optional echo (query param)
     */
    echo?: (string | null);
    /**
     * Echo from path param (/health/{path_echo})
     */
    path_echo?: (string | null);
};

