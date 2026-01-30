# Sentry Error Monitoring Setup Guide

Sentry has been integrated into your UniGo app to provide real-time error tracking, performance monitoring, and session replays.

## What You Get with Sentry

✅ **Real-Time Error Alerts** - Get notified when users encounter bugs  
✅ **Stack Traces** - See exactly where errors occurred in your code  
✅ **Session Replays** - Watch video recordings of user sessions when errors happen  
✅ **Performance Monitoring** - Track slow pages and API calls  
✅ **User Context** - Know which users are affected by issues  
✅ **Release Tracking** - Compare error rates across deployments  

---

## Quick Setup (5 minutes)

### Step 1: Create Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Sign up for a **free account** (10k errors/month free)
3. Create a new project:
   - Select **React** as the platform
   - Name it "UniGo" or "Travel-Companion-Finder"

### Step 2: Get Your DSN

1. After creating the project, you'll see your **DSN** (Data Source Name)
2. It looks like: `https://abc123@o123456.ingest.sentry.io/7654321`
3. Copy this DSN

### Step 3: Add DSN to Environment Variables

1. Open `.env.local` in your project root
2. Add your DSN:
   ```bash
   VITE_SENTRY_DSN=https://your-actual-dsn@sentry.io/project-id
   ```
3. Save the file

### Step 4: Restart Development Server

```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

That's it! Sentry is now tracking errors.

---

## Testing Sentry Integration

### Test 1: Trigger a Test Error

Add this button temporarily to your app:

```javascript
<button onClick={() => {
  throw new Error('This is a test error for Sentry!');
}}>
  Test Sentry
</button>
```

Click it, and you should see the error in your Sentry dashboard within seconds.

### Test 2: Check Console

When Sentry initializes, you should see in browser console:
```
Sentry DSN not configured - error monitoring disabled
```
(if DSN is empty)

OR nothing (if DSN is configured correctly)

---

## What Sentry Tracks Automatically

### 1. **React Component Errors**
Any error in your React components will be caught by the ErrorBoundary.

### 2. **Async Function Errors**
Errors in async operations (Firebase calls, API requests) are tracked.

### 3. **User Actions**
Breadcrumbs are logged for:
- User login/logout
- Trip registration
- Match found
- View navigation

### 4. **Performance Metrics**
- Page load times
- Component render times
- Firebase query durations

---

## Sentry Dashboard Features

### Issues Tab
See all errors with:
- Error message & stack trace
- Affected users count
- First seen / Last seen timestamps
- Frequency graph

### Performance Tab
Monitor:
- Page load performance
- Slow database queries
- API response times
- Frontend transactions

### Releases Tab
Track:
- Which version has which bugs
- Error rates per deployment
- Regressions (new errors in new releases)

### Replays Tab
Watch video replays of user sessions where errors occurred.

---

## Production Deployment

### Vercel Configuration

Add your Sentry DSN to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `VITE_SENTRY_DSN` with your DSN value
4. Redeploy your app

### Monitoring Production Errors

Once deployed, Sentry will automatically:
- Capture all production errors
- Record 10% of user sessions
- Record 100% of sessions with errors
- Send you email alerts for new issues

---

## Advanced Features (Optional)

### 1. Source Maps for Better Stack Traces

Add to `vite.config.js`:

```javascript
build: {
  sourcemap: true,  // Enable source maps
}
```

Then upload source maps to Sentry after each build.

### 2. Custom Error Tracking

```javascript
import { captureError, addBreadcrumb } from './services/monitoring';

// Track custom errors
try {
  await riskyOperation();
} catch (error) {
  captureError(error, {
    operation: 'riskyOperation',
    userId: currentUser.uid
  });
}

// Add custom breadcrumbs
addBreadcrumb('User started payment', 'payment', {
  amount: 999
});
```

### 3. Performance Tracking

```javascript
import * as Sentry from "@sentry/react";

const transaction = Sentry.startTransaction({
  name: "Load Trip Matches"
});

const matches = await getMatchesForUser(userId);

transaction.finish();
```

---

## Cost & Limits

### Free Tier (Perfect for Hackathons)
- 10,000 errors/month
- 50 session replays/month
- 10,000 performance transactions/month
- 1 team member
- 90 days data retention

### Paid Plans (If You Scale)
- From $26/month
- More errors & replays
- Unlimited team members
- Advanced features

---

## Troubleshooting

### Issue: "Sentry DSN not configured"
**Solution:** Add `VITE_SENTRY_DSN` to `.env.local` and restart dev server.

### Issue: Errors not appearing in dashboard
**Check:**
1. Is the DSN correct?
2. Is network blocked (check browser DevTools)
3. Is the error actually being thrown?

### Issue: Too many errors reported
**Solution:** Add filters in `monitoring.js`:
```javascript
ignoreErrors: [
  'NetworkError',
  'Loading chunk',
  // Add more patterns
],
```

---

## Best Practices

✅ **DO:**
- Set up alerts for critical errors
- Review new issues daily
- Add breadcrumbs for important user actions
- Use Sentry before launching to production

❌ **DON'T:**
- Expose your DSN in public repos (it's safe in code though)
- Ignore repeated errors (they indicate real issues)
- Track sensitive data (passwords, tokens, etc.)

---

## Support & Documentation

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Dashboard:** https://sentry.io/organizations/your-org/issues/
- **Support:** support@sentry.io

---

**🎉 Sentry is now configured! Your app is production-ready with enterprise-grade error monitoring.**

**Next Step:** Test it by triggering a sample error and checking your Sentry dashboard.
