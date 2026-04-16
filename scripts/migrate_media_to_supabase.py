"""
migrate_media_to_supabase.py

1. Faz upload de todos os ficheiros locais de /public para Supabase Storage (bucket: media)
2. Descarrega e faz upload de todas as URLs externas do Vercel Blob
3. Guarda o mapa URL antiga → URL nova em scripts/media-url-map.json
"""

import os
import json
import mimetypes
import urllib.request
import urllib.error
from pathlib import Path

# ─── Configuração ──────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
BUCKET       = "media"
STORAGE_BASE = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}"
UPLOAD_BASE  = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}"

ROOT       = Path(__file__).parent.parent
PUBLIC_DIR = ROOT / "public"

MEDIA_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif", ".mp4", ".webm"}

url_map: dict[str, str] = {}

# ─── Helpers ──────────────────────────────────────────────────────────────────

def get_mime(path: str) -> str:
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"


def upload_bytes(storage_path: str, data: bytes, content_type: str) -> str | None:
    """Faz upload de bytes para o Supabase Storage e retorna a URL pública."""
    url = f"{UPLOAD_BASE}/{storage_path}"
    headers = {
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            if resp.status in (200, 201):
                return f"{STORAGE_BASE}/{storage_path}"
            print(f"  [WARN] {storage_path}: HTTP {resp.status}")
            return None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  [ERRO] {storage_path}: HTTP {e.code} — {body[:200]}")
        return None
    except Exception as e:
        print(f"  [ERRO] {storage_path}: {e}")
        return None


# ─── 1. Ficheiros locais em /public ───────────────────────────────────────────

def collect_local_files() -> list[tuple[Path, str]]:
    """Retorna lista de (caminho_absoluto, caminho_relativo_a_public)."""
    results = []
    for p in PUBLIC_DIR.rglob("*"):
        if p.is_file() and p.suffix.lower() in MEDIA_EXTS:
            rel = p.relative_to(PUBLIC_DIR)
            results.append((p, str(rel).replace("\\", "/")))
    return results


def upload_local_files():
    print("\n[1/2] Upload dos ficheiros locais em /public ...")
    files = collect_local_files()
    print(f"  Encontrados: {len(files)} ficheiros")
    for abs_path, rel in files:
        data = abs_path.read_bytes()
        mime = get_mime(str(abs_path))
        new_url = upload_bytes(rel, data, mime)
        if new_url:
            # Mapeamos com e sem barra inicial para cobrir ambas as formas de referência
            url_map[f"/{rel}"] = new_url
            url_map[rel]       = new_url
            print(f"  OK  /{rel}")
        else:
            print(f"  FALHOU  /{rel}")


# ─── 2. URLs externas do Vercel Blob ──────────────────────────────────────────

# URLs externas exactas encontradas no código-fonte do projecto
EXTERNAL_URLS = [
    # Painéis FR (products.ts)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau02-qeu9jY1J99l7kquJK3L2fnpKCxJuHj.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau03-Ji8b2j4tKYBnBXpeqNu9khj7yL7wvV.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau05-GkWwFoSwI1tdI52JGtLrfokd39EcZ6.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau06-RN0no924w98dCR2WLKu9Lc5ix1yxsd.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau08-MDTCtLoI5jgKXB9aMNIgb6jn6rpRlj.avif",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneau10-st1uB7l391OAmADvAE7RopRDYVevb6.avif",
    # Swatches de cor (products.ts)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_gv77m0gv77m0gv77-2ZuSE03hVAhko9zJULiZyynQuzvSro.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_v6k2hsv6k2hsv6k2-WlF4p8OnMPN9VN2jMsVPIoGPJUxmAU.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_y18qr9y18qr9y18q-nzi1de1MXOo3sji65NDIhMdbxWOdIk.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_hoylswhoylswhoyl-IspXGlydLXx9MoShiAKqZWmOiQQpwj.png",
    # led-strip-carousel.tsx
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0202-FgYEc2VLFBKleJV7PYlgETikXoR8mG.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0303-gogSHAtk3fgrlc95hSLuauXIeSc1We.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED030303-P4LLJ1QfKkKzSLlIC8ahDalqeFtXkt.jpg",
    # product-description-section.tsx (flexible images)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible01-4OcwUWDlOibpyftWOQHwyW3JJ7BHKW.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible02-tl9EQ27LMTMWC5PHKFtE6Mhl5tGIBF.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible03-rKWhKKDjSwncUNrOBiupKZwmhzGzHv.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible04-oKR2EuRKRtinS7LpkwwJ01dYttAtIZ.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible05-j23M8jQWwN5RIksM85S9SkqUFHLoMC.jpg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible09-bWbjAgzzXv47tlhHS9MmhhwSUBKYwa.jpg",
    # acoustic-line-section.tsx
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Caracteristicas-Facil-de-instalar-tTBaUKwKi4AyDqZpyQSaRsdncnw4Uf.webp",
    # tableau-madrid-page.tsx
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_iflkykiflkykiflk-14ui5eCJO8pRc8M5c39UDE3wbYdvWl.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_49z2p49z2p49z2p4.png-7tVfBDjzuQoxvZHIySLVUgg9vuLsF1.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_ho4ec5ho4ec5ho4e-2UOOEE3fBhit8jtumSwUCqnRq9qgrb.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17_39_26_187_lr01427-filete-preta%20%281%29-9tbzZKTDsBeo3Zh5UCm6vWsOFY4A2q.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_13_758_11_2_1_119_lr01427ambiente03%20%282%29-rKVz9Zs6yc0iLmDktTFO4xdy6Wk4Rh.webp",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11_50_05_829_11_2_1_169_lr01427destaque-3rTBVWdA4H0XQmcV9lYEdKBX5Mv0eo.webp",
    # checkout-fr/page.tsx
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg",
    # succes-fr (kit-ruban-led)
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kit-ruban-led-encastre-fr.jpg",
    # stripe-checkout-fr.tsx (lidas a seguir se necessário)
]


def sanitize_filename(raw: str) -> str:
    """Remove o sufixo aleatório do Vercel Blob para obter um nome limpo."""
    import re
    # Remove sufixos como -NcQN4b3GARfX7EQhQSIcnMbQB9NsFa (20+ chars alfanuméricos antes da extensão)
    clean = re.sub(r"-[A-Za-z0-9]{10,}(\.[a-zA-Z]+)$", r"\1", raw)
    # Remove %20 e outros caracteres URL-encoded
    clean = urllib.parse.unquote(clean)
    # Substituir espaços e caracteres problemáticos
    clean = clean.replace(" ", "_").replace("(", "").replace(")", "")
    return clean


def upload_external_urls():
    import urllib.parse
    print(f"\n[2/2] Download + upload das URLs externas ({len(EXTERNAL_URLS)} URLs) ...")
    for url in EXTERNAL_URLS:
        raw_name = url.split("/")[-1].split("?")[0]
        clean_name = sanitize_filename(raw_name)
        storage_path = f"external/{clean_name}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            mime = get_mime(clean_name)
            new_url = upload_bytes(storage_path, data, mime)
            if new_url:
                url_map[url] = new_url
                print(f"  OK  {clean_name}")
            else:
                print(f"  FALHOU  {clean_name}")
        except Exception as e:
            print(f"  [ERRO] {url[:80]}: {e}")


# ─── 3. Guardar mapa ──────────────────────────────────────────────────────────

def save_url_map():
    map_path = ROOT / "scripts" / "media-url-map.json"
    with open(map_path, "w", encoding="utf-8") as f:
        json.dump(url_map, f, indent=2, ensure_ascii=False)
    print(f"\nMapa guardado em: scripts/media-url-map.json ({len(url_map)} entradas)")
    print("\n─── Amostra do mapa ───────────────────────────────────────────────────")
    for i, (old, new) in enumerate(url_map.items()):
        if i >= 5:
            print(f"  ... e mais {len(url_map) - 5} entradas")
            break
        print(f"  {old[:70]}")
        print(f"  → {new}")
        print()


# ─── main ─────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SERVICE_KEY:
        print("[ERRO] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos.")
        return

    print("=== Supabase Media Migration ===")
    print(f"Projecto : {SUPABASE_URL}")
    print(f"Bucket   : {BUCKET}")
    print(f"Public   : {PUBLIC_DIR}")

    upload_local_files()
    upload_external_urls()
    save_url_map()

    print("\n=== Migração concluída ===")


if __name__ == "__main__":
    main()
