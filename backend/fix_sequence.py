import json
import urllib.request
import urllib.error

SUPABASE_URL = "https://yhufbseectjbygvcjcxa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodWZic2VlY3RqYnlndmNqY3hhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzYwMjk0MiwiZXhwIjoyMDk5MTc4OTQyfQ.WgU6E7kRkqdP2jaYJgZqFiregww__81B25GYvCeCSXc"

def fix_sequence(table_name, dummy_data):
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = json.dumps(dummy_data).encode('utf-8')
    success_id = None
    
    print(f"\nAdvancing sequence for {table_name}...")
    for i in range(50):
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                success_id = result[0]['id']
                print(f"[{table_name}] Success on iteration {i}, assigned ID: {success_id}")
                break
        except urllib.error.HTTPError as e:
            if e.code == 409:
                err_body = e.read().decode('utf-8')
                # print(f"[{table_name}] Iter {i}: 409 Conflict. Sequence advanced.")
            else:
                print(f"[{table_name}] Iter {i}: Error {e.code} - {e.read().decode('utf-8')}")
                break
    
    # If we succeeded, we should delete the dummy record.
    if success_id is not None:
        delete_url = f"{SUPABASE_URL}/rest/v1/{table_name}?id=eq.{success_id}"
        req_del = urllib.request.Request(delete_url, headers=headers, method='DELETE')
        try:
            with urllib.request.urlopen(req_del) as response:
                print(f"[{table_name}] Successfully deleted dummy record with ID {success_id}")
        except Exception as e:
            print(f"[{table_name}] Failed to delete dummy record: {e}")

if __name__ == "__main__":
    tables = {
        "tech_stacks": {"name": "DUMMY", "category": "DUMMY", "proficiency": 1},
        "academics": {"institution": "DUMMY", "degree": "DUMMY", "start_date": "DUMMY", "end_date": "DUMMY"},
        "socials": {"platform": "DUMMY", "url": "DUMMY"},
        "resume_experience": {"role": "DUMMY", "company": "DUMMY", "period": "DUMMY", "description": "DUMMY", "tags": "DUMMY"},
        "resume_education": {"degree": "DUMMY", "institution": "DUMMY", "period": "DUMMY"},
        "resume_certifications": {"name": "DUMMY", "issuer": "DUMMY", "year": "DUMMY"},
    }
    
    for tbl, dummy in tables.items():
        fix_sequence(tbl, dummy)
