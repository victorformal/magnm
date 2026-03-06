## Production-Grade Meta CAPI + Stripe Integration Guide

This guide implements production-ready tracking with:
- ✓ Correct FBC/FBP cookie handling (fbclid preservation, unix seconds)
- ✓ Event deduplication (idempotent Purchase events)
- ✓ Multi-currency support (GBP/EUR dynamic)
- ✓ UTM/attribution preservation
- ✓ Vercel-compatible IP/UA forwarding
- ✓ Comprehensive error handling

---

## Architecture Overview

\`\`\`
User clicks Meta ad with ?fbclid=XXX
       ↓
proxy.ts captures fbclid → creates _fbc cookie (fb.1.{seconds}.{fbclid})
       ↓
User adds products to cart
       ↓
StripeCheckout captures _fbc, _fbp, UTMs, event_id
       ↓
createCheckoutSession() stores all data in Stripe metadata
       ↓
User completes payment
       ↓
Stripe webhook received → verifies signature → extracts metadata
       ↓
sendPurchaseEvent() sends to Meta CAPI with fbc/fbp/event_id
       ↓
Meta deduplicates by event_id, improves Event Match Quality
\`\`\`

---

## Critical Files & Changes

### 1. proxy.ts (NEXT.JS 16+)
**Status**: ✓ FIXED
- Changed: `timestampMs` → `timestampSeconds` for FBC format
- Changed: `httpOnly: false` → `httpOnly: true` for security
- Added: Logging for monitoring

**Key line**:
\`\`\`typescript
const timestampSeconds = Math.floor(Date.now() / 1000)
const fbc = `fb.1.${timestampSeconds}.${fbclid}`
\`\`\`

### 2. lib/utm.ts
**Status**: ✓ NEW SERVER-SIDE SUPPORT
- Added: `getUTMDataFromCookie()` for server-side UTM extraction
- Added: `getTikTokClickIdFromCookie()` for TikTok attribution

### 3. app/actions/stripe.ts
**Status**: ✓ FIXED - Event ID & UTM propagation
- Added: Event ID storage in Stripe metadata
- Added: UTM data propagation to Stripe metadata
- Added: TikTok click ID storage

**Metadata now includes**:
\`\`\`typescript
metadata: {
  event_id: trackingData?.eventId,  // ← For webhook deduplication
  fbc: trackingData?.fbc,
  fbp: trackingData?.fbp,
  utm_source: utmData.utm_source,
  utm_medium: utmData.utm_medium,
  utm_campaign: utmData.utm_campaign,
  ttclid: ttclid,
}
\`\`\`

### 4. app/api/stripe/webhook/route.ts
**Status**: ✓ PRODUCTION-READY
- Extracts event_id from Stripe metadata for deduplication
- Uses stripe.webhooks.constructEvent() with raw body
- Converts amount (cents) to value (decimal)
- Converts currency (lowercase) to uppercase

### 5. lib/meta/sendEvent.ts
**Status**: ✓ PRODUCTION-READY
- Proper SHA-256 hashing of PII
- Correct event_time in unix seconds
- Uppercase currency conversion
- Error logging with fbtrace_id

---

## Deployment Checklist

### Environment Variables
Add to Vercel project (Settings → Environment Variables):

\`\`\`
META_PIXEL_ID=YOUR_PIXEL_ID
META_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
\`\`\`

### Stripe Webhook Setup
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `checkout.session.async_payment_succeeded`
   - `payment_intent.payment_failed` (for logging)
4. Copy webhook secret → `STRIPE_WEBHOOK_SECRET`

### Meta Conversions API
1. Go to Meta Business Suite → Apps → Conversions API
2. Create new Data Set (if needed)
3. Add Web Pixel: https://yourdomain.com (for fbp generation)
4. Get Pixel ID → `META_PIXEL_ID`
5. Generate Access Token → `META_ACCESS_TOKEN`
6. Enable "Automatic Matching" for better EMQ (Event Match Quality)

---

## Testing Guide

### 1. Test FBC Generation
\`\`\`bash
# Visit with fbclid parameter
https://yourdomain.com/?fbclid=test123

# Check browser DevTools → Application → Cookies
# Should see _fbc=fb.1.{unix_seconds}.test123
# (e.g., fb.1.1705900800.test123)
\`\`\`

### 2. Test Purchase Event
\`\`\`bash
# 1. Add product to cart
# 2. Complete checkout
# 3. Check Stripe Dashboard → Events → Payment intents
# 4. Check webhook logs for success
\`\`\`

### 3. Monitor Meta Events
\`\`\`bash
# Meta Business Suite → Analytics → Conversions API
# Should see "Purchase" events with increasing "Matched Leads"
# Event Match Quality should be 85%+ if emails provided
\`\`\`

### 4. Check Deduplication
\`\`\`bash
# Manually trigger webhook 2x with same payment_intent_id
# Meta should show only 1 Purchase (deduped by event_id)
# Webhook logs should show "Purchase event sent"
\`\`\`

---

## Debugging Common Issues

### Issue: "FBC Modified" Warning in Meta
**Cause**: fbclid being lowercased or modified
**Fix**: Verify proxy.ts uses `fbclid` exactly as provided, no transformations

### Issue: Low Event Match Quality (< 70%)
**Cause**: PII not hashed or provided incorrectly
**Fix**: 
- Ensure email is provided at purchase
- Verify hash.ts normalization runs before SHA-256
- Check Meta Dashboard for hash validation errors

### Issue: Duplicate Purchases in Meta
**Cause**: Webhook retries without event_id deduplication
**Fix**:
- Verify event_id stored in Stripe metadata
- Webhook logs should show same event_id on retry
- Implement database tracking if not using event_id

### Issue: "Invalid currency" from Stripe
**Cause**: Mixing GBP and EUR products in same cart
**Fix**: Current code throws error on mixed currencies
- Clear user's cart if they add products from different regions

### Issue: Missing IP/User-Agent in Meta
**Cause**: Running on localhost without x-forwarded-for
**Fix**: 
- Vercel adds x-forwarded-for automatically
- Local testing: set `client_ip_address` to test IP
- Won't affect production (Vercel sets it)

---

## Security Best Practices

### Do's ✓
- ✓ Store fbclid in httpOnly cookie
- ✓ Verify Stripe webhook signature with raw body
- ✓ Hash PII before sending to Meta
- ✓ Log only masked/hashed data
- ✓ Use POST for sensitive data (never GET params)

### Don'ts ✗
- ✗ Don't expose fbclid in logs
- ✗ Don't send raw email to client-side
- ✗ Don't trust client-provided prices
- ✗ Don't skip webhook signature verification
- ✗ Don't modify fbclid value

---

## Performance Optimization

### Caching
- Stripe product lookups: 60-second cache per session
- UTM data: 30-day cookie retention (sufficient for attribution)
- FBC/FBP: 90-day retention (Meta standard)

### Rate Limiting
- Meta CAPI: No rate limits for typical volume
- Stripe: 100 requests/sec (easily sufficient)
- Consider: Implement Upstash rate limiter if >1000 purchases/day

### Monitoring
Add alerts for:
\`\`\`
- Meta API errors (fbtrace_id logged)
- Webhook processing errors > 5% failure rate
- Duplicate Purchase events
- Currency mismatches
\`\`\`

---

## Production Deployment Checklist

- [ ] All env vars added to Vercel
- [ ] Stripe webhook endpoint configured + secret copied
- [ ] Meta Conversions API connected + token valid
- [ ] FBC format verified (unix seconds, not milliseconds)
- [ ] Test purchase completed end-to-end
- [ ] Purchase event visible in Meta Analytics
- [ ] Event Match Quality at 85%+
- [ ] Webhook retries tested (no duplicates)
- [ ] Error logging configured
- [ ] DNS/HTTPS verified
- [ ] Rate limiting considered
- [ ] PII logging removed from production

---

## Rollback Plan

If issues occur:

1. **Disable Meta tracking**: 
   - Remove `META_ACCESS_TOKEN` env var
   - Purchase flow continues without Meta events

2. **Disable Stripe webhook**:
   - Pause webhook in Stripe Dashboard
   - Checkouts continue, no Purchase events sent

3. **Revert proxy.ts**:
   - Rollback to previous deployment
   - No new fbclid captures, existing cookies still valid

---

## Support & Monitoring

### Logging Recommendations
\`\`\`typescript
// Add to /lib/meta/sendEvent.ts for production monitoring
console.log('[Meta] Purchase event sent:', {
  event_id: eventPayload.event_id,
  fbtrace_id: result.fbtrace_id,
  has_email: !!hashedUserData.em,
  value: data.customData?.value,
  currency: data.customData?.currency,
  timestamp: new Date().toISOString(),
})
\`\`\`

### Metrics to Track
- Purchase events sent to Meta (counter)
- Meta API errors (with fbtrace_id for debugging)
- Webhook processing time (alert if >5s)
- Event Match Quality trend (weekly review)
- Revenue per event (Meta reporting)
