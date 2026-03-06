## Stripe Checkout + Meta Purchase Event - Complete Fix

### Problem Fixed
- ✅ Stripe Checkout `success_url` was truncating to `/thank-you?session` instead of `/thank-you?session_id={CHECKOUT_SESSION_ID}`
- ✅ Thank-you page wasn't sending Purchase event to Meta CAPI reliably

### Solution Implemented

#### 1. Stripe Checkout Session (`/app/actions/stripe.ts`)
- `return_url` correctly set to: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`
- `event_id` generated and saved to session metadata for deduplication
- Tracking data (fbc, fbp, utm) included in metadata

#### 2. Thank-You Page (`/components/thank-you-content.tsx`)
- Reads `session_id` from URL searchParams
- Fetches Stripe session details from `/api/stripe/session`
- Calls new endpoint `/api/meta/purchase-from-session` to send Purchase event

#### 3. Meta Purchase Endpoint (`/app/api/meta/purchase-from-session/route.ts`)
- Node.js runtime for server-side processing
- Retrieves Stripe session with all line items
- Extracts: amount, currency, email, phone, fbc, fbp
- Hashes PII (SHA-256) according to Meta requirements
- Sends Purchase event to Meta Conversions API with:
  - `event_id` for deduplication
  - `user_data` with hashed email/phone
  - `custom_data` with value and currency
  - `fbc`/`fbp` for attribution
  - Unix timestamp in seconds

#### 4. Environment Variables
\`\`\`
APP_URL=https://yourapp.com
META_PIXEL_ID=your_pixel_id
META_ACCESS_TOKEN=your_access_token
STRIPE_SECRET_KEY=sk_test_...
\`\`\`

### Testing
1. Go through checkout with test product
2. After payment, check URL is `/thank-you?session_id=cs_...`
3. Check Vercel logs: `[Meta Purchase] Response:` should show `events_received: 1`
4. Verify in Meta Events Manager → Test Events that Purchase event arrived
