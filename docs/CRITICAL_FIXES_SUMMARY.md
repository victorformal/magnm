## Critical Fixes Summary

### ✅ FIXED ISSUES

#### 1. FBC Timestamp Units (CRITICAL)
**Before**: `fb.1.${Date.now()}.${fbclid}` (milliseconds)
**After**: `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}` (seconds)
**Impact**: Meta rejects/warns if timestamp in wrong unit
**File**: proxy.ts, line 30

#### 2. Cookie Security (MEDIUM)
**Before**: `httpOnly: false`
**After**: `httpOnly: true`
**Impact**: Prevents client-side access to sensitive tracking data
**File**: proxy.ts, line 18

#### 3. Event ID Persistence (HIGH)
**Before**: Generated in client, never stored for webhook
**After**: Stored in Stripe metadata (`event_id` field)
**Impact**: Enables webhook deduplication, prevents duplicate Purchases
**File**: app/actions/stripe.ts, line 137

#### 4. UTM Attribution (HIGH)
**Before**: UTMs captured in cookie but not propagated
**After**: Server-side extraction + added to Stripe metadata
**Impact**: Full attribution data available in Stripe & Meta
**File**: app/actions/stripe.ts, line 32-35, lines 141-146

---

## One-Liner Verification

### Check FBC Format
\`\`\`bash
# In browser console
document.cookie.split(';').find(c => c.includes('_fbc')).split('=')[1]
# Should show: fb.1.{10-digit-seconds}.fbclid_value
# NOT: fb.1.{13-digit-milliseconds}.fbclid_value
\`\`\`

### Check Stripe Metadata
\`\`\`bash
# After completing test purchase, in Stripe Dashboard:
# Events → Click payment intent → Metadata tab
# Should have: event_id, fbc, fbp, utm_source, utm_medium, utm_campaign
\`\`\`

### Check Meta Purchase Event
\`\`\`bash
# Meta Business Suite → Analytics → Conversions API
# Should see Purchase event with:
# - fbtrace_id (indicates successful API call)
# - event_id (for deduplication)
# - Currency in UPPERCASE (EUR, GBP, not eur, gbp)
# - Value as decimal (99.99, not 9999)
\`\`\`

---

## Production Red Flags

❌ These indicate problems:

1. **Meta warning**: "Invalid fbc format"
   → Fix: Check timestamp is unix SECONDS

2. **Duplicate Purchases in Meta**
   → Fix: Verify event_id in Stripe metadata

3. **Low Event Match Quality (< 70%)**
   → Fix: Check email hashing in hash.ts

4. **"Currency mismatch" errors**
   → Fix: Verify all products in cart have same currency

5. **Webhook processing errors**
   → Fix: Check STRIPE_WEBHOOK_SECRET is correct

6. **PII in production logs**
   → Fix: Remove console.log of raw email/phone

---

## Files Changed & Verification

| File | Change | Status |
|------|--------|--------|
| proxy.ts | FBC timestamp (ms→s), httpOnly (F→T) | ✅ FIXED |
| lib/utm.ts | Added server-side extraction | ✅ NEW |
| app/actions/stripe.ts | Event ID + UTM propagation | ✅ FIXED |
| app/api/stripe/webhook/route.ts | Deduplication ready | ✅ READY |
| lib/meta/sendEvent.ts | Hash/currency normalization | ✅ READY |
| .env.example | All required vars documented | ✅ NEW |

---

## Quick Checklist Before Deploying

- [ ] FBC uses unix seconds (not milliseconds)
- [ ] httpOnly=true on _fbc cookie
- [ ] event_id stored in Stripe metadata
- [ ] UTM data extracted and stored in Stripe metadata
- [ ] Stripe webhook signature verification active
- [ ] Meta ACCESS_TOKEN set in env vars
- [ ] All 3 required env vars present (PIXEL_ID, ACCESS_TOKEN, STRIPE_SECRET)
- [ ] Test purchase completed end-to-end
- [ ] Purchase event visible in Meta Analytics
- [ ] No PII in production logs
- [ ] Webhook endpoint responding 200 OK

---

## Support Information

### If FBC is Wrong
The FBC format must be exactly: `fb.1.{unix_seconds_as_integer}.{fbclid_original}`

❌ Wrong:
- `fb.1.1705900800000.abc123` (milliseconds)
- `fb.1.1705900800.abc123` + spaces
- `fb.1.1705900800.ABC123` (fbclid lowercased)

✅ Correct:
- `fb.1.1705900800.abc123` (seconds, no modification)

### If Event ID Missing
Webhook can't deduplicate without event_id. Check:
1. Component passes eventId in trackingData ✓
2. Stripe metadata includes `event_id` field ✓
3. Webhook extracts `metadata.event_id` ✓

### If Currency Wrong
Meta expects UPPERCASE (EUR, GBP, USD)
- Stripe returns: "eur", "gbp" (lowercase)
- sendMetaEvent() calls `.toUpperCase()` ✓
- If still wrong: Check currency is coming from Stripe correctly
