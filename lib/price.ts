/**
 * Format price with proper decimal handling
 * Prevents floating point precision issues
 */
export function formatPrice(price: number, currency: string = "GBP"): string {
  // Ensure we're working with a valid number
  const validPrice = Number.isFinite(price) ? price : 0
  
  // Round to 2 decimal places to avoid floating point errors
  const roundedPrice = Math.round(validPrice * 100) / 100
  
  // Format based on currency
  let currencySymbol = "£"
  if (currency === "EUR") currencySymbol = "€"
  else if (currency === "BRL") currencySymbol = "R$"
  
  return `${currencySymbol}${roundedPrice.toFixed(2)}`
}

/**
 * Parse quantity input, ensuring it's a valid positive integer
 */
export function parseQuantity(value: any): number {
  const parsed = parseInt(String(value), 10)
  
  // Return NaN if invalid, which can be handled by caller
  if (!Number.isInteger(parsed)) return NaN
  
  return parsed
}

/**
 * Clamp quantity between min and max
 */
export function clampQuantity(quantity: number, min: number = 1, max: number = 100): number {
  const clamped = Math.max(min, Math.min(Math.round(quantity), max))
  return Number.isInteger(clamped) ? clamped : min
}

/**
 * Calculate cart subtotal with proper precision
 */
export function calculateSubtotal(items: Array<{ price: number; quantity: number }>): number {
  const total = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity
    // Round each item to avoid accumulating floating point errors
    return sum + Math.round(itemTotal * 100) / 100
  }, 0)
  
  // Final round to handle any remaining floating point errors
  return Math.round(total * 100) / 100
}
