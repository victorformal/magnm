## Production-Grade Audit Report: Meta CAPI + Stripe Integration

### AUDIT CHECKLIST - PASS/FAIL ANALYSIS

#### 1. FBC/FBCLID Correctness
- **fbclid Capture & Preservation**: PASS ✓
  - proxy.ts correctly captures fbclid from URL without modification
  - No lowercasing, no decoding/re-encoding
  
- **FBC Format**: FAIL ❌ (Critical)
  - Current: `fb.1.${timestampMs}.${fbclid}` (milliseconds)
  - **Required**: `fb.1.${timestampSeconds}.${fbclid}` (seconds)
  - Impact: Meta rejects timestamps in wrong unit

#### 2. FBP Generation
- **Format**: PASS ✓
  - Correct format: `fb.1.${timestampMs}.${randomId}`
  - Milliseconds are correct for fbp
  
- **Randomness**: PASS ✓
  - Math.floor(Math.random() * 2147483647) is adequate

#### 3. Cookie Flags
- **httpOnly**: FAIL ❌ (Security issue)
  - Current: `httpOnly: false`
  - Should be: `true` for fbc (client-side doesn't need it)
  - Server reads cookies automatically via Next.js `cookies()`

- **Secure**: PASS ✓
  - Correctly set based on NODE_ENV

- **SameSite**: PASS ✓
  - Correctly set to "lax"

- **Path & Max-Age**: PASS ✓
  - Path: "/" ✓
  - Max-Age: 90 days ✓

#### 4. UTM/ttclid Persistence
- **Storage**: PASS ✓
  - UTMs stored in separate cookie with 30-day retention
  - ttclid also captured

- **Propagation to Stripe**: FAIL ❌
  - Metadata not being passed from proxy to Stripe session
  - UTM data in cookie but not extracted and added to checkout session metadata

#### 5. Event Time Format
- **Unix Seconds**: PASS ✓
  - sendEvent.ts: `Math.floor(Date.now() / 1000)` is correct

#### 6. Value Formatting
- **Stripe Conversion**: PASS ✓
  - Stripe: `amount_total` in cents → dividing by 100 ✓
  - Meta: expects value as decimal (e.g., 99.99) ✓

#### 7. Currency Normalization
- **Stripe Lowercase**: PASS ✓
  - Stripe returns lowercase (gbp, eur)

- **Meta Uppercase**: PASS ✓
  - sendEvent.ts: `.toUpperCase()` applied ✓

- **No Fixed Currency**: PASS ✓
  - Using checkout currency dynamically from product

#### 8. Meta Hashing Rules
- **Email**: PASS ✓
  - normalize() → trim().toLowerCase() → SHA-256 ✓
  - Wrapped in array: `em: [hash]` ✓

- **Phone**: PASS ✓
  - Properly normalized (digits only, handles +)
  - SHA-256 hashed
  - Wrapped in array: `ph: [hash]` ✓

- **Names/Address**: PASS ✓
  - normalize() applied before hashing

#### 9. IP & User-Agent Forwarding (Vercel)
- **IP Extraction**: PASS ✓
  - `x-forwarded-for` → take first IP
  - Falls back to x-real-ip, cf-connecting-ip

- **User-Agent**: PASS ✓
  - Correctly extracted from headers

- **Vercel Compatibility**: PASS ✓
  - Using NextRequest.headers correctly

#### 10. Event ID Deduplication
- **Client Generation**: PASS ✓
  - StripeCheckout: `checkout_${Date.now()}_${Math.random()}`
  - Reasonable uniqueness

- **Server Storage**: FAIL ❌
  - event_id generated in checkout component
  - Not persisted to Stripe metadata for webhook retrieval
  - Webhook generates new event_id if not provided

- **Webhook Handling**: FAIL ❌
  - No idempotency key storage
  - Could send duplicate Purchase if webhook retried

#### 11. Stripe Webhook Verification
- **Raw Body**: PASS ✓
  - `request.text()` used before signature check ✓
  
- **Signature Check**: PASS ✓
  - `stripe.webhooks.constructEvent()` with STRIPE_WEBHOOK_SECRET ✓

#### 12. Idempotency
- **Problem**: FAIL ❌
  - No tracking of already-processed events
  - Stripe retries could cause duplicate Purchase events
  - No database/cache checking

#### 13. Meta CAPI Request
- **Endpoint**: PASS ✓
  - Using v20.0 ✓
  
- **action_source**: PASS ✓
  - Set to 'website' ✓

- **event_source_url**: PASS ✓
  - Captured and forwarded ✓

#### 14. Logging
- **Error Logging**: PASS ✓
  - Includes fbtrace_id from Meta response
  
- **PII Safety**: FAIL ❌
  - Logging raw email in checkout debug
  - Should only log hashed/masked data

---

## RED FLAGS: Top 10 Common Bugs

1. **Timestamp Units Mismatch** (CRITICAL)
   - FBC using milliseconds instead of seconds causes Meta to reject/warn
   - Fix: Use `Math.floor(Date.now() / 1000)` for fbc

2. **FBC HttpOnly Flag**
   - Client code shouldn't need to read _fbc, but setting HttpOnly=false allows malicious scripts to steal it
   - Fix: Set httpOnly=true, server reads via cookies()

3. **Missing Event ID Persistence**
   - event_id generated client-side but not stored in Stripe metadata
   - Webhook can't verify if event already sent
   - Fix: Store event_id in checkout session metadata

4. **No Idempotency Handling**
   - Duplicate Webhook delivery = duplicate Purchase events sent to Meta
   - Meta warns: "Multiple purchases with same order_id"
   - Fix: Store processed webhook IDs in database or Upstash

5. **UTM Data Not Propagated**
   - UTM cookies exist but never added to Stripe/Meta metadata
   - Attribution data lost
   - Fix: Read _utm_data cookie in checkout, add to session metadata

6. **Currency Mismatch Possible**
   - If product currency lookup fails, fallback "gbp" might not match actual currency
   - Fix: Throw error if currency can't be determined

7. **PII Logging Leakage**
   - Console.log() includes customer email in debug output
   - Production logs might expose user data
   - Fix: Only log masked data or hashes

8. **Missing Error Trace Context**
   - When Meta CAPI fails, no trace_id captured for debugging
   - Fix: Always log Meta response fbtrace_id

9. **Stripe Webhook Body Not Persisted**
   - If webhook processing fails mid-way, retrying uses different timestamp
   - event_time will differ
   - Fix: Use event.created timestamp instead of current time

10. **No Verification of Metadata in Webhook**
    - Stripe metadata could be missing/corrupted
    - No fallback if fbc/fbp missing from metadata
    - Fix: Add comprehensive logging + fallback behavior

---

## Recommended Fixes by Priority

### CRITICAL (Fix immediately)
1. FBC timestamp: milliseconds → seconds
2. Add event_id to Stripe metadata
3. Implement idempotency (webhook dedup)

### HIGH (Fix before production)
4. Set httpOnly=true for fbc
5. Add UTM propagation to Stripe
6. Secure logging (no PII in logs)

### MEDIUM (Fix soon)
7. Better error handling in webhook
8. Add retry logic with exponential backoff
9. Store event timestamps consistently
