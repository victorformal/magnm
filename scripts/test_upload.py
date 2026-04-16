import os
import urllib.request
import urllib.parse

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
BUCKET = "media"

print("SUPABASE_URL:", SUPABASE_URL)
print("SERVICE_KEY:", "DEFINIDO" if SERVICE_KEY else "VAZIO")

# Teste de upload com dados mínimos
data = b"hello world test"
storage_path = "test/hello.txt"
upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"

headers = {
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "text/plain",
    "x-upsert": "true",
}

req = urllib.request.Request(upload_url, data=data, headers=headers, method="POST")
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode("utf-8")
        print(f"Upload OK: HTTP {resp.status}")
        print(f"Body: {body[:200]}")
except Exception as e:
    print(f"Erro: {e}")
