// src/lib/platforms/init.ts

import { registerPlatform } from "./platformRegistry";
import { GmailAdapter } from "@/lib/google/gmailAdapter";

/**
 * Initialize all platform adapters
 */
export const initPlatforms = () => {
    registerPlatform(GmailAdapter);

    // OutlookAdapter, TelegramAdapter, etc. added here in later stages
};
