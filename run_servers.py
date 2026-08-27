import os
import re
import sys
import time
import signal
import subprocess
import json

# Define log and file paths
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(WORKSPACE_DIR, "tunnel.log")
JSON_FILE = os.path.join(WORKSPACE_DIR, "backend_url.json")

print("=" * 60)
print("🚀 Starting JIET Chatbot Backend & Secure Tunnel...")
print("=" * 60)

# Clear old log and json files if any
for path in [LOG_FILE, JSON_FILE]:
    if os.path.exists(path):
        try:
            os.remove(path)
        except Exception:
            pass

# 1. Start FastAPI server using uvicorn
print("👉 Starting FastAPI backend (uvicorn main:app)...")
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd=WORKSPACE_DIR,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

# Wait a brief moment for uvicorn to bind to port 8000
time.sleep(2.0)

if backend_proc.poll() is not None:
    print("❌ Failed to start FastAPI backend. Please check if port 8000 is occupied.")
    sys.exit(1)

print("✅ FastAPI backend is running on http://127.0.0.1:8000")

# 2. Start cloudflared tunnel
print("👉 Starting Cloudflare Tunnel (cloudflared)...")
try:
    with open(LOG_FILE, "w") as log_file:
        tunnel_proc = subprocess.Popen(
            ["/opt/homebrew/bin/cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"],
            cwd=WORKSPACE_DIR,
            stdout=log_file,
            stderr=subprocess.STDOUT
        )
except FileNotFoundError:
    # Fallback to system path lookup if not in homebrew bin
    with open(LOG_FILE, "w") as log_file:
        tunnel_proc = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", "http://127.0.0.1:8000"],
            cwd=WORKSPACE_DIR,
            stdout=log_file,
            stderr=subprocess.STDOUT
        )

def cleanup(signum=None, frame=None):
    print("\n🛑 Shutting down servers gracefully...")
    try:
        backend_proc.terminate()
        backend_proc.wait(timeout=3)
    except Exception:
        pass
    try:
        tunnel_proc.terminate()
        tunnel_proc.wait(timeout=3)
    except Exception:
        pass
    print("👋 Goodbye!")
    sys.exit(0)

# Register signals for clean termination
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

# 3. Poll tunnel.log for the quick tunnel URL
print("👉 Waiting for Cloudflare to assign a secure tunnel URL...")
tunnel_url = None
start_time = time.time()
timeout = 30 # seconds

while time.time() - start_time < timeout:
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            content = f.read()
            match = re.search(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com", content)
            if match:
                tunnel_url = match.group(0)
                break
    time.sleep(0.5)

if tunnel_url:
    print("\n" + "=" * 60)
    print("🎉 SECURE TUNNEL ONLINE!")
    print(f"🔗 URL: {tunnel_url}")
    print("=" * 60)
    
    # 4. Write URL to backend_url.json
    print("👉 Saving tunnel URL to backend_url.json...")
    with open(JSON_FILE, "w") as f:
        json.dump({"url": tunnel_url}, f)
        
    # 5. Automatically push to GitHub Pages repo
    print("👉 Automatically syncing tunnel URL with GitHub Pages deployment...")
    try:
        subprocess.run(["git", "add", "backend_url.json"], cwd=WORKSPACE_DIR, check=True)
        subprocess.run(["git", "commit", "-m", "Auto-update secure tunnel URL [skip ci]"], cwd=WORKSPACE_DIR, check=True)
        
        # Push directly using the authenticated origin remote
        subprocess.run(["git", "push", "origin", "main"], cwd=WORKSPACE_DIR, check=True)
        print("✅ Sync complete! Your GitHub Pages chatbot is now connected automatically.")
    except Exception as e:
        print(f"⚠️ Git push failed: {e}")
        print("👉 Please manually push backend_url.json or run git push.")
else:
    print("❌ Could not retrieve quick tunnel URL automatically in 30 seconds.")
    print(f"👉 Please check the logs in {LOG_FILE} manually.")

# Keep the script running to keep subprocesses alive
try:
    while True:
        # Check if subprocesses died
        if backend_proc.poll() is not None:
            print("❌ Backend process terminated unexpectedly.")
            cleanup()
        if tunnel_proc.poll() is not None:
            print("❌ Tunnel process terminated unexpectedly.")
            cleanup()
        time.sleep(1)
except KeyboardInterrupt:
    cleanup()
