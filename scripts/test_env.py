import os
import sys

print(f"Python: {sys.version}")
print(f"SUPABASE_URL: {os.environ.get('NEXT_PUBLIC_SUPABASE_URL', 'NAO DEFINIDO')}")
print(f"SERVICE_KEY: {'DEFINIDO' if os.environ.get('SUPABASE_SERVICE_ROLE_KEY') else 'NAO DEFINIDO'}")
print("OK")
