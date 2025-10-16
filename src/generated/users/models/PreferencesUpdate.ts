/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Partial update for preferences (only send fields to change)
 */
export type PreferencesUpdate = {
    environment?: ('quiet' | 'lively' | 'moderate' | null);
    wifi_required?: (boolean | null);
    open_late?: (boolean | null);
    refreshments_available?: (boolean | null);
    food_available?: (boolean | null);
    outlets_available?: (boolean | null);
    other_preferences?: (Record<string, any> | null);
};

