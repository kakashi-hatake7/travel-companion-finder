import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry error monitoring
 * Call this at app startup (before React renders)
 */
export const initSentry = () => {
    // Only initialize if DSN is provided (production/staging)
    const dsn = import.meta.env.VITE_SENTRY_DSN;

    if (!dsn) {
        console.log('Sentry DSN not configured - error monitoring disabled');
        return;
    }

    Sentry.init({
        dsn,

        // Set environment (production, staging, development)
        environment: import.meta.env.MODE || 'development',

        // Performance Monitoring
        integrations: [
            // Tracks React component render performance
            Sentry.browserTracingIntegration(),

            // Records user sessions for debugging
            Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true,
            }),

            // React-specific error tracking
            Sentry.reactRouterV6BrowserTracingIntegration(),
        ],

        // Performance monitoring sample rate (0.0 to 1.0)
        // 1.0 = 100% of transactions sent to Sentry
        tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

        // Session Replay sample rates
        replaysSessionSampleRate: 0.1, // 10% of normal sessions
        replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

        // Ignore common errors
        ignoreErrors: [
            // Browser extensions
            'top.GLOBALS',
            // Random network errors
            'NetworkError',
            // User canceled requests
            'AbortError',
        ],

        // Attach user context
        beforeSend(event, hint) {
            // Filter out localhost errors in production
            if (event.request?.url?.includes('localhost')) {
                return null;
            }

            return event;
        },
    });
};

/**
 * Manually capture an exception
 * @param {Error} error - The error to capture
 * @param {Object} context - Additional context
 */
export const captureError = (error, context = {}) => {
    Sentry.captureException(error, {
        extra: context,
    });
};

/**
 * Set user context for error tracking
 * @param {Object} user - User object with id, email, name
 */
export const setUserContext = (user) => {
    if (!user) {
        Sentry.setUser(null);
        return;
    }

    Sentry.setUser({
        id: user.uid,
        email: user.email,
        username: user.displayName || 'Anonymous',
    });
};

/**
 * Add breadcrumb for debugging
 * @param {string} message - Breadcrumb message
 * @param {string} category - Category (navigation, user-action, etc)
 * @param {Object} data - Additional data
 */
export const addBreadcrumb = (message, category = 'info', data = {}) => {
    Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
    });
};

/**
 * Wrap async functions with error handling
 * @param {Function} fn - Async function to wrap
 */
export const withErrorHandling = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            captureError(error, {
                functionName: fn.name,
                arguments: args,
            });
            throw error;
        }
    };
};
