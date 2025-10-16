/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PreferencesRead = {
    /**
     * Preferred noise/environment level.
     */
    environment?: ('quiet' | 'lively' | 'moderate' | null);
    /**
     * Does the user require WiFi?
     */
    wifi_required?: (boolean | null);
    /**
     * Does the user prefer spots open late?
     */
    open_late?: (boolean | null);
    /**
     * Preference for drink availability.
     */
    refreshments_available?: (boolean | null);
    /**
     * Preference for food availability.
     */
    food_available?: (boolean | null);
    /**
     * Preference for power outlets availability.
     */
    outlets_available?: (boolean | null);
    /**
     * Flexible additional preferences so we're not limiting what preferences the user can enter.
     */
    other_preferences?: (Record<string, any> | null);
    /**
     * Preferences ID
     */
    id?: string;
    /**
     * Associated user ID
     */
    user_id: string;
    /**
     * Creation timestamp (UTC)
     */
    created_at?: string;
    /**
     * Last update timestamp (UTC)
     */
    updated_at?: string;
};

