
/**
 * Application constants and configuration values
 */

// Scan scoring
export const SCAN_SCORE = {
  MIN: 0,
  MAX: 100,
  MOCK_MIN: 60,
  MOCK_MAX: 95,
} as const;

// UI Messages
export const MESSAGES = {
  AUTH: {
    WELCOME_BACK: "Welcome back!",
    LOGIN_SUCCESS: "You've been successfully logged in.",
    ACCOUNT_CREATED: "Account created!",
    SIGNUP_SUCCESS: "Welcome to Healthy Tummies!",
    EMAIL_VERIFICATION: "Please check your email to verify your account.",
    GENERIC_ERROR: "An error occurred during authentication",
  },
  SCAN: {
    COMPLETE: "Scan Complete!",
    TEST_COMPLETE: "Test Scan Complete!",
    RECORDED: "Scan recorded in your history.",
    CAMERA_COMING_SOON: "Camera functionality coming soon",
    WORKING_ON_INTEGRATION: "We're working on camera integration to scan barcodes and analyze food products for your baby's safety.",
  },
  ERRORS: {
    AUTH_REQUIRED: "You must be logged in to record scans",
    SCAN_FAILED: "Failed to record scan data",
    GENERIC: "An unexpected error occurred",
  }
} as const;

// Navigation
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SCAN: '/scan',
  SEARCH: '/search',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "Healthy Tummies",
  SCAN_HISTORY_DAYS: 90,
  PASSWORD_MIN_LENGTH: 6,
} as const;
