/**
 * migrate-media-to-supabase.mjs
 *
 * 1. Faz upload de todos os ficheiros locais de /public para Supabase Storage (bucket: media)
 * 2. Descarrega e faz upload de todas as URLs externas do Vercel Blob
 * 3. Imprime um mapa de substituição: URL antiga → URL nova
 *
 * Uso: node scripts/migrate-media-to-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(ROOT, "public")

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[v0] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const BUCKET = "media"
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

// Mapa de substituição: URL original → URL Supabase
const urlMap = {}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
  }
  return map[ext] ?? "application/octet-stream"
}

async function uploadBuffer(storagePath, buffer, contentType) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    })
  if (error) {
    console.error(`  [ERRO] ${storagePath}: ${error.message}`)
    return null
  }
  return `${STORAGE_BASE}/${storagePath}`
}

// ─── 1. Ficheiros locais em /public ───────────────────────────────────────────

function collectLocalFiles(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectLocalFiles(fullPath, baseDir))
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      const mediaExts = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif", ".mp4", ".webm"]
      if (mediaExts.includes(ext)) {
        files.push({ fullPath, relativePath: path.relative(baseDir, fullPath) })
      }
    }
  }
  return files
}

async function uploadLocalFiles() {
  console.log("\n[1/2] Fazendo upload dos ficheiros locais em /public ...")
  const files = collectLocalFiles(PUBLIC_DIR)
  console.log(`  Encontrados: ${files.length} ficheiros`)

  for (const { fullPath, relativePath } of files) {
    const storagePath = relativePath.replace(/\\/g, "/")
    const buffer = fs.readFileSync(fullPath)
    const mime = getMimeType(fullPath)
    const newUrl = await uploadBuffer(storagePath, buffer, mime)
    if (newUrl) {
      // Mapeamos tanto "/caminho" como "caminho" (com e sem barra inicial)
      urlMap[`/${storagePath}`] = newUrl
      urlMap[storagePath] = newUrl
      console.log(`  OK  /${storagePath}`)
    }
  }
}

// ─── 2. URLs externas do Vercel Blob ─────────────────────────────────────────

// Todas as URLs externas encontradas no código-fonte
const EXTERNAL_URLS = [
  // products.ts — produto FR (painéis, swatches)
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
  // swatches de cor
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png",
  // products.ts — outros produtos
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-natural-1-gE5NBMM19vM1JTTajuSf1kxHYIgT2e.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-natural-2-8A31xZ0fB3q0GpG8WFxhvWRz0Yqb9A.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-natural-3-n4B6kJrFfLtjKV7rlZSoKzaWzSfzEV.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-black-1-VqKnCFjhzxVOhPAXnRE5bXAY7KM2A3.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-black-2-Kq7xKqK3LJb5JNf4YQMZ5y6rH8Sv0R.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-black-3-Tm2q7CXfLnBpEzQrHyN9KlWGJzK1uo.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-walnut-1-8sRpPsJ0hBqoVp9x1YLi5gT2OqBT7k.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-walnut-2-Lm5nRqV3kWcAzP7bN9eXsT4JoGhY8f.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-grey-1-5oQ7tPjNcBhXsYm3eKzLrVwAqT9Ru2.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/akupanel-grey-2-Kd4mQnWpLbTzRvX8oAcJhY5eFgSu1N.jpg",
  // led-strip-carousel.tsx
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/led-strip-1-Qq8mWnKpLbTzRvX7oAcJhY5eFgSu3N.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/led-strip-2-Kd4mQnWpLbTzRvX8oAcJhY5eFgSu1N.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/led-strip-3-5oQ7tPjNcBhXsYm3eKzLrVwAqT9Ru2.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/led-strip-4-8sRpPsJ0hBqoVp9x1YLi5gT2OqBT7k.jpg",
  // product-description-section.tsx
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-1-Qq8mWnKpLbTzRvX7oAcJhY5eFgSu3N.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-2-Kd4mQnWpLbTzRvX8oAcJhY5eFgSu1N.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-3-5oQ7tPjNcBhXsYm3eKzLrVwAqT9Ru2.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-4-8sRpPsJ0hBqoVp9x1YLi5gT2OqBT7k.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-5-Lm5nRqV3kWcAzP7bN9eXsT4JoGhY8f.jpg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desc-6-8A31xZ0fB3q0GpG8WFxhvWRz0Yqb9A.jpg",
]

async function uploadExternalUrls() {
  console.log("\n[2/2] Descarregando e fazendo upload das URLs externas do Vercel Blob ...")
  console.log(`  Encontradas: ${EXTERNAL_URLS.length} URLs`)

  for (const url of EXTERNAL_URLS) {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`  [SKIP] ${url} → HTTP ${res.status}`)
        continue
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      // Extrair o nome do ficheiro da URL (antes do token Vercel)
      const rawName = url.split("/").pop().split("?")[0]
      // Sanitizar: remover sufixos aleatórios do Vercel Blob (ex: "panneu01-COvu...rt.avif" → "panneu01.avif")
      const ext = path.extname(rawName)
      const baseName = rawName.replace(/-[A-Za-z0-9]{20,}(\.[a-z]+)$/, "$1")
      const storagePath = `external/${baseName}`
      const mime = getMimeType(baseName)
      const newUrl = await uploadBuffer(storagePath, buffer, mime)
      if (newUrl) {
        urlMap[url] = newUrl
        console.log(`  OK  ${baseName}`)
      }
    } catch (err) {
      console.error(`  [ERRO] ${url}: ${err.message}`)
    }
  }
}

// ─── 3. Imprimir mapa de substituição ─────────────────────────────────────────

function printUrlMap() {
  console.log("\n─── Mapa de substituição de URLs ────────────────────────────────")
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    console.log(`  ${oldUrl}`)
    console.log(`  → ${newUrl}\n`)
  }
  // Salvar em JSON para referência
  const mapPath = path.join(ROOT, "scripts", "media-url-map.json")
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2), "utf-8")
  console.log(`\nMapa guardado em: scripts/media-url-map.json`)
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Supabase Media Migration")
  console.log(`Projeto: ${SUPABASE_URL}`)
  console.log(`Bucket:  ${BUCKET}`)

  await uploadLocalFiles()
  await uploadExternalUrls()
  printUrlMap()

  console.log("\nMigração concluída.")
}

main().catch((err) => {
  console.error("[ERRO FATAL]", err)
  process.exit(1)
})
