// lib/meta/hash.ts
import crypto from "crypto"

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

function normEmail(v?: string) {
  if (!v) return undefined
  const x = v.trim().toLowerCase()
  return x ? sha256(x) : undefined
}

function normName(v?: string) {
  if (!v) return undefined
  const x = v.trim().toLowerCase()
  return x ? sha256(x) : undefined
}

function normCityState(v?: string) {
  if (!v) return undefined
  const x = v.trim().toLowerCase()
  return x ? sha256(x) : undefined
}

function normZip(v?: string) {
  if (!v) return undefined
  const x = v.trim().toLowerCase().replace(/\s+/g, "")
  return x ? sha256(x) : undefined
}

// Phone MUST be E.164 before hashing (Meta requirement)
// For UK: if "07..." => +44 + drop leading 0
function toE164Phone(phone?: string, country?: string) {
  if (!phone) return undefined

  let p = phone.trim()
  if (!p) return undefined

  // Normalize separators
  p = p.replace(/[()\-\s]/g, "")

  // 00 prefix -> +
  if (p.startsWith("00")) p = "+" + p.slice(2)

  // If already E.164
  if (p.startsWith("+")) {
    p = "+" + p.slice(1).replace(/\D/g, "")
    return p.length > 1 ? p : undefined
  }

  const c = (country || "GB").toUpperCase()

  // UK heuristic (your store is UK focused)
  if (c === "GB") {
    // 07xxxxxxxxx => +447xxxxxxxxx
    if (p.startsWith("0")) p = p.slice(1)
    if (p.startsWith("7")) return "+44" + p.replace(/\D/g, "")
  }

  // Fallback: digits only (not ideal, but better than empty)
  const digits = p.replace(/\D/g, "")
  if (!digits) return undefined

  // If user passed country code without +
  if (digits.length >= 10) return "+" + digits

  return undefined
}

function normPhone(phone?: string, country?: string) {
  const e164 = toE164Phone(phone, country)
  return e164 ? sha256(e164) : undefined
}

export function hashUserData(input: {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  externalId?: string
  dateOfBirth?: string
  gender?: string
}) {
  const out: Record<string, string> = {}

  const em = normEmail(input.email)
  if (em) out.em = em

  const ph = normPhone(input.phone, input.country)
  if (ph) out.ph = ph

  const fn = normName(input.firstName)
  if (fn) out.fn = fn

  const ln = normName(input.lastName)
  if (ln) out.ln = ln

  const ct = normCityState(input.city)
  if (ct) out.ct = ct

  const st = normCityState(input.state)
  if (st) out.st = st

  const zp = normZip(input.zip)
  if (zp) out.zp = zp

  const country = input.country?.trim().toLowerCase()
  if (country) out.country = country

  if (input.externalId) {
    const ex = input.externalId.trim()
    if (ex) out.external_id = sha256(ex)
  }

  if (input.dateOfBirth) {
    const dob = input.dateOfBirth.trim().replace(/\D/g, "")
    if (dob) out.db = sha256(dob)
  }

  if (input.gender) {
    const g = input.gender.trim().toLowerCase()
    if (g) out.ge = sha256(g)
  }

  return out
}
