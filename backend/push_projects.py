import json
import os
import urllib.request
import urllib.error

# Retrieve env variables manually or assume they are copied from frontend/.env.local
SUPABASE_URL = "https://yhufbseectjbygvcjcxa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlodWZic2VlY3RqYnlndmNqY3hhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzYwMjk0MiwiZXhwIjoyMDk5MTc4OTQyfQ.WgU6E7kRkqdP2jaYJgZqFiregww__81B25GYvCeCSXc"

def push_projects():
    # Load JSON data
    json_path = os.path.join(os.path.dirname(__file__), "..", "portfolio_data.json")
    with open(json_path, 'r', encoding='utf-8') as f:
        projects_data = json.load(f)

    print(f"Loaded {len(projects_data)} projects from JSON")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Fetch existing projects to get their IDs
    fetch_url = f"{SUPABASE_URL}/rest/v1/projects?select=id,slug"
    req_fetch = urllib.request.Request(fetch_url, headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"})
    existing_map = {}
    try:
        with urllib.request.urlopen(req_fetch) as response:
            existing = json.loads(response.read().decode('utf-8'))
            for item in existing:
                existing_map[item['slug']] = item['id']
    except Exception as e:
        print(f"Failed to fetch existing projects: {e}")
        return
    
    for pd in projects_data:
        tags_str = pd.get("tags", [])
        if isinstance(tags_str, list):
            tags_str = ", ".join(tags_str)
            
        proj = {
            "title": pd["title"],
            "slug": pd["slug"],
            "description": pd["description"],
            "content": pd["content"],
            "image_url": pd.get("image_url"),
            "live_url": pd.get("live_url"),
            "github_url": pd.get("github_url"),
            "tags": tags_str,
            "orbit_radius": pd.get("orbit_radius", 1.5),
            "orbit_speed": pd.get("orbit_speed", 0.5)
        }
        
        # If exists, PATCH
        if pd["slug"] in existing_map:
            proj_id = existing_map[pd["slug"]]
            url = f"{SUPABASE_URL}/rest/v1/projects?id=eq.{proj_id}"
            req = urllib.request.Request(url, data=json.dumps(proj).encode('utf-8'), headers=headers, method='PATCH')
            print(f"Updating {pd['title']} (ID: {proj_id})...")
        else:
            url = f"{SUPABASE_URL}/rest/v1/projects"
            req = urllib.request.Request(url, data=json.dumps(proj).encode('utf-8'), headers=headers, method='POST')
            print(f"Inserting {pd['title']}...")
            
        try:
            with urllib.request.urlopen(req) as response:
                pass
        except urllib.error.HTTPError as e:
            print(f"  Failed! Status: {e.code}")
            print(" ", e.read().decode('utf-8'))
        except Exception as e:
            print(f"  Error: {e}")

    print("Done pushing projects to Supabase.")

if __name__ == "__main__":
    push_projects()
