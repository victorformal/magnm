# TikTok Pixel Events Implementation Guide

## Overview
This document outlines all TikTok Pixel events implemented on the website and their tracking points.

## Implemented Events

### 1. ViewContent
**When:** User views a product page
**Location:** `/components/view-content-tracker.tsx`
**Data Tracked:**
- Product ID, name, category, price
- Content type: "product"
- Brand: "Acoustic Design"
- Currency: GBP/EUR

**Code Example:**
\`\`\`typescript
await trackViewContent({
  contents: [
    {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      price: price,
      num_items: 1,
      brand: 'Acoustic Design',
    }
  ],
  value: price,
  currency: 'GBP',
  description: product.description,
})
\`\`\`

### 2. AddToCart
**When:** User clicks "Buy Now" button on product page
**Location:** `/components/add-to-cart-button.tsx`
**Data Tracked:**
- Product ID, name, category, price
- Quantity selected
- Total value (price × quantity)
- Currency: GBP/EUR

**Code Example:**
\`\`\`typescript
await trackAddToCart({
  contents: [
    {
      content_id: product.id,
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      price: displayPrice,
      num_items: quantity,
      brand: 'Acoustic Design',
    }
  ],
  value: displayPrice * quantity,
  currency: currency,
  description: product.name,
})
\`\`\`

### 3. InitiateCheckout
**When:** User enters checkout page
**Location:** `/components/tiktok-checkout.tsx`
**Data Tracked:**
- Cart contents
- Total value
- Currency: GBP/EUR

### 4. AddPaymentInfo
**When:** User clicks "Proceed to Checkout" (Stripe form shown)
**Location:** `/components/stripe-checkout.tsx`
**Data Tracked:**
- Cart items with full details
- Total value
- Currency: GBP/EUR

### 5. Purchase
**When:** User completes checkout successfully
**Location:** `/app/thank-you/thank-you-client.tsx`
**Data Tracked:**
- All purchased items with details
- Total purchase value
- Currency: GBP/EUR
- Status: "completed"

**Data Flow:**
1. During checkout, data is stored in `sessionStorage` as `tiktok_purchase_data`
2. On success page, data is retrieved and Purchase event is fired
3. If no stored data, uses Stripe session info as fallback

## Event Functions Library

All events are implemented in `/lib/tiktok-events.ts`:

- `trackIdentify(data)` - Identify user with PII (hashed)
- `trackViewContent(data)` - Track product views
- `trackAddToWishlist(data)` - Track wishlist additions
- `trackSearch(searchString, data)` - Track search events
- `trackAddPaymentInfo(data)` - Track payment info additions
- `trackAddToCart(data)` - Track add to cart
- `trackInitiateCheckout(data)` - Track checkout initiation
- `trackPlaceAnOrder(data)` - Track order placement
- `trackCompleteRegistration(data)` - Track registration completion
- `trackPurchase(data)` - Track purchases

## Data Structure

### TikTokContent Interface
\`\`\`typescript
interface TikTokContent {
  content_id?: string           // Product ID
  content_type?: 'product' | 'product_group'
  content_name?: string         // Product name
  content_category?: string     // Product category
  price?: number               // Price per unit
  num_items?: number           // Quantity
  brand?: string               // Brand name
}
\`\`\`

### TikTokTrackData Interface
\`\`\`typescript
interface TikTokTrackData {
  contents?: TikTokContent[]
  value?: number              // Total value
  currency?: string           // GBP, EUR, etc.
  search_string?: string      // For search events
  description?: string        // Event description
  status?: string             // Order status
}
\`\`\`

## Implementation Notes

### Script Loading
- TikTok Pixel script loads in `/app/layout.tsx` head with ID `D5P3D9BC77U3OQH693UG`
- All event functions wait up to 2 seconds (20 attempts × 100ms) for script to be available
- If script not available, events are skipped (not errored)

### PII Hashing
- Email, phone, and external IDs are hashed with SHA-256
- Server-side hashing preferred (Node.js crypto module)
- Client-side hashing uses `hashSHA256()` function

### Error Handling
- All events wrapped in try-catch
- Errors logged to console but don't break user flow
- Graceful fallback if TikTok script unavailable

### Session Storage
- Purchase data stored before checkout
- Retrieved on success page for detailed tracking
- Cleared after successful event fire

## Testing & Debugging

### Browser Console
Look for `[v0] TikTok` logs:
\`\`\`
[v0] TikTok - Script available after 0 ms
[v0] TikTok - ViewContent tracked
[v0] TikTok - AddToCart tracked
[v0] TikTok - InitiateCheckout tracked
[v0] TikTok - AddPaymentInfo tracked
[v0] TikTok - Purchase tracked
\`\`\`

### TikTok Ads Manager
- Events viewable in TikTok Ads Manager → Events
- Can take 15-30 minutes to appear
- Check pixel ID: `D5P3D9BC77U3OQH693UG`

## Future Enhancements

- Implement `AddToWishlist` if favorites feature added
- Implement `Search` for product search feature
- Implement `CompleteRegistration` if registration added
- Add custom audience building based on events
- Setup conversion tracking for ROI measurement
